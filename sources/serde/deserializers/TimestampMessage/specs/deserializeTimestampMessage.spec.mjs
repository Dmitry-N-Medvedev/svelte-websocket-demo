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
  createTimestampMessage,
} from '@dmitry-n-medvedev/serializers.timestampmessage/createTimestampMessage.mjs';
import {
  deserializeTimestampMessage,
} from '../deserializeTimestampMessage.mjs';

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

  it('should deserializeTimestampMessage ( using Flatbuffers Union )', async () => {
    const expectedTimestamp = Date.now();

    const timestampMessage = createTimestampMessage(builder, expectedTimestamp);
    const deserializedTimestamp = deserializeTimestampMessage(timestampMessage);

    expect(deserializedTimestamp).to.equal(expectedTimestamp);
  });
});
