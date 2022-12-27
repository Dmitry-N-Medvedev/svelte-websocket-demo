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
  deserializeDonateMessage,
} from '@dmitry-n-medvedev/deserializers.donatemessage/deserializeDonateMessage.mjs';
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

  it('should deserializeDonateMessage', async () => {
    const expectedMoney = Math.random() * 10;
    const donateMessage = createDonateMessage(builder, expectedMoney);
    const money = deserializeDonateMessage(donateMessage);

    expect(money).to.equal(expectedMoney);
  });
});
