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
  createDonateMessage,
} from '@dmitry-n-medvedev/serializers.donatemessage/createDonateMessage.mjs';
import {
  deserializeDonateMessage,
} from '../deserializeDonateMessage.mjs';

describe('serializers', () => {
  const debuglog = util.debuglog('serializers:specs');
  /** @type {flatbuffers.Builder} */
  let builder = null;

  before(() => {
    builder = new flatbuffers.Builder(0);
  });

  after(() => {
    builder = undefined;
  });

  it('should deserializeDonateMessage ( using Flatbuffers Union )', async () => {
    const expectedMoney = Math.random() * 10;
    const donateMessageBytes = createDonateMessage(builder, expectedMoney);
    const money = deserializeDonateMessage(donateMessageBytes);

    expect(money).to.equal(expectedMoney);
  });
});
