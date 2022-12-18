export class LibDB {
  /** @type {Map} */
  #db = null;

  constructor() {
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
