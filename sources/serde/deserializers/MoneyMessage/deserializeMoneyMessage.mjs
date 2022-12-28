import flatbuffers from 'flatbuffers';
import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  MoneyMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/money-message.js';

export const deserializeMoneyMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const moneyMessageObject = Message.getRootAsMessage(new flatbuffers.ByteBuffer(byteArray));
  const messageObjectPayloadType = moneyMessageObject.payloadType();

  if (messageObjectPayloadType !== MessagePayload.MoneyMessage) {
    throw new TypeError('message is not if the MoneyMessage type');
  }

  const o = moneyMessageObject.payload(new MoneyMessage());

  return Object.freeze({
    wallet: o.wallet(),
    delta: o.delta(),
  });
};
