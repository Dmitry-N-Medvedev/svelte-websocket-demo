import util from 'node:util';
import {
  beforeEach,
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
import {
  LibDBEvents,
} from '../LibDBEvents.mjs';

describe(LibDB.name, () => {
  const debuglog = util.debuglog(`${LibDB.name}:specs`);

  /** @type {LibDB} */
  let libDB = null;

  beforeEach(() => {
    libDB = new LibDB();
  });

  afterEach(() => {
    libDB = undefined;
  });

  it('should addUser/deleteUser', async () => {
    const userId = nanoid();

    libDB.addUser(userId);

    expect(libDB.Data.has(userId)).to.be.true;

    libDB.deleteUser(userId);

    expect(libDB.Data.has(userId)).to.be.false;
  });

  it(`it should handle ${LibDBEvents.USER_ADDED} event`, async () => {
    const expectedUserId = nanoid();
    const waitForUserAddedEvent = () => new Promise((resolve, reject) => {
      try {
        libDB.addListener(LibDBEvents.USER_ADDED, resolve);
        libDB.addUser(expectedUserId);
      } catch (error) {
        reject(error);
      } finally {
        libDB.removeListener(LibDBEvents.USER_ADDED, resolve);
      }
    });

    const {
      payload: {
        userId,
      },
    } = await waitForUserAddedEvent();

    expect(userId).to.equal(expectedUserId);
  });

  it(`it should handle ${LibDBEvents.USER_DELETED} event`, async () => {
    const expectedUserId = nanoid();
    const waitForUserAddedEvent = (userId) => new Promise((resolve, reject) => {
      try {
        libDB.addListener(LibDBEvents.USER_ADDED, resolve);
        libDB.addUser(userId);
      } catch (error) {
        reject(error);
      } finally {
        libDB.removeListener(LibDBEvents.USER_ADDED, resolve);
      }
    });
    const waitForUserDeletedEvent = (userId) => new Promise((resolve, reject) => {
      try {
        libDB.addListener(LibDBEvents.USER_DELETED, resolve);
        libDB.deleteUser(userId);
      } catch (error) {
        reject(error);
      } finally {
        libDB.removeListener(LibDBEvents.USER_DELETED, resolve);
      }
    });

    const userAddedId = (await waitForUserAddedEvent(expectedUserId)).payload.userId;
    const userDeletedId = (await waitForUserDeletedEvent(userAddedId)).payload.userId;

    expect(userAddedId).to.equal(expectedUserId);
    expect(userDeletedId).to.equal(expectedUserId);
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
