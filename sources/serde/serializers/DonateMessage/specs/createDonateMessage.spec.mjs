import util from 'node:util';
import {
  before,
  after,
  describe,
  it,
} from 'mocha';
import {
  expect,
} from 'chai';
import flatbuffers from 'flatbuffers';
import {
  Message,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message.js';
import {
  MessagePayload,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/message-payload.js';
// import {
//   deserializeDonateMessage,
// } from '@dmitry-n-medvedev/deserializers.donatemessage/deserializeDonateMessage.mjs';
import {
  DonateMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/donate-message.js';
import {
  createDonateMessage,
} from '../createDonateMessage.mjs';

describe('serializers', () => {
  const debuglog = util.debuglog('serializers:specs');
  /** @type {flatbuffers.Builder} */
  let builder = null;

  before(() => {
    builder = new flatbuffers.Builder(1024);
  });

  after(() => {
    builder = undefined;
  });

  it('should deserializeDonateMessage ( using Flatbuffers Union )', async () => {
    const expectedMoney = Math.random() * 10;
    const donateMessageBytes = createDonateMessage(builder, expectedMoney);

    const donateMessageBuffer = new flatbuffers.ByteBuffer(donateMessageBytes);

    const messageObject = Message.getRootAsMessage(donateMessageBuffer);
    const messageObjectPayloadType = messageObject.payloadType();

    expect(messageObjectPayloadType).to.equal(MessagePayload.DonateMessage);

    if (messageObjectPayloadType === MessagePayload.DonateMessage) {
      const money = messageObject.payload(new DonateMessage()).money();

      expect(money).to.equal(expectedMoney);
    }
  });
});
