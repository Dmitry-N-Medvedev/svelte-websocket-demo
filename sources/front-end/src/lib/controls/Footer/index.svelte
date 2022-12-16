<script>
  import {
    browser as IsInBrowser,
  } from '$app/environment';
  import {
    onDestroy,
  } from 'svelte';
  import {
    TsStore,
  } from '$lib/stores/ts.store.mjs';

  let lastTs = null;

  const unsubscribeFromTsStore = TsStore.subscribe((/** @type {string | any[]} */ newState) => {
    lastTs = newState.at(-1);
  });


  onDestroy(() => {
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