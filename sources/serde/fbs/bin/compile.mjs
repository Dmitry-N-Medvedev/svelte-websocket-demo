#!/usr/bin/env -S NODE_ENV=production NODE_DEBUG=WebsocketServer,LibWebsocketServer node
/* eslint-disable no-process-exit */
/* eslint-disable no-console */

import {
  join,
  resolve,
} from 'node:path';
import {
  execa,
} from 'execa';
import {
  CompilerConfig,
} from '../config/CompilerConfig.mjs';
import {
  findCommand,
} from '../helpers/findCommand.mjs';

const COMMANDS = {
  flatc: {
    path: null,
  },
};

const getNotFoundCommandsList = () => {
  const result = [];

  for (const [command, commandDescription] of Object.entries(COMMANDS)) {
    if (commandDescription.path === null && typeof commandDescription.error !== 'undefined') {
      result.push(command);
    }
  }

  return result;
};

for await (const commandName of Object.keys(COMMANDS)) {
  try {
    COMMANDS[commandName].path = await findCommand(execa, commandName);
  } catch (commandNotFoundError) {
    COMMANDS[commandName].error = commandNotFoundError.shortMessage;
  }
}

const notFoundCommands = getNotFoundCommandsList();

if (notFoundCommands.length > 0) {
  console.error(`failed to find the following commands: ${notFoundCommands.join(',')}`);

  process.exit(1);
}

for await (const currentLanguage of CompilerConfig.compileTo) {
  const {
    languages: {
      [currentLanguage]: {
        generatorOptions,
        preProcess,
        postProcess,
      },
    },
  } = CompilerConfig;
  const outputRootDir = resolve(join(CompilerConfig.outputRootDir, currentLanguage));
  const commandLineArgs = [
    `--${currentLanguage}`,
    ...generatorOptions,
    '-o',
    outputRootDir,
    resolve(CompilerConfig.rootFile),
  ];

  try {
    if (typeof preProcess === 'function') {
      await preProcess({
        sourceDirectory: outputRootDir,
        outputDirectory: CompilerConfig.outputRootDir,
        execa,
        log: console.log,
      });
    }

    const {
      stdout,
    } = await execa(COMMANDS.flatc.path, commandLineArgs);

    console.log(stdout);

    if (typeof postProcess === 'function') {
      await postProcess({
        sourceDirectory: outputRootDir,
        outputDirectory: CompilerConfig.outputRootDir,
        execa,
        log: console.log,
      });
    }
  } catch (flatcCompilerError) {
    console.error(flatcCompilerError);

    process.exit(1);
  }
}
