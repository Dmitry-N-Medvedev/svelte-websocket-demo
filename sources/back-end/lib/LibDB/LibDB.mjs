import {
  EventEmitter,
} from 'node:events';
import {
  LibDBEvents,
} from './LibDBEvents.mjs';

export class LibDB extends EventEmitter {
  /** @type {Map} */
  #db = null;

  constructor() {
    super();

    this.#db = new Map();
  }

  get Data() {
    return Object.freeze(this.#db);
  }

  addUser(userId = null) {
    if (userId === null) {
      throw new ReferenceError('userId is undefined');
    }

    this.#db.set(userId, {});
    this.emit(LibDBEvents.USER_ADDED, {
      payload: {
        userId,
      },
    });
  }

  deleteUser(userId = null) {
    if (userId === null) {
      throw new ReferenceError('userId is undefined');
    }

    this.#db.delete(userId);
  }

  addSum(userId = null, sum = 0.0) {
    if (userId === null) {
      throw new ReferenceError('userId is undefined');
    }

    const userData = this.#db.get(userId);

    userData.sum = sum;

    this.#db.set(userId, userData);
  }
}