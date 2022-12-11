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
  import {
    MessageTypes,
  } from '@dmitry-n-medvedev/common/MessageTypes.mjs';
  import {
    createDonateMessage,
  } from '@dmitry-n-medvedev/common/messages/serializers/createDonateMessage.mjs';

  let money = 0;
  let moneyDelta = 0;
  let moneyDeltaIsNegative = false;
  /**
   * @type {BroadcastChannel | null}
   */
  let moneyChannel = null;
  /**
   * @type {BroadcastChannel | null}
   */
  let toServerChannel = null;

  $: {
    moneyDeltaIsNegative = moneyDelta < 0;
  }

  const unsubscribeFromMoneyStore = MoneyStore.subscribe((newState) => {
    money = newState.sum;
    moneyDelta = newState.delta;
  });

  const moneyChannelMessageHandler = (/** @type {MessageEvent} */ messageEvent) => {
    if (messageEvent.data.type === MessageTypes.MONEY) {
      MoneyStore.updateMoneyFromServer(messageEvent.data.payload);
    }
  };

  const handleSubmit = (/** @type {PointerEvent} */ event) => {
    const donateMessage = createDonateMessage(money * 0.1);

    toServerChannel?.postMessage(donateMessage);
  }

  onMount(() => {
    if (IsInBrowser === true) {
      moneyChannel = new BroadcastChannel(MessageTypes.MONEY);
      moneyChannel.addEventListener('message', moneyChannelMessageHandler);

      toServerChannel = new BroadcastChannel('to-server');
    }
  });

  onDestroy(() => {
    if (IsInBrowser === true) {
      unsubscribeFromMoneyStore();
    }

    if (moneyChannel) {
      moneyChannel.close();
    }

    if (toServerChannel) {
      toServerChannel.close();
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
    background-color: var(--theme-gray);
    filter: drop-shadow(0 0 0.25rem var(--theme-black));
    border-radius: max(0.125vh, 0.125vw);
    top: calc(50% - 20vh / 2 );

    padding: min(0.125vh, 0.125vw);

    pointer-events: all;
    transform: scale3d(0.99, 0.99, 0.99);

    transition: all var(--transition-duration) var(--transition-timing-function);
  }

  article > * {
    pointer-events: none;
  }

  article:hover {
    filter: drop-shadow(0 0 0.8rem var(--theme-black));
    transform: scale3d(1.0, 1.0, 1.0);

    transition: all var(--transition-duration) var(--transition-timing-function);
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

  .moneyDeltaIsNegative {
    color: var(--theme-red) !important;
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
    <sup id='money-delta' class:moneyDeltaIsNegative>
      {#if moneyDelta}
        {Number(Math.abs(moneyDelta)).toFixed(2)}
      {:else}
        0.00
      {/if}
    </sup>
  </div>
  
  <button
    id="button"
    type="button"
    on:click|preventDefault|stopPropagation|trusted={handleSubmit}
  >donate</button>
</article>