<script>
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import {
    TsStore,
  } from '$lib/stores/ts.store.mjs';

  /**
	 * @type {string | number | NodeJS.Timer | null | undefined}
	 */
  let tsInterval = null;
  let lastTs = null;

  const unsubscribeFromTsStore = TsStore.subscribe((/** @type {string | any[]} */ newState) => {
    lastTs = newState.at(-1);
  });

  onMount(() => {
    tsInterval = setInterval(() => {
      TsStore.updateTsFromServer(Date.now());
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(tsInterval);

    unsubscribeFromTsStore();
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