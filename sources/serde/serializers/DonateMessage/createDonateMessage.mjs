import {
  DonateMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/donate-message.js';

export const createDonateMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  money = 0.0,
) => {
  builder.finish(DonateMessage.createDonateMessage(builder, money));

  return builder.asUint8Array();
};
