import flatbuffers from 'flatbuffers';
import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/timestamp-message.mjs';

export const mutateTimestampMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
  /** @type {Number} */
  newTimeStamp = null,
) => {
  TimestampMessage
    .getRootAsTimestampMessage(
      new flatbuffers.ByteBuffer(byteArray),
    )
    .mutate_timestamp(newTimeStamp);

  return byteArray;
};
