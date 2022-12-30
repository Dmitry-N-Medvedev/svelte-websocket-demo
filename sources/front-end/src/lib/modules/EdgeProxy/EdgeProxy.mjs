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
import {
  createDonateMessage,
} from '@dmitry-n-medvedev/serializers.donatemessage/createDonateMessage.mjs';

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
  #builder = null;

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

  #handleToServerRequestMessage(/** @type {MessageEvent} */ messageEvent) {
    const {
      data: {
        type,
        payload,
      }
    } = messageEvent;

    switch(type) {
      case MessageTypes.DATA.DONATE: {
        const { donate } = payload;
        const donateMessageBytes = createDonateMessage(this.#builder, donate);

        this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_RAW].postMessage(donateMessageBytes);

        break;
      }
      default: {
        console.error('unknown message type', messageEvent.data);

        break;
      }
    }
  }

  start() {
    this.#builder = new flatbuffers.Builder(0);

    this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER] = new BroadcastChannel(MessageTypes.PROXY.FROM_SERVER);
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_REQ] = new BroadcastChannel(MessageTypes.PROXY.TO_SERVER_REQ);
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_RAW] = new BroadcastChannel(MessageTypes.PROXY.TO_SERVER_RAW);
    this.#broadcastChannels[MessageTypes.DATA.TIMESTAMP] = new BroadcastChannel(MessageTypes.DATA.TIMESTAMP);
    this.#broadcastChannels[MessageTypes.DATA.MONEY] = new BroadcastChannel(MessageTypes.DATA.MONEY);

    this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER].addEventListener('message', this.#handleFromServerMessage.bind(this));
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_REQ].addEventListener('message', this.#handleToServerRequestMessage.bind(this));
  }

  stop() {
    this.#broadcastChannels[MessageTypes.PROXY.FROM_SERVER].removeEventListener('message', this.#handleFromServerMessage.bind(this));
    this.#broadcastChannels[MessageTypes.PROXY.TO_SERVER_REQ].removeEventListener('message', this.#handleToServerRequestMessage.bind(this));

    for (let broadcastChannel of Object.values(this.#broadcastChannels)) {
      broadcastChannel.close();
      broadcastChannel = undefined;
    }

    this.#builder = undefined;
  }
}
