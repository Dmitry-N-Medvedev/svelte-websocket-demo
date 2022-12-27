import flatbuffers from 'flatbuffers';
import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/timestamp-message.js';

export const deserializeTimestampMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const buffer = new flatbuffers.ByteBuffer(byteArray);

  return TimestampMessage.getRootAsTimestampMessage(buffer).timestamp();
};
