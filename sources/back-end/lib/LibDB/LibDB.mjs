import {
  EventEmitter,
} from 'node:events';
import {
  LibDBEvents,
} from './LibDBEvents.mjs';

const INITIAL_WALLET = 0.0;

export class LibDB extends EventEmitter {
  // eslint-disable-next-line class-methods-use-this
  #debuglog = () => {};
  /** @type {Map} */
  #db = null;

  constructor(debuglog) {
    super();

    this.#debuglog = debuglog;

    this.#db = new Map();
  }

  get Data() {
    return Object.freeze(this.#db);
  }

  addUser(userId = null) {
    if (userId === null) {
      throw new ReferenceError('userId is undefined');
    }

    this.#db.set(userId, {
      wallet: INITIAL_WALLET,
    });
    this.emit(LibDBEvents.USER_ADDED, {
      payload: {
        userId,
        wallet: INITIAL_WALLET,
      },
    });
  }

  getUserData(userId = null) {
    if (userId === null) {
      throw new ReferenceError('userId is undefined');
    }

    return this.#db.get(userId);
  }

  deleteUser({ clientId = null }) {
    if (clientId === null) {
      throw new ReferenceError('userId is undefined');
    }

    this.#db.delete(clientId);
    this.emit(LibDBEvents.USER_DELETED, {
      payload: {
        clientId,
      },
    });
  }

  addSum(userId = null, delta = 0.0) {
    if (userId === null) {
      throw new ReferenceError('userId is undefined');
    }

    if (delta === 0.0) {
      return;
    }

    const userData = this.#db.get(userId);

    userData.wallet += delta;

    this.#db.set(userId, userData);

    // eslint-disable-next-line no-console
    console.table(this.#db);

    this.emit(LibDBEvents.WALLET_CHANGED, {
      userId,
      wallet: (this.#db.get(userId)).wallet,
      delta,
    });
  }
}
