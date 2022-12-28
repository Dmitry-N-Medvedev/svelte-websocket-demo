import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  MoneyMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/money-message.js';

const PAYLOAD_TYPE = MessagePayload.MoneyMessage;

export const createMoneyMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  wallet = 0.0,
  /** @type {number} */
  delta = 0.0,
) => {
  const moneyMessageOffset = MoneyMessage.createMoneyMessage(builder, wallet, delta);
  const messageOffset = Message.createMessage(builder, PAYLOAD_TYPE, moneyMessageOffset);

  Message.finishMessageBuffer(builder, messageOffset);

  return builder.asUint8Array();
};
