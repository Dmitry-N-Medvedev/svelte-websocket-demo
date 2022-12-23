import {
  LibWebsocketServer,
} from '@dmitry-n-medvedev/libwebsocketserver/LibWebsocketServer.mjs';
import {
  LibWebsocketServerEvents,
} from '@dmitry-n-medvedev/libwebsocketserver/LibWebsocketServerEvents.mjs';
import {
  Topics,
} from '@dmitry-n-medvedev/libwebsocketserver/Topics.mjs';
import {
  LibDB,
} from '@dmitry-n-medvedev/libdb/LibDB.mjs';
import {
  LibDBEvents,
} from '@dmitry-n-medvedev/libdb/LibDBEvents.mjs';
import {
  createServerTSMessage,
} from '@dmitry-n-medvedev/common/messages/serializers/createServerTSMessage.mjs';
import {
  createServerMoneyMessage,
} from '@dmitry-n-medvedev/common/messages/serializers/createServerMoneyMessage.mjs';
import {
  MessageTypes,
} from '@dmitry-n-medvedev/common/MessageTypes.mjs';
import {
  donateMessageHandler,
} from './handlers/donateMessageHandler.mjs';

export class Controller {
  #debuglog = null;
  /** @type {LibWebsocketServer} */
  #libWebsocketServer = null;
  /** @type {LibDB} */
  #libDB = null;
  /** @type {TextDecoder} */
  #decoder = null;
  /** @type {Number} */
  #tsInterval = null;
  /** @type {Number} */
  #moneyInterval = null;

  constructor(debuglog = () => {}) {
    this.#debuglog = debuglog;
    this.#decoder = new TextDecoder();
  }

  // eslint-disable-next-line class-methods-use-this
  #handleUserAdded(userAddedEvent) {
    const {
      payload: {
        // eslint-disable-next-line no-unused-vars
        userId,
      },
    } = userAddedEvent;
  }

  // eslint-disable-next-line class-methods-use-this
  #handleUserDeleted(userDeletedEvent) {
    const {
      payload: {
        // eslint-disable-next-line no-unused-vars
        clientId,
      },
    } = userDeletedEvent;
  }

  // eslint-disable-next-line class-methods-use-this
  #handleWalletChanged(walletChangedEvent) {
    const {
      userId,
      wallet,
      delta,
    } = walletChangedEvent;

    const message = createServerMoneyMessage(wallet, delta);

    this.#libWebsocketServer.sendMessageToClient(userId, message);
  }

  #initLibDB() {
    this.#libDB = new LibDB(this.#debuglog);

    this.#libDB.addListener(LibDBEvents.USER_ADDED, this.#handleUserAdded.bind(this));
    this.#libDB.addListener(LibDBEvents.USER_DELETED, this.#handleUserDeleted.bind(this));
    this.#libDB.addListener(LibDBEvents.WALLET_CHANGED, this.#handleWalletChanged.bind(this));
  }

  #finitLibDB() {
    this.#libDB.removeAllListeners();

    this.#libDB = undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  #handleWebsocketServerMessage(messageEvent) {
    const {
      ws,
      message,
    } = messageEvent;

    const messageObject = JSON.parse(this.#decoder.decode(message));

    switch (messageObject.type) {
      case MessageTypes.DONATE: {
        donateMessageHandler(this.#libDB, ws.id, messageObject, this.#libWebsocketServer.Clients, this.#debuglog);

        break;
      }
      default: {
        console.log('handleWebsocketServerMessage: unknown message type', messageObject);
      }
    }
  }

  #handleClientConnectedEvent({ clientId }) {
    this.#libDB.addUser(clientId);
  }

  #handleClientDisconnectedEvent(clientId) {
    this.#libDB.deleteUser(clientId);
  }

  async #initLibWebsocketServer(serverConfig) {
    this.#libWebsocketServer = new LibWebsocketServer(serverConfig);
    this.#libWebsocketServer.Events.addListener(LibWebsocketServerEvents.CLIENT_CONNECTED, this.#handleClientConnectedEvent.bind(this));
    this.#libWebsocketServer.Events.addListener(LibWebsocketServerEvents.CLIENT_DISCONNECTED, this.#handleClientDisconnectedEvent.bind(this));
    this.#libWebsocketServer.Events.addListener(LibWebsocketServerEvents.MESSAGE_EVENT, this.#handleWebsocketServerMessage.bind(this));

    await this.#libWebsocketServer.start();
  }

  async #finitLibWebsocketServer() {
    this.#libWebsocketServer.Events.removeAllListeners();
    await this.#libWebsocketServer.stop();

    this.#libWebsocketServer = undefined;
  }

  #startSendingTsMessages() {
    this.#tsInterval = setInterval(() => {
      this.#libWebsocketServer.publish(
        createServerTSMessage(),
        Topics.SERVER.TS,
      );
    }, 1000);
  }

  #stopSendingTsMessages() {
    clearInterval(this.#tsInterval);
  }

  #startAddingMoneyToWallets() {
    this.#moneyInterval = setInterval(() => {
      for (const [clientId] of this.#libDB.Data) {
        this.#libDB.addSum(clientId, Math.random() * 10);
      }
    }, 5000);
  }

  #stopAddingMoneyToWallets() {
    clearInterval(this.#moneyInterval);
  }

  async start(serverConfig) {
    this.#initLibDB();
    await this.#initLibWebsocketServer(serverConfig);

    this.#startSendingTsMessages();
    this.#startAddingMoneyToWallets();
  }

  async stop() {
    this.#stopSendingTsMessages();
    this.#stopAddingMoneyToWallets();
    this.#finitLibDB();
    await this.#finitLibWebsocketServer();
  }
}
