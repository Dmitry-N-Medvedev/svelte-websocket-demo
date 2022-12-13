import {
  sendParent,
  createMachine,
  // interpret,
} from 'xstate';

export const WsMachine = (config, context) => createMachine({
  id: 'WsMachine',
  initial: 'offline',
  predictableActionArguments: true,
  states: {
    offline: {
      on: {
        CONNECT: {
          target: 'online',
        },
      },
    },
    online: {
      entry: [
        sendParent({ type: 'WS.ONLINE' }),
      ],
      on: {
        DISCONNECT: {
          target: 'offline',
        },
      },
    },
  },
}).withConfig(config).withContext(context);

// export const WsMachineInterpreter = (config = null, context = null) => interpret(
//   WsMachine
//     .withConfig(config)
//     .withContext(context),
// )
//   .start();
