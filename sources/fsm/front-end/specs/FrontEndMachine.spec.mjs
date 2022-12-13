import util from 'node:util';
import {
  describe,
  it,
  before,
  after,
} from 'mocha';
import {
  expect,
} from 'chai';
import {
  FrontEndInterpreter,
} from '../FrontEndInterpreter.mjs';
import {
  WsMachine,
} from '../machines/WsMachine.mjs';

describe('FrontEndInterpreter', () => {
  const debuglog = util.debuglog(`${FrontEndInterpreter.name}:specs`);
  const log = (context, event) => {
    debuglog(`[ log ] context = ${JSON.stringify(context)}, event.type = ${event.type}`);
  };
  const FrontEndInterpreterConfig = {
    actions: {
      log,
    },
    delays: {},
    guards: {
      isWsMachineAssigned: (context) => {
        const result = context.WsMachine !== null || typeof context.WsMachine !== 'undefined';

        debuglog(`[ guards.isWsMachineAssigned ] result = ${result}`);

        return result;
      },
      // eslint-disable-next-line no-unused-vars
      IsAllObjectsInitialized: (context, event) => {
        debuglog(`[ guards.IsAllObjectsInitialized ] context = ${JSON.stringify(context)}, event.type = ${event.type}`);

        return false;
      },
      IsStoresInitialized: (context, event) => {
        debuglog(`[ guards.IsStoresInitialized ] context = ${JSON.stringify(context)}, event.type = ${event.type}`);

        return true;
      },
    },
    services: {},
  };
  const WsMachineConfig = {
    actions: {
      log,
      delays: {},
      guards: {},
      services: {},
    },
  };
  const WsMachineContext = {};
  const FrontEndInterpreterContext = {
    machines: {
      WsMachine: WsMachine(WsMachineConfig, WsMachineContext),
    },
  };
  let interpreter = null;

  before(() => {
    interpreter = FrontEndInterpreter({
      config: FrontEndInterpreterConfig,
      context: FrontEndInterpreterContext,
    });

    // debuglog(FrontEndInterpreterContext.machineObjects.WsMachine);

    // FrontEndInterpreterContext.machineObjects.WsMachine
    //   .onTransition((state) => {
    //     console.log(`WsMachine.onTransition( ${state.value} )`);
    //   })
    //   .onEvent((event) => {
    //     console.log('WsMachine.onEvent():', event);
    //   })
    //   .onSend((event) => {
    //     console.log('WsMachine.onSend():', event);
    //   })
    //   .onChange((ctx) => {
    //     console.log('WsMachine.onChange():', ctx);
    //   })
    //   .onStop(() => {
    //     console.log('WsMachine.onStop():');
    //   })
    //   .onDone((doneEvent) => {
    //     console.log('WsMachine.onDone():', doneEvent);
    //   });
  });

  after(() => {
    interpreter = null;
  });

  // eslint-disable-next-line no-unused-vars
  it('should succeed', () => new Promise((ok, fail) => {
    interpreter
      .onTransition((state) => {
        debuglog(`FrontEndMachine.onTransition( ${state.value} )`);
      })
      .onEvent((event) => {
        debuglog('FrontEndMachine.onEvent():', event);
      })
      .onSend((event) => {
        debuglog('FrontEndMachine.onSend():', event);
      })
      .onChange((context) => {
        debuglog('FrontEndMachine.onChange():', context);
      })
      .onStop(() => {
        debuglog('FrontEndMachine.onStop():');

        ok();
      })
      .onDone((doneEvent) => {
        debuglog('FrontEndMachine.onDone():', doneEvent);

        ok();
      });

    expect(true).to.be.true;
  }));
});
