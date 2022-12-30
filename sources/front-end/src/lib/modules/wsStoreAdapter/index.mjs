import {
  MessageTypes,
} from '$lib/constants/MessageTypes.mjs';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  MoneyStore,
} from '$lib/stores/money.store.mjs';
import {
  TsStore,
} from '$lib/stores/ts.store.mjs';
import {
  WSOnlineStatusStore,
} from '$lib/stores/ws-online-status.store.mjs';

export class WsStoreAdapter {
  #broadcastChannels = null;

  constructor() {
    this.#broadcastChannels = {
      moneyStoreChannel: null,
      [MessageTypes.PROTO.CONNECTION.STATUS]: null,
      [MessageTypes.DATA.TIMESTAMP]: null,
      [MessageTypes.DATA.MONEY]: null,
    };
  }

  #handleMoneyStoreChannelMessage(messageEvent) {
    MoneyStore.updateMoneyFromServer(messageEvent.data.payload);
  }

  #handleWsOnlineStatusChannelMessage(messageEvent) {
    WSOnlineStatusStore.updateOnlineStatus(messageEvent.data.payload);
  }

  #handleTsStoreChannelMessage(messageEvent) {
    TsStore.updateTsFromServer(messageEvent.data.payload);
  }

  start() {
    this.#broadcastChannels[MessageTypes.DATA.MONEY] = new BroadcastChannel(MessageTypes.DATA.MONEY);
    this.#broadcastChannels[MessageTypes.DATA.MONEY].addEventListener('message', this.#handleMoneyStoreChannelMessage.bind(this));

    this.#broadcastChannels[MessageTypes.DATA.TIMESTAMP] = new BroadcastChannel(MessageTypes.DATA.TIMESTAMP);
    this.#broadcastChannels[MessageTypes.DATA.TIMESTAMP].addEventListener('message', this.#handleTsStoreChannelMessage.bind(this));

    this.#broadcastChannels[MessageTypes.PROTO.CONNECTION.STATUS] = new BroadcastChannel(MessageTypes.PROTO.CONNECTION.STATUS);
    this.#broadcastChannels[MessageTypes.PROTO.CONNECTION.STATUS].addEventListener('message', this.#handleWsOnlineStatusChannelMessage.bind(this));
  }

  stop() {
    this.#broadcastChannels[MessageTypes.DATA.MONEY].removeEventListener('message', this.#handleMoneyStoreChannelMessage.bind(this));
    this.#broadcastChannels[MessageTypes.DATA.TIMESTAMP].removeEventListener('message', this.#handleTsStoreChannelMessage.bind(this));
    this.#broadcastChannels[MessageTypes.PROTO.CONNECTION.STATUS].removeEventListener('message', this.#handleWsOnlineStatusChannelMessage.bind(this));

    for (let channel of Object.values(this.#broadcastChannels)) {
      channel?.close();
      channel = undefined;
    }
  }
}
