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
  let interval = null;
  /**
	 * @type {number | null}
	 */
  let lastTs = null;

  const unsubscribeFromTsStore = TsStore.subscribe((/** @type {string | any[]} */ newState) => {
    lastTs = newState.at(-1);
  });

  onMount(() => {
    interval = setInterval(() => {
      TsStore.updateFromServer(Date.now());
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
    unsubscribeFromTsStore();
  });
</script>

<style>
  article {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr;
    grid-template-areas:
      'ts'
      'button'
    ;
    gap: min(1vh, 1vw);
    align-self: center;

    width: 15vw;
    height: 20vh;
    background-color: var(--theme-dark_gray);
    filter: drop-shadow(0 0 1rem var(--theme-black));
    border-radius: max(0.125vh, 0.125vw);
    top: calc(50% - 20vh / 2 );
  }

  #ts {
    display: flex;
    grid-area: ts;
    justify-content: center;
    align-items: center;
    background-color: var(--theme-black);
  }

  #button {
    display: flex;
    grid-area: button;
    pointer-events: all;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 0.5vw;
    color: var(--theme-white);
    width: 50%;
    height: 50%;
    align-self: center;
    justify-self: center;
  }
</style>

<article>
  <div id='ts'>
    {#if lastTs}
      {lastTs}
    {/if}
  </div>
  
  <button
    id="button"
    type="submit"
  >request</button>
</article>