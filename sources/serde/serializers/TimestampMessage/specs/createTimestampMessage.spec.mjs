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
  deserializeTimestampMessage,
} from '@dmitry-n-medvedev/deserializers.timestampmessage/deserializeTimestampMessage.mjs';
import {
  createTimestampMessage,
} from '../createTimestampMessage.mjs';

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

  it('should createTimestampMessage', async () => {
    const expectedTimestamp = Date.now();
    const timestampMessage = createTimestampMessage(builder, expectedTimestamp);
    const deserializedTimestamp = deserializeTimestampMessage(timestampMessage);

    expect(deserializedTimestamp).to.equal(expectedTimestamp);
  });
});
