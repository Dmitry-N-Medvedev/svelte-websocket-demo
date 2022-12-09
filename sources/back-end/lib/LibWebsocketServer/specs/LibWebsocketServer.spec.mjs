import util from 'node:util';
import {
  before,
  describe,
  it,
} from 'mocha';
import {
  // eslint-disable-next-line no-unused-vars
  expect,
} from 'chai';
// eslint-disable-next-line no-unused-vars
import WebSocket from 'ws';
import {
  nanoid,
} from 'nanoid';
import {
  LibWebsocketServer,
} from '../LibWebsocketServer.mjs';
import {
  getServerConfig,
} from './helpers/getServerConfig.mjs';
import {
  newClient,
} from './helpers/newClient.mjs';
import {
  MessageTypes,
} from '../messages/serializers/MessageTypes.mjs';

describe('LibWebsocketServer', function describeLibWebsocketServer() {
  const debuglog = util.debug(`${LibWebsocketServer.name}:specs`);
  let serverConfig = null;
  const decoder = new TextDecoder();

  before(async function doBefore() {
    serverConfig = getServerConfig(debuglog);

    debuglog({ serverConfig });
  });

  it('should ping all handlers', async function shouldPingPaths() {
    const doPingPong = async (client = null) => new Promise((ok, fail) => {
      const pingMessage = Buffer.from(nanoid());
      const isPingMasked = true;

      client.on('error', (err) => {
        debuglog(['client:on:error =>', err]);

        return fail(err);
      });

      client.on('open', () => {
        client.ping(pingMessage, isPingMasked, function pingFrameSent(networkError = null) {
          if (networkError !== null) {
            debuglog({
              networkError,
            });

            return fail(networkError);
          }

          debuglog('pingFrameSent');

          return undefined;
        });
      });

      client.on('pong', (dataBuffer = null) => {
        debuglog('on:pong', dataBuffer.toString());

        client.close();
      });

      client.on('close', (code = null, reason = null) => {
        debuglog('client:close', code, `"${reason.toString()}"`);

        return ok();
      });
    });

    let client = newClient(serverConfig.server.proto, serverConfig.server.host, serverConfig.server.port, '/');

    await doPingPong(client);

    client = null;
  });

  it('should receive 3 ts updates', async function shouldReceiveThreeTsUpdates() {
    const receiveThreeTsUpdates = (client = null) => new Promise((ok, fail) => {
      let messageCount = 0;

      client.on('error', (err) => {
        debuglog(['client:on:error =>', err]);

        return fail(err);
      });

      client.on('message', (message = null) => {
        const messageObject = JSON.parse(decoder.decode(message));

        if (messageObject.type === MessageTypes.TS) {
          debuglog('receiveThreeTsUpdates', messageObject);

          messageCount += 1;
        }

        if (messageCount > 2) {
          client.close();
        }
      });

      client.on('close', (code = null, reason = null) => {
        debuglog('client:close', code, `"${reason.toString()}"`);

        return ok();
      });
    });

    let client = newClient(serverConfig.server.proto, serverConfig.server.host, serverConfig.server.port, '/');

    await receiveThreeTsUpdates(client);

    client = null;
  }).timeout(4000);
});
