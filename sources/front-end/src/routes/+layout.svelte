<script>
  import 'inter-ui/inter.css';

  import {
    browser as IsInBrowser,
  } from '$app/environment';
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import {
    WSClient,
  } from '$lib/modules/ws/index.mjs';
  import Header from '$lib/controls/Header/index.svelte';
  import Footer from '$lib/controls/Footer/index.svelte';
  import {
    WsStoreAdapter,
  } from '$lib/modules/wsStoreAdapter/index.mjs';
  // import ServiceWorker from '../service-worker/index.js';

  // console.log({ ServiceWorker });

  /** @type {WSClient} */
  // @ts-ignore
  let wsClient = null;
  /** @type {WsStoreAdapter} */
  // @ts-ignore
  let wsStoreAdapter = null;

  const registerSW = async () => {
    if ('serviceWorker' in navigator) {
      try {
        addEventListener('load', async() => {
          const registrationResult = await navigator.serviceWorker.register('../service-worker/index.js');

          console.log({ registrationResult });
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  onMount(async () => {
    if (IsInBrowser === true) {
      await registerSW();

      wsStoreAdapter = new WsStoreAdapter();
      wsStoreAdapter.start();
      // @ts-ignore
      wsClient = new WSClient(`ws://127.0.0.1:9090/`);
      wsClient.start();
    }
  });

  onDestroy(() => {
    if (IsInBrowser === true) {
      if (wsClient) {
        wsClient.stop();
  
        wsClient = null;
      }

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