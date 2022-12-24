<script>
  import 'inter-ui/inter.css';

  import {
    env,
  } from '$env/dynamic/public';

  import {
    browser as IsInBrowser,
  } from '$app/environment';
  import {
    onMount,
    onDestroy,
  } from 'svelte';
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
  /** @type {WsStoreAdapter | undefined | null} */
  let wsStoreAdapter = null;
  const workersConfig = {
    wsWorker: {
      url: `${env.PUBLIC_WS_PROTO}://${env.PUBLIC_WS_HOST}:${env.PUBLIC_WS_PORT}/`,
    },
  };

  onMount(async () => {
    if (IsInBrowser === true) {

      // @ts-ignore
      ldr = new Ldr(workersConfig);

      await ldr?.start();

      wsStoreAdapter = new WsStoreAdapter();
      wsStoreAdapter.start();
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