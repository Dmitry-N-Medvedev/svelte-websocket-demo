import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/compiled/mjs/ts/svelte-websocket-demo/timestamp-message.mjs';

export const deserializeTimestampMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  timestamp = 0,
) => {
  builder.finish(TimestampMessage.createTimestampMessage(builder, timestamp));

  return builder.asUint8Array();
};
