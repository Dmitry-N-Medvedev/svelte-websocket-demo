import flatbuffers from 'flatbuffers';
import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/compiled/mjs/ts/svelte-websocket-demo/timestamp-message.mjs';

export const deserializeTimestampMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const buffer = new flatbuffers.ByteBuffer(byteArray);

  return TimestampMessage.getRootAsTimestampMessage(buffer).timestamp();
};
