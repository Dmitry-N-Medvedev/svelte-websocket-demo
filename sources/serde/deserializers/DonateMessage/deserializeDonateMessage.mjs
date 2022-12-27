import flatbuffers from 'flatbuffers';
import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  DonateMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/donate-message.js';

export const deserializeDonateMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const messageObject = Message.getRootAsMessage(new flatbuffers.ByteBuffer(byteArray));
  const messageObjectPayloadType = messageObject.payloadType();

  if (messageObjectPayloadType === MessagePayload.DonateMessage) {
    return messageObject.payload(new DonateMessage()).money();
  }

  throw new TypeError(`unexpected message type: ${messageObjectPayloadType}`);
};
