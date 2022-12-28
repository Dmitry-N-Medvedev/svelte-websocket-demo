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
  createMoneyMessage,
} from '@dmitry-n-medvedev/serializers.moneymessage/createMoneyMessage.mjs';
import {
  deserializeMoneyMessage,
} from '../deserializeMoneyMessage.mjs';

describe('deserializers', () => {
  const debuglog = util.debuglog('deserializers:specs');
  /** @type {flatbuffers.Builder} */
  let builder = null;

  before(() => {
    builder = new flatbuffers.Builder(0);
  });

  after(() => {
    builder = undefined;
  });

  it('should deserializeMoneyMessage ( using Flatbuffers Union )', async () => {
    const expectedInput = {
      wallet: Math.random() * 10,
      delta: Math.random() * 10 + 1,
    };
    const moneyMessageBytes = createMoneyMessage(builder, expectedInput.wallet, expectedInput.delta);
    const output = deserializeMoneyMessage(moneyMessageBytes);

    expect(output).to.deep.equal(expectedInput);
  });
});
