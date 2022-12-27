import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/timestamp-message.js';

export const createTimestampMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  timestamp = 0,
) => {
  builder.finish(TimestampMessage.createTimestampMessage(builder, timestamp));

  return builder.asUint8Array();
};
