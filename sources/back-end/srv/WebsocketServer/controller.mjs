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

export class Controller {
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

  constructor() {
    this.#decoder = new TextDecoder();
  }

  // eslint-disable-next-line class-methods-use-this
  #handleUserAdded(userAddedEvent) {
    const {
      payload: {
        userId,
      },
    } = userAddedEvent;

    console.log('handleUserAdded', userId);
  }

  // eslint-disable-next-line class-methods-use-this
  #handleUserDeleted(userDeletedEvent) {
    const {
      payload: {
        userId,
      },
    } = userDeletedEvent;

    console.log('handleUserDeleted', userId);
  }

  // eslint-disable-next-line class-methods-use-this
  #handleSumAdded(sumAddedEvent) {
    const {
      payload: {
        userId,
        sum,
      },
    } = sumAddedEvent;

    console.log('handleSumAdded', userId, sum);
  }

  #initLibDB() {
    this.#libDB = new LibDB();

    this.#libDB.addListener(LibDBEvents.USER_ADDED, this.#handleUserAdded);
    this.#libDB.addListener(LibDBEvents.USER_DELETED, this.#handleUserDeleted);
    this.#libDB.addListener(LibDBEvents.SUM_ADDED, this.#handleSumAdded);
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
      isBinary,
    } = messageEvent;

    const messageObject = JSON.parse(this.#decoder.decode(message));

    console.log(ws, messageObject, isBinary);
  }

  async #initLibWebsocketServer(serverConfig) {
    this.#libWebsocketServer = new LibWebsocketServer(serverConfig);
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

  #startSendingMoneyMessages() {
    this.#moneyInterval = setInterval(() => {
      this.#libWebsocketServer.publish(
        createServerMoneyMessage(),
        Topics.SERVER.MONEY,
      );
    }, Math.random() * 5000 + 1000);
  }

  #stopSendingMoneyMessages() {
    clearInterval(this.#moneyInterval);
  }

  async start(serverConfig) {
    this.#initLibDB();
    await this.#initLibWebsocketServer(serverConfig);

    this.#startSendingTsMessages();
    this.#startSendingMoneyMessages();
  }

  async stop() {
    this.#stopSendingTsMessages();
    this.#stopSendingMoneyMessages();
    this.#finitLibDB();
    await this.#finitLibWebsocketServer();
  }
}
