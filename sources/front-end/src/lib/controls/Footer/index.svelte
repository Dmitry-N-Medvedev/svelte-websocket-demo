<script>
  import {
    browser as IsInBrowser,
  } from '$app/environment';
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import {
    TsStore,
  } from '$lib/stores/ts.store.mjs';

  let lastTs = null;
  /**
	 * @type {BroadcastChannel | null}
	 */
  let tsChannel = null;

  const unsubscribeFromTsStore = TsStore.subscribe((/** @type {string | any[]} */ newState) => {
    lastTs = newState.at(-1);
  });

  const tsChannelMessageHandler = (/** @type {MessageEvent} */ messageEvent) => {
    if (messageEvent.data.type === 'ts') {
      TsStore.updateTsFromServer(messageEvent.data.payload);
    }
  }

  onMount(() => {
    if (IsInBrowser === true) {
      tsChannel = new BroadcastChannel('ts');

      tsChannel.addEventListener('message', tsChannelMessageHandler);
    }
  });

  onDestroy(() => {
    unsubscribeFromTsStore();

    if (tsChannel) {
      tsChannel.close();
    }

  });
</script>

<style>
  #ts {
    display: flex;
    grid-area: ts;
    justify-content: center;
    align-items: center;
    font-size: 0.95rem;
  }
</style>

<footer>
  <div id='ts'>
    {#if lastTs}
      {lastTs}
    {/if}
  </div>
</footer>