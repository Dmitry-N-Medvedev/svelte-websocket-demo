import {
  MessageTypes,
} from '@dmitry-n-medvedev/common/MessageTypes.mjs';
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
  #channels = null;

  constructor() {
    this.#channels = {
      moneyStoreChannel: null,
      tsStoreChannel: null,
      wsOnlineStatusChannel: null,
    };
  }

  #handleMoneyStoreChannelMessage(messageEvent) {
    if (messageEvent.data.type === MessageTypes.MONEY) {
      MoneyStore.updateMoneyFromServer(messageEvent.data.payload);
    }
  }

  #handleWsOnlineStatusChannelMessage(messageEvent) {
    WSOnlineStatusStore.updateOnlineStatus(messageEvent.data.payload);
  }

  #handleTsStoreChannelMessage(messageEvent) {
    TsStore.updateTsFromServer(messageEvent.data.payload);
  }

  start() {
    this.#channels.moneyStoreChannel = new BroadcastChannel(MessageTypes.MONEY);
    this.#channels.moneyStoreChannel.addEventListener('message', this.#handleMoneyStoreChannelMessage.bind(this));

    this.#channels.tsStoreChannel = new BroadcastChannel(MessageTypes.TS);
    this.#channels.tsStoreChannel.addEventListener('message', this.#handleTsStoreChannelMessage.bind(this));

    this.#channels.wsOnlineStatusChannel = new BroadcastChannel(MessageTypes.ONLINE_STATUS);
    this.#channels.wsOnlineStatusChannel.addEventListener('message', this.#handleWsOnlineStatusChannelMessage.bind(this));
  }

  stop() {
    this.#channels.moneyStoreChannel.removeEventListener('message', this.#handleMoneyStoreChannelMessage.bind(this));
    this.#channels.moneyStoreChannel.close();
    this.#channels.moneyStoreChannel = null;

    this.#channels.tsStoreChannel.removeEventListener('message', this.#handleTsStoreChannelMessage.bind(this));
    this.#channels.tsStoreChannel.close();
    this.#channels.tsStoreChannel = null;

    this.#channels.wsOnlineStatusChannel.removeEventListener('message', this.#handleWsOnlineStatusChannelMessage.bind(this));
    this.#channels.wsOnlineStatusChannel.close();
    this.#channels.wsOnlineStatusChannel = null;
  }
}
