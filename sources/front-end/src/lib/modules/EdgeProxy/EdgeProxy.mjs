import {
  flatbuffers,
} from 'flatbuffers/js/flatbuffers';
import {
  MoneyMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/money-message.js';
import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/timestamp-message.js';
import {
  MessageTypes,
} from '$lib/constants/MessageTypes.mjs';

export class EdgeProxy {
  #broadcastChannels = {
    /** @type {BroadcastChannel} */
    [MessageTypes.PROXY.FROM_SERVER]: null,
    /** @type {BroadcastChannel} */
    [MessageTypes.PROXY.TO_SERVER]: null,
    /** @type {BroadcastChannel} */
    [MessageTypes.DATA.TIMESTAMP]: null,
    /** @type {BroadcastChannel} */
    [MessageTypes.DATA.MONEY]: null,
  };

  constructor() {}

  async #handleFromServerMessage(/** @type {MessageEvent} */ messageEvent) {
    const messageBytes = new flatbuffers.ByteBuffer(new Uint8Array(messageEvent.data));
    const aFlatbuffer = Message.getRootAsMessage(messageBytes);

    switch(aFlatbuffer.payloadType()) {
      case MessagePayload.NONE: {
        throw new TypeError('unexpected message type: NONE');
      }
      case MessagePayload.TimestampMessage: {
        this.#broadcastChannels[MessageTypes.DATA.TIMESTAMP].postMessage({
          payload: aFlatbuffer.payload(new TimestampMessage()).timestamp(),
        });

        break;
      }
      case MessagePayload.MoneyMessage: {
        const deserializedMoneyMessage = aFlatbuffer.payload(new MoneyMessage());

        const payload = {
          wallet: deserializedMoneyMessage.wallet(),
          delta: deserializedMoneyMessage.delta(),
        };

        this.#broadcastChannels[MessageTypes.DATA.MONEY].postMessage({
          payload,
        });

        break;
      }
      default: {
        console.error('unhandled message type');
      }
    }
  }

  #handleToServerMessage(/** @type {MessageEvent} */ messageEvent) {
    console.log('#handleToServerMessage', messageEvent);
  }

  start() {
    this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER] = new BroadcastChannel(MessageTypes.PROXY.FROM_SERVER);
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER] = new BroadcastChannel(MessageTypes.PROXY.TO_SERVER);
    this.#broadcastChannels[MessageTypes.DATA.TIMESTAMP] = new BroadcastChannel(MessageTypes.DATA.TIMESTAMP);
    this.#broadcastChannels[MessageTypes.DATA.MONEY] = new BroadcastChannel(MessageTypes.DATA.MONEY);

    this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER].addEventListener('message', this.#handleFromServerMessage.bind(this));
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER].addEventListener('message', this.#handleToServerMessage.bind(this));
  }

  stop() {
    this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER].removeEventListener('message', this.#handleFromServerMessage.bind(this));
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER].removeEventListener('message', this.#handleToServerMessage.bind(this));

    for (let broadcastChannel of Object.values(this.#broadcastChannels)) {
      broadcastChannel.close();
      broadcastChannel = undefined;
    }
  }
}
