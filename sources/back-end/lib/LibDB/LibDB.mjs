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
}
