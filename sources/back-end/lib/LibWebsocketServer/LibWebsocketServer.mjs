import util from 'node:util';
import {
  EventEmitter,
} from 'node:events';
import uWS from 'uWebSockets.js';
import {
  nanoid,
} from 'nanoid';
// import {
//   MessageTypes,
// } from '@dmitry-n-medvedev/common/MessageTypes.mjs';
// import {
//   createServerTSMessage,
// } from '@dmitry-n-medvedev/common/messages/serializers/createServerTSMessage.mjs';
// import {
//   createServerMoneyMessage,
// } from '@dmitry-n-medvedev/common/messages/serializers/createServerMoneyMessage.mjs';
// import {
//   donateMessageHandler,
// } from './handlers/donateMessageHandler.mjs';
import {
  LibWebsocketServerEvents,
} from './LibWebsocketServerEvents.mjs';
import {
  Topics,
} from './Topics.mjs';

const SHOULD_MESSAGE_BE_BINARY = true;
const SHOULD_MESSAGE_BE_COMPRESSED = true;

export class LibWebsocketServer {
  #config = null;
  // eslint-disable-next-line class-methods-use-this
  #debuglog = () => {};
  #handle = null;
  /** @type {uWS.TemplatedApp} */
  #server = null;
  #encoder = new TextEncoder();
  #decoder = new TextDecoder();
  #tsInterval = null;
  #moneyInterval = null;
  #clients = null;

  #events = null;

  constructor(config = null) {
    if (config === null) {
      throw new ReferenceError('config is undefined');
    }

    this.#debuglog = util.debuglog(this.constructor.name);
    this.#config = Object.freeze({ ...config });
    this.#events = new EventEmitter();
    // this.sendMessageToClient = this.sendMessageToClient.bind(this);
  }

  get IS_RUNNING() {
    return this.#handle !== null;
  }

  get Events() {
    return this.#events;
  }

  get Clients() {
    return this.#clients;
  }

  sendMessageToClient(clientId = null, message = null) {
    if (clientId === null) {
      throw new ReferenceError('clientId is undefined');
    }

    if (message === null) {
      throw new ReferenceError('message is undefined');
    }

    /** @type {uWS.WebSocket} */ const client = this.#clients.get(clientId);

    client.send(message, SHOULD_MESSAGE_BE_BINARY, SHOULD_MESSAGE_BE_COMPRESSED);
    // client.publish(Topics.SERVER.MONEY, message, SHOULD_MESSAGE_BE_BINARY, SHOULD_MESSAGE_BE_COMPRESSED);

    this.#debuglog(`${this.constructor.name}.sendMessageToClient(${clientId})`, client);
  }

  start() {
    return new Promise((ok, fail) => {
      if (this.#handle !== null) {
        this.#debuglog(`${this.constructor.name} has already been started on ${this.#config.server.host}:${this.#config.server.port}`);
        // eslint-disable-next-line no-promise-executor-return
        return fail();
      }

      this.#clients = new Map();

      this.#server = uWS
        .App({})
        .ws('/*', {
          compression: uWS.DEDICATED_COMPRESSOR_3KB,
          maxPayloadLength: 16 * 1024 * 1024,
          maxBackpressure: 1024,
          idleTimeout: 16,
          upgrade: (res, req, context) => {
            this.#debuglog(`${this.constructor.name}.upgrade`);

            // req.forEach((k, v) => {
            //   this.#debuglog(`${k}: ${v}`);
            // });

            const upgradeAborted = {
              isAborted: false,
            };

            res.onAborted(() => {
              upgradeAborted.isAborted = true;
            });

            const url = req.getUrl();
            const secWebSocketKey = req.getHeader('sec-websocket-key');
            const secWebSocketProtocol = req.getHeader('sec-websocket-protocol');
            const secWebSocketExtensions = req.getHeader('sec-websocket-extensions');

            if (upgradeAborted.isAborted === false) {
              res
                .writeStatus('101 Switching Protocols')
                .writeHeader('Set-Cookie', `userId=${nanoid()}`)
                .upgrade(
                  {
                    url,
                  },
                  secWebSocketKey,
                  secWebSocketProtocol,
                  secWebSocketExtensions,
                  context,
                );
            }
          },
          // eslint-disable-next-line no-unused-vars
          open: (ws) => {
            ws.id = nanoid();
            // ws.IP = this.#decoder.decode(ws.getRemoteAddressAsText());
            this.#clients.set(ws.id, ws);

            this.#events.emit(LibWebsocketServerEvents.CLIENT_CONNECTED, {
              clientId: ws.id,
            });

            ws.subscribe(Topics.SERVER.TS);
            ws.subscribe(Topics.SERVER.MONEY);
          },
          message: (ws = null, message = null, isBinary = false) => {
            this.#events.emit(LibWebsocketServerEvents.MESSAGE_EVENT, {
              ws,
              message,
              isBinary,
            });
          },
          // eslint-disable-next-line no-unused-vars
          close: (ws, code, message) => {
            // ws.unsubscribe(Topics.SERVER.TS);

            this.#clients.delete(ws.id);

            this.#events.emit(LibWebsocketServerEvents.CLIENT_DISCONNECTED, {
              clientId: ws.id,
            });
          },
        })
        .any('/*', (res) => {
          res.end('nothing is here');
        })
        .listen(this.#config.server.host, this.#config.server.port, (handle = null) => {
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

  publish(message, messageType) {
    if (this.#handle === null) {
      throw new ReferenceError('server is not started');
    }

    this.#server.publish(
      messageType,
      message,
      SHOULD_MESSAGE_BE_BINARY,
      SHOULD_MESSAGE_BE_COMPRESSED,
    );
  }

  stop() {
    if (this.#handle) {
      clearInterval(this.#tsInterval);
      clearInterval(this.#moneyInterval);

      uWS.us_listen_socket_close(this.#handle);

      this.#handle = null;
      this.#clients = null;
    }

    this.#debuglog(`${this.constructor.name} has stopped listening on ${this.#config.server.host}:${this.#config.server.port}`);
  }
}
