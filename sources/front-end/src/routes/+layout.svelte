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

  let wsClient = null;
  let wsStoreAdapter = null;

  onMount(() => {
    if (IsInBrowser === true) {
      wsStoreAdapter = new WsStoreAdapter();
      wsStoreAdapter.start();
      // @ts-ignore
      wsClient = new WSClient('ws://127.0.0.1:9090');
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