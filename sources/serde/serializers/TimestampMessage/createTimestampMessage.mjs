import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
import {
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/timestamp-message.js';

const PAYLOAD_TYPE = MessagePayload.TimestampMessage;

export const createTimestampMessage = (
  /** @type {flatbuffers.Builder} */
  builder = null,
  /** @type {number} */
  timestamp = 0,
) => {
  const timestampMessageOffset = TimestampMessage.createTimestampMessage(builder, timestamp);
  const messageOffset = Message.createMessage(builder, PAYLOAD_TYPE, timestampMessageOffset);

  Message.finishMessageBuffer(builder, messageOffset);

  return builder.asUint8Array();
};
