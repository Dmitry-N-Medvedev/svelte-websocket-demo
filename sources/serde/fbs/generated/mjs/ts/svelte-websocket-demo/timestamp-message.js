// automatically generated by the FlatBuffers compiler, do not modify
import * as flatbuffers from 'flatbuffers';

export class TimestampMessage {
  bb = null;
  bb_pos = 0;
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsTimestampMessage(bb, obj) {
    return (obj || new TimestampMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsTimestampMessage(bb, obj) {
    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
    return (obj || new TimestampMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  timestamp() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
  }
  mutate_timestamp(value) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    if (offset === 0) {
      return false;
    }
    this.bb.writeFloat64(this.bb_pos + offset, value);
    return true;
  }
  static startTimestampMessage(builder) {
    builder.startObject(1);
  }
  static addTimestamp(builder, timestamp) {
    builder.addFieldFloat64(0, timestamp, 0.0);
  }
  static endTimestampMessage(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createTimestampMessage(builder, timestamp) {
    TimestampMessage.startTimestampMessage(builder);
    TimestampMessage.addTimestamp(builder, timestamp);
    return TimestampMessage.endTimestampMessage(builder);
  }
}
