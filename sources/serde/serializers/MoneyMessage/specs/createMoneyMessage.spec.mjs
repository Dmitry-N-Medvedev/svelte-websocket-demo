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
  MoneyMessage,
} from '@dmitry-n-medvedev/fbs/generated/mjs/ts/svelte-websocket-demo/money-message.mjs';
import {
  createMoneyMessage,
} from '../createMoneyMessage.mjs';

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

  it('should createMoneyMessage', async () => {
    const expectedWallet = Math.random() * 10;
    const expectedDelta = Math.random() * 10 + 1;
    const moneyMessage = createMoneyMessage(builder, expectedWallet, expectedDelta);
    const buffer = new flatbuffers.ByteBuffer(moneyMessage);

    const moneyMessageObject = MoneyMessage.getRootAsMoneyMessage(buffer);
    const wallet = moneyMessageObject.wallet();
    const delta = moneyMessageObject.delta();

    expect(wallet).to.equal(expectedWallet);
    expect(delta).to.equal(expectedDelta);
  });
});
