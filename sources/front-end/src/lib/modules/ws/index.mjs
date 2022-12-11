import {
  MessageTypes,
} from '@dmitry-n-medvedev/common/MessageTypes.mjs';
import {
  createWsOnlineStatusMessage,
} from '@dmitry-n-medvedev/common/messages/serializers/createWsOnlineStatusMessage.mjs';

const decoder = new TextDecoder();
const encoder = new TextEncoder();
// const broadcastChannels = Object.freeze({
//   ts: new BroadcastChannel(MessageTypes.TS),
//   money: new BroadcastChannel(MessageTypes.MONEY),
//   toServer: new BroadcastChannel('to-server'),
// });

export class WSClient {
  /** @type {WebSocket} */
  #client = null;
  #url = null;
  #shouldStopConnection = true;
  #broadcastChannels = null;

  constructor(url = null) {
    if (url === null) {
      throw new ReferenceError('url is undefined');
    }

    this.#url = url;
    // this.#handleOutgoingMessage.bind(this);
  }

  async #handleMessage(messageEvent = null) {
    if (messageEvent === null) {
      throw new ReferenceError('messageEvent is undefined');
    }

    const messageObject = JSON.parse(decoder.decode(await messageEvent.data.arrayBuffer()));

    (this.#broadcastChannels[messageObject.type])?.postMessage(messageObject);
  };

  async #handleOutgoingMessage(/** @type {MessageEvent} */ messageEvent) {
    this.#client.send(messageEvent.data);
  }

  #handleClientClose(/** @type {CloseEvent} */ closeEvent) {
    let reconnectInTimeout = null;
    const {
      code,
      reason,
      wasClean,
    } = closeEvent;

    console.log('#handleClientClose', code, reason, wasClean);

    const onlineStatus = createWsOnlineStatusMessage(false);
    this.#broadcastChannels.onlineStatus?.postMessage(onlineStatus);

    if (this.#shouldStopConnection === false && reconnectInTimeout === null) {
      reconnectInTimeout = setTimeout(() => {
        clearTimeout(reconnectInTimeout);

        this.start();
      }, 1000);
    }
  }

  #handleClientError(/** @type {Event} */ errorEvent) {
    console.error('#handleClientError', errorEvent);
  }

  #handleClientOpen(/** @type {Event} */ openEvent) {
    const onlineStatus = createWsOnlineStatusMessage(true);
    this.#broadcastChannels.onlineStatus?.postMessage(onlineStatus);

    console.log('#handleClientOpen', openEvent);
  }
  
  start() {
    this.#shouldStopConnection = false;
    this.#broadcastChannels = Object.freeze({
      ts: new BroadcastChannel(MessageTypes.TS),
      money: new BroadcastChannel(MessageTypes.MONEY),
      toServer: new BroadcastChannel('to-server'),
      onlineStatus: new BroadcastChannel(MessageTypes.ONLINE_STATUS)
    });
    this.#client = new WebSocket(this.#url);
    this.#client.addEventListener('message', this.#handleMessage.bind(this));
    this.#client.addEventListener('close', this.#handleClientClose.bind(this));
    this.#client.addEventListener('error', this.#handleClientError.bind(this));
    this.#client.addEventListener('open', this.#handleClientOpen.bind(this));
    this.#broadcastChannels.toServer.addEventListener('message', this.#handleOutgoingMessage.bind(this));
  }

  stop() {
    this.#shouldStopConnection = true;

    if (this.#client) {
      this.#client.removeEventListener('message', this.#handleMessage.bind(this));
      this.#client.removeEventListener('close', this.#handleClientClose.bind(this));
      this.#client.removeEventListener('error', this.#handleClientError.bind(this));
      this.#client.removeEventListener('open', this.#handleClientOpen.bind(this));
      this.#client.close();
    }

    for (const broadcastChannel of Object.values(this.#broadcastChannels)) {
      broadcastChannel.close();
    }

    this.#client = null;
  }
}