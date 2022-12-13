import {
  // assign,
  // spawn,
  send,
  createMachine,
  interpret,
} from 'xstate';

const STATES = Object.freeze({
  EXEC_WS_MACHINE: 'execWsMachine',
  OK: 'ok',
  ER: 'er',
});

const FrontEndMachine = createMachine({
  id: 'FrontEndMachine',
  initial: 'initial',
  predictableActionArguments: true,
  states: {
    initial: {
      entry: [
        'log',
        (context) => {
          console.log('FrontEndMachine.context:', { context });
        },
      ],
      always: [
        { target: STATES.EXEC_WS_MACHINE },
      ],
    },
    [STATES.EXEC_WS_MACHINE]: {
      invoke: {
        id: 'WsMachine',
        src: context.machines.WsMachine,
      },
      entry: [
        send(
          { type: 'CONNECT' },
          { to: 'WsMachine' },
        ),
      ],
      on: {
        'WS.ONLINE': {
          target: [STATES.OK],
        },
      },
    },
    //
    [STATES.OK]: {
      type: 'final',
      entry: ['log'],
    },
    [STATES.ER]: {
      type: 'final',
      entry: ['log'],
    },
  },
});

export const FrontEndInterpreter = ({
  config = null,
  context = null,
}) => interpret(FrontEndMachine.withConfig(config).withContext(context)).start();
