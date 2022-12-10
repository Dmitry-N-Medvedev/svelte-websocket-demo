import util from 'node:util';
import uWS from 'uWebSockets.js';
import {
  nanoid,
} from 'nanoid';
import { clear } from 'node:console';
import {
  createServerTSMessage,
} from './messages/serializers/createServerTSMessage.mjs';
import {
  createServerMoneyMessage,
} from './messages/serializers/createServerMoneyMessage.mjs';

const TOPICS = Object.freeze({
  SERVER: {
    TS: 'server/ts',
  },
});
const SHOULD_MESSAGE_BE_BINARY = true;
const SHOULD_MESSAGE_BE_COMPRESSED = false;

export class LibWebsocketServer {
  #config = null;
  // eslint-disable-next-line class-methods-use-this
  #debuglog = () => {};
  #handle = null;
  #server = null;
  #encoder = new TextEncoder();
  #decoder = new TextDecoder();
  #tsInterval = null;
  #moneyInterval = null;

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
            ws.id = nanoid();

            this.#debuglog('client connected', ws.id);

            ws.subscribe(TOPICS.SERVER.TS);
          },
          message: (ws = null, message = null, isBinary = false) => {
            const messageObject = JSON.parse(this.#decoder.decode(message));

            switch (messageObject.type) {
              case 'donate': {
                this.#debuglog(`[${ws.id}] should donate ${messageObject.payload}`);

                const donateMessage = createServerMoneyMessage(0 - messageObject.payload);

                ws.send(donateMessage, isBinary);

                break;
              }
              default: {
                this.#debuglog(`unknown message type: ${messageObject.type}`, messageObject);

                break;
              }
            }

            // ws.send(message, isBinary);
          },
          // eslint-disable-next-line no-unused-vars
          close: (ws, code, message) => {
            this.#debuglog('client disconnected', code, this.#decoder.decode(message));
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

      this.#tsInterval = setInterval(() => {
        this.#server.publish(
          TOPICS.SERVER.TS,
          createServerTSMessage(),
          SHOULD_MESSAGE_BE_BINARY,
          SHOULD_MESSAGE_BE_COMPRESSED,
        );
      }, 1000);

      this.#moneyInterval = setInterval(() => {
        this.#server.publish(
          TOPICS.SERVER.TS,
          createServerMoneyMessage(),
          SHOULD_MESSAGE_BE_BINARY,
          SHOULD_MESSAGE_BE_COMPRESSED,
        );
      }, Math.random() * 5000 + 1000);

      // eslint-disable-next-line no-promise-executor-return
      return undefined;
    });
  }

  stop() {
    if (this.#handle) {
      clearInterval(this.#tsInterval);
      clearInterval(this.#moneyInterval);

      uWS.us_listen_socket_close(this.#handle);

      this.#handle = null;
    }

    this.#debuglog(`${this.constructor.name} has stopped listening on ${this.#config.server.host}:${this.#config.server.port}`);
  }
}
