// import { flatbuffers } from 'flatbuffers/js/flatbuffers';
// import {
//   Message, 
// } from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
// import {
//   MessageTypes,
// } from '@dmitry-n-medvedev/common/MessageTypes.mjs';
import {
  MessageTypes,
} from '$lib/constants/MessageTypes.mjs';
import {
  createWsOnlineStatusMessage,
} from '@dmitry-n-medvedev/common/messages/serializers/createWsOnlineStatusMessage.mjs';

// const decoder = new TextDecoder();
// const encoder = new TextEncoder();

export class WSClient {
  /** @type {WebSocket} */
  #client = null;
  #url = null;
  #shouldStopConnection = true;
  #broadcastChannels = null;
  #id = null;

  constructor(url = null) {
    if (url === null) {
      throw new ReferenceError('url is undefined');
    }

    this.#url = url;
  }

  async #handleMessage(messageEvent = null) {
    if (messageEvent === null) {
      throw new ReferenceError('messageEvent is undefined');
    }

    (this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER]).postMessage(messageEvent.data);
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
    this.#broadcastChannels[MessageTypes.PROTO.CONNECTION.STATUS].postMessage(onlineStatus);

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

  #handleClientOpen() {
    const onlineStatus = createWsOnlineStatusMessage(true);

    (this.#broadcastChannels[MessageTypes.PROTO.CONNECTION.STATUS]).postMessage(onlineStatus);
  }

  #handleToServerRawMessages(messageEvent) {
    console.log('#handleToServerRawMessages', messageEvent.data);

    this.#client.send(messageEvent.data);
  }
  
  start() {
    this.stop();

    this.#shouldStopConnection = false;
    this.#broadcastChannels = Object.freeze({
      [MessageTypes.PROXY.FROM_SERVER]: new BroadcastChannel(MessageTypes.PROXY.FROM_SERVER),
      [MessageTypes.PROXY.TO_SERVER_RAW]: new BroadcastChannel(MessageTypes.PROXY.TO_SERVER_RAW),
      [MessageTypes.PROTO.CONNECTION.STATUS]: new BroadcastChannel(MessageTypes.PROTO.CONNECTION.STATUS),
    });

    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_RAW].addEventListener('message', this.#handleToServerRawMessages.bind(this));

    this.#client = new WebSocket(this.#url);

    this.#client.binaryType = 'arraybuffer';

    this.#client.addEventListener('message', this.#handleMessage.bind(this));
    this.#client.addEventListener('close', this.#handleClientClose.bind(this));
    this.#client.addEventListener('error', this.#handleClientError.bind(this));
    this.#client.addEventListener('open', this.#handleClientOpen.bind(this));
  }

  stop() {
    this.#shouldStopConnection = true;

    if (this.#client) {
      this.#client.removeEventListener('message', this.#handleMessage);
      this.#client.removeEventListener('close', this.#handleClientClose);
      this.#client.removeEventListener('error', this.#handleClientError);
      this.#client.removeEventListener('open', this.#handleClientOpen);
      this.#client.close();

      this.#client = undefined;
    }

    if (this.#broadcastChannels) {
      this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_RAW].removeEventListener('message', this.#handleToServerRawMessages.bind(this));

      for (let broadcastChannel of Object.values(this.#broadcastChannels)) {
        broadcastChannel.close();
        broadcastChannel = undefined;
      }
  
      this.#broadcastChannels = undefined;
    }

    this.#client = undefined;
  }
}