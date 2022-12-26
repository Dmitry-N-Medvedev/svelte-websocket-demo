// automatically generated by the FlatBuffers compiler, do not modify
import * as flatbuffers from 'flatbuffers';

export class DonateMessage {
  bb = null;
  bb_pos = 0;
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsDonateMessage(bb, obj) {
    return (obj || new DonateMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsDonateMessage(bb, obj) {
    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
    return (obj || new DonateMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  money() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
  }
  mutate_money(value) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    if (offset === 0) {
      return false;
    }
    this.bb.writeFloat64(this.bb_pos + offset, value);
    return true;
  }
  static startDonateMessage(builder) {
    builder.startObject(1);
  }
  static addMoney(builder, money) {
    builder.addFieldFloat64(0, money, 0.0);
  }
  static endDonateMessage(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createDonateMessage(builder, money) {
    DonateMessage.startDonateMessage(builder);
    DonateMessage.addMoney(builder, money);
    return DonateMessage.endDonateMessage(builder);
  }
}