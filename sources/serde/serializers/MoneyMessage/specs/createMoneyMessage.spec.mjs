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
  deserializeMoneyMessage,
} from '@dmitry-n-medvedev/deserializers.moneymessage/deserializeMoneyMessage.mjs';
import {
  createMoneyMessage,
} from '../createMoneyMessage.mjs';

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

  it('should createMoneyMessage ( using Flatbuffers Union )', async () => {
    const expectedInput = {
      wallet: Math.random() * 10,
      delta: Math.random() * 10 + 1,
    };
    const moneyMessageBytes = createMoneyMessage(builder, expectedInput.wallet, expectedInput.delta);
    const output = deserializeMoneyMessage(moneyMessageBytes);

    expect(output).to.deep.equal(expectedInput);
  });
});
