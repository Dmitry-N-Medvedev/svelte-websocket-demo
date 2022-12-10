<script>
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import {
    browser as IsInBrowser,
  } from '$app/environment';
  import {
    MoneyStore,
  } from '$lib/stores/money.store.mjs';

  /**
	 * @type {string | number | NodeJS.Timer | null | undefined}
	 */
  // let moneyInterval = null;
  let money = 0;
  let moneyDelta = 0;
  /**
	 * @type {BroadcastChannel | null}
	 */
  let moneyChannel = null;

  const unsubscribeFromMoneyStore = MoneyStore.subscribe((newState) => {
    money = newState.sum;
    moneyDelta = newState.delta;
  });

  const moneyChannelMessageHandler = (/** @type {MessageEvent} */ messageEvent) => {
    if (messageEvent.data.type === 'money') {
      MoneyStore.updateMoneyFromServer(messageEvent.data.payload);
    }
  };

  onMount(() => {
    if (IsInBrowser === true) {
      moneyChannel = new BroadcastChannel('money');
      moneyChannel.addEventListener('message', moneyChannelMessageHandler);
    }
  });

  onDestroy(() => {
    if (IsInBrowser === true) {
      unsubscribeFromMoneyStore();
    }

    if (moneyChannel) {
      moneyChannel.close();
    }
  });
</script>

<style>
  article {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr;
    grid-template-areas:
      'money'
      'button'
    ;
    gap: min(1vh, 1vw);
    align-self: center;

    width: 15vw;
    height: 20vh;
    background-color: var(--theme-dark_gray);
    filter: drop-shadow(0 0 0.25rem var(--theme-black));
    border-radius: max(0.125vh, 0.125vw);
    top: calc(50% - 20vh / 2 );

    pointer-events: all;
    transition: filter 0.125s ease;
  }

  article:hover {
    filter: drop-shadow(0 0 0.5rem var(--theme-black));
    transition: filter 0.125s ease;
  }

  #money {
    display: flex;
    grid-area: money;
    justify-content: center;
    align-items: center;
    background-color: var(--theme-black);
  }

  #money::before {
    content: "€";
    color: var(--theme-light_gray);
    margin-right: 0.025vw;
  }

  #money-delta {
    margin-left: 0.5vw;
    color: var(--theme-green);
    top: -0.5vh;
  }

  #money-delta::before {
    content: "+";
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
  <div id='money'>
    <div id='money-sum'>
      {#if money}
        {Number(money).toFixed(2)}
      {:else}
        0.00
      {/if}
    </div>
    <sup id='money-delta'>
      {#if moneyDelta}
        {Number(moneyDelta).toFixed(2)}
      {:else}
        0.00
      {/if}
    </sup>
  </div>
  
  <button
    id="button"
    type="button"
  >donate</button>
</article>