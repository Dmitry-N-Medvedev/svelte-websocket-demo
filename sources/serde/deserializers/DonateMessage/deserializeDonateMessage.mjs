import flatbuffers from 'flatbuffers';
import {
  DonateMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/donate-message.js';

export const deserializeDonateMessage = (
  /** @type {Uint8Array} */
  byteArray = null,
) => {
  const buffer = new flatbuffers.ByteBuffer(byteArray);
  const donateMessageObject = DonateMessage.getRootAsDonateMessage(buffer);

  return donateMessageObject.money();
};
