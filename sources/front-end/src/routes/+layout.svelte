<script>
  import 'inter-ui/inter.css';

  import {
    browser as IsInBrowser,
  } from '$app/environment';
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  // import {
  //   WSClient,
  // } from '$lib/modules/ws/index.mjs';
  import Header from '$lib/controls/Header/index.svelte';
  import Footer from '$lib/controls/Footer/index.svelte';
  import {
    WsStoreAdapter,
  } from '$lib/modules/wsStoreAdapter/index.mjs';
  import {
    Ldr,
  } from '$lib/modules/ldr/ldr.mjs';


  /** @type {Ldr | null} */
  let ldr = null;
  // /** @type {WSClient} */
  // // @ts-ignore
  // let wsClient = null;
  /** @type {WsStoreAdapter} */
  // @ts-ignore
  let wsStoreAdapter = null;
  const workersConfig = {
    wsWorker: {
      url: 'ws://127.0.0.1:9090/',
    },
  };

  // const registerSW = async () => {
  //   if ('serviceWorker' in navigator) {
  //     try {
  //       addEventListener('load', async() => {
  //         const registrationResult = await navigator.serviceWorker.register('../service-worker/index.js');

  //         console.log({ registrationResult });
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  onMount(async () => {
    if (IsInBrowser === true) {
      // @ts-ignore
      ldr = new Ldr(workersConfig);

      await ldr?.start();

      wsStoreAdapter = new WsStoreAdapter();
      wsStoreAdapter.start();
      // @ts-ignore
      // wsClient = new WSClient(`ws://127.0.0.1:9090/`);
      // wsClient.start();
    }
  });

  onDestroy(async() => {
    if (IsInBrowser === true) {
      await ldr?.stop();

      ldr = null;

      if (wsStoreAdapter) {
        wsStoreAdapter.stop();
        wsStoreAdapter = null;
      }
    }
  });
</script>

<Header />
<main>
  <slot />
</main>
<Footer />