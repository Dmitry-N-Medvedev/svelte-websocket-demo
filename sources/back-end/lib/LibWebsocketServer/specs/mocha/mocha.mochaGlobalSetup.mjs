import util from 'node:util';
import * as dotenv from 'dotenv';
import {
  getServerConfig,
} from '../helpers/getServerConfig.mjs';
import {
  LibWebsocketServer,
} from '../../LibWebsocketServer.mjs';

export async function mochaGlobalSetup() {
  dotenv.config({
    path: './specs/.env',
  });

  const debuglog = util.debug(`${LibWebsocketServer.name}:specs`);
  const serverConfig = getServerConfig(debuglog);

  this.wss = new LibWebsocketServer(serverConfig);

  return await this.wss.start();
}
