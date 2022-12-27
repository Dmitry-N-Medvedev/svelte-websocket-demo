import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  DonateMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/donate-message.js';

const PAYLOAD_TYPE = MessagePayload.DonateMessage;

export const createDonateMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  money = 0.0,
) => {
  const donateMessageOffset = DonateMessage.createDonateMessage(builder, money);
  const messageOffset = Message.createMessage(builder, PAYLOAD_TYPE, donateMessageOffset);

  Message.finishMessageBuffer(builder, messageOffset);

  return builder.asUint8Array();
};
