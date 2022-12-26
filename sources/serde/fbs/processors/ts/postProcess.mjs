/* eslint-disable no-unused-vars */
import {
  resolve,
  join,
} from 'node:path';

export const postProcess = async ({
  sourceDirectory,
  outputDirectory,
  execa,
  log,
}) => {
  const swc = resolve('node_modules/.bin/swc');
  const args = [
    './compiled/ts',
    '--out-dir',
    './compiled/mjs',
    '--config-file',
    '.swcrc',
  ];

  log(swc, args.join(' '));

  return await execa(swc, args);
};
