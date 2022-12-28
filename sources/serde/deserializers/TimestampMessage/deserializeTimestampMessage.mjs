import flatbuffers from 'flatbuffers';
import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/timestamp-message.js';

export const deserializeTimestampMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const timestampMessageFlatbuffer = Message.getRootAsMessage(new flatbuffers.ByteBuffer(byteArray));
  const messageObjectPayloadType = timestampMessageFlatbuffer.payloadType();

  if (messageObjectPayloadType !== MessagePayload.TimestampMessage) {
    throw new TypeError('message is not a TimestampMessage');
  }

  return timestampMessageFlatbuffer.payload(new TimestampMessage()).timestamp();
};
