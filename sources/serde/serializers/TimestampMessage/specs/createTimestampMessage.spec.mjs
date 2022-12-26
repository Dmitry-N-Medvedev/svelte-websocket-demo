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
  TimestampMessage,
} from '@dmitry-n-medvedev/fbs/compiled/mjs/ts/svelte-websocket-demo/timestamp-message.mjs';
import {
  createTimestampMessage,
} from '../createTimestampMessage.mjs';

describe('Serializers', () => {
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
    const deserialize = (uint8Array) => {
      const buffer = new flatbuffers.ByteBuffer(uint8Array);

      return TimestampMessage.getRootAsTimestampMessage(buffer).timestamp();
    };
    const expectedTimestamp = Date.now();

    const timestampMessage = createTimestampMessage(builder, expectedTimestamp);

    expect(timestampMessage).to.exist;

    const timestamp = deserialize(timestampMessage);

    expect(timestamp).to.equal(expectedTimestamp);
  });
});
