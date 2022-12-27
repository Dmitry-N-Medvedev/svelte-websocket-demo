import {
  MoneyMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/money-message.mjs';

export const createMoneyMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  wallet = 0.0,
  /** @type {number} */
  delta = 0.0,
) => {
  builder.finish(MoneyMessage.createMoneyMessage(builder, wallet, delta));

  return builder.asUint8Array();
};
