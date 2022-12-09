<script>
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

  let wsClient = null;

  onMount(() => {
    if (IsInBrowser === true) {
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
    }
  });
</script>

<Header />
<main>
  <slot />
</main>
<Footer />