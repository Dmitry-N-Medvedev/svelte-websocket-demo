import util from 'node:util';
import uWS from 'uWebSockets.js';

export class LibWebsocketServer {
  #config = null;
  // eslint-disable-next-line class-methods-use-this
  #debuglog = () => {};
  #handle = null;
  #server = null;

  constructor(config = null) {
    if (config === null) {
      throw new ReferenceError('config is undefined');
    }

    this.#debuglog = util.debuglog(this.constructor.name);
    this.#config = Object.freeze({ ...config });
  }

  get IS_RUNNING() {
    return this.#handle !== null;
  }

  start() {
    return new Promise((ok, fail) => {
      if (this.#handle !== null) {
        this.#debuglog(`${this.constructor.name} has already been started on ${this.#config.server.host}:${this.#config.server.port}`);
        // eslint-disable-next-line no-promise-executor-return
        return fail();
      }

      this.#server = uWS
        .App({})
        .ws('/*', {
          compression: uWS.SHARED_COMPRESSOR,
          maxPayloadLength: 16 * 1024 * 1024,
          idleTimeout: 16,
          // eslint-disable-next-line no-unused-vars
          open: (ws) => {
            this.#debuglog('client connected');
          },
          message: (ws = null, message = null, isBinary = false) => {
            this.#debuglog('client message received', message, isBinary);

            ws.send(message, isBinary);
          },
          // eslint-disable-next-line no-unused-vars
          close: (ws, code, message) => {
            this.#debuglog('client disconnected');
          },
        })
        .any('/*', (res) => {
          res.end('nothing is here');
        })
        .listen(this.#config.server.host, this.#config.server.port, async (handle = null) => {
          if (handle === null) {
            fail(new Error(`${this.constructor.name} has failed to listen to ${this.#config.server.host}:${this.#config.server.port}`));
          }

          this.#handle = handle;
          this.#debuglog(`${this.constructor.name} is listening on ${this.#config.server.host}:${this.#config.server.port}`);

          ok();
        });

      // eslint-disable-next-line no-promise-executor-return
      return undefined;
    });
  }

  stop() {
    if (this.#handle) {
      uWS.us_listen_socket_close(this.#handle);

      this.#handle = null;
    }

    this.#debuglog(`${this.constructor.name} has stopped listening on ${this.#config.server.host}:${this.#config.server.port}`);
  }
}
