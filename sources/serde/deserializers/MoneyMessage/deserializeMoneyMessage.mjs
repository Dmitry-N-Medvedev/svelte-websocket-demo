import flatbuffers from 'flatbuffers';
import {
  MoneyMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/money-message.mjs';

export const deserializeMoneyMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const buffer = new flatbuffers.ByteBuffer(byteArray);
  const o = MoneyMessage.getRootAsMoneyMessage(buffer);

  return Object.freeze({
    wallet: o.wallet(),
    delta: o.delta(),
  });
};
