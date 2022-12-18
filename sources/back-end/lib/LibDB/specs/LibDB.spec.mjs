import util from 'node:util';
import {
  before,
  after,
  afterEach,
  describe,
  it,
} from 'mocha';
import {
  expect,
} from 'chai';
import {
  nanoid,
} from 'nanoid';
import {
  LibDB,
} from '../LibDB.mjs';

describe(LibDB.name, () => {
  const debuglog = util.debuglog(`${LibDB.name}:specs`);

  /** @type {LibDB} */
  let libDB = null;

  before(() => {
    libDB = new LibDB();
  });

  afterEach(() => {
    expect(libDB.Data.size).to.equal(0, 'you must clean libDB at the end of each of your tests');
  });

  after(() => {
    libDB = undefined;
  });

  it('should addUser/deleteUser', async () => {
    const userId = nanoid();

    libDB.addUser(userId);

    expect(libDB.Data.has(userId)).to.be.true;

    libDB.deleteUser(userId);

    expect(libDB.Data.has(userId)).to.be.false;
  });

  it('should fail to addUser w/ userId undefined', async () => {
    const userId = undefined;
    let hasProperError = false;

    try {
      libDB.addUser(userId);
    } catch (userIdUndefinedError) {
      expect(userIdUndefinedError instanceof ReferenceError).to.be.true;
      hasProperError = true;
    }

    expect(hasProperError).to.be.true;
  });

  it('should addSum to a user', () => {
    const userId = nanoid();
    const expectedSum = Math.random() * 10 + 1;

    libDB.addUser(userId);
    libDB.addSum(userId, expectedSum);

    const userData = libDB.Data.get(userId);

    expect(userData.sum).to.equal(expectedSum);

    libDB.deleteUser(userId);
  });

  it('should fail to addSum w/ userId undefined', async () => {
    const userId = undefined;
    let hasProperError = false;

    try {
      libDB.addSum(userId, Math.random());
    } catch (userIdUndefinedError) {
      expect(userIdUndefinedError instanceof ReferenceError).to.be.true;
      hasProperError = true;
    }

    expect(hasProperError).to.be.true;
  });
});
