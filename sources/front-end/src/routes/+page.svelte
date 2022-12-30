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
    WSOnlineStatusStore,
  } from '$lib/stores/ws-online-status.store.mjs';
  // import {
  //   createDonateMessage,
  // } from '@dmitry-n-medvedev/serializers.donatemessage/createDonateMessage.mjs';
  // import {
  //   MessageTypes,
  // } from '@dmitry-n-medvedev/common/MessageTypes.mjs';
  // import {
  //   createDonateMessage,
  // } from '@dmitry-n-medvedev/common/messages/serializers/createDonateMessage.mjs';
  import {
    MessageTypes,
  } from '$lib/constants/MessageTypes.mjs';

  let wallet = 0;
  let moneyDelta = 0;
  let moneyDeltaIsNegative = false;
  /** @type {BroadcastChannel | null | undefined} */
  let toServerBroadcastChannel = null;
  let IsOffline = true;

  $: {
    moneyDeltaIsNegative = moneyDelta < 0;
  }

  const unsubscribeFromMoneyStore = MoneyStore.subscribe((newState) => {
    wallet = newState.wallet;
    moneyDelta = newState.delta;
  });

  const unsubscribeFromWSOnlineStatusStore = WSOnlineStatusStore.subscribe((/** @type {Boolean} */  isConnected) => {
    IsOffline = !isConnected;
  });

  const handleSubmit = (/** @type {PointerEvent} */ event) => {
    const donateMessage = Object.freeze({
      type: MessageTypes.DATA.DONATE,
      payload: {
        donate: wallet * 0.1
      },
    });

    // @ts-ignore
    toServerBroadcastChannel.postMessage(donateMessage);
  }

  onMount(() => {
    if (IsInBrowser === true) {
      toServerBroadcastChannel = new BroadcastChannel(MessageTypes.PROXY.TO_SERVER_REQ);
    }
  });

  onDestroy(() => {
    if (IsInBrowser === true) {
      unsubscribeFromMoneyStore();
      unsubscribeFromWSOnlineStatusStore();
    }

    if (toServerBroadcastChannel) {
      toServerBroadcastChannel?.close();
      toServerBroadcastChannel = undefined;
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
    /* height: 20vh; */

    /* min-width: 570.24px; */
    /* min-height: 405.6px; */

    aspect-ratio: calc(570.24 / 401.54);

    background-color: var(--theme-gray);
    /* filter: drop-shadow(0 0 0.25rem var(--theme-black)); */
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

  /* article:hover {
    filter: drop-shadow(0 0 0.8rem var(--theme-black));
    transform: scale3d(1.0, 1.0, 1.0);

    transition: all var(--transition-duration) var(--transition-timing-function);
  } */

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
    font-size: 1.25rem;
    color: var(--theme-white);
    background-color: var(--theme-blue);
    width: 50%;
    height: 50%;
    align-self: center;
    justify-self: center;
  }

  .moneyDeltaIsNegative {
    color: var(--theme-red) !important;
  }

  .IsOffline {
    filter: blur(3px) opacity(0.5);
    pointer-events: none !important;
  }

/* 
    320px — 480px: Mobile devices
    481px — 768px: iPads, Tablets
    769px — 1024px: Small screens, laptops
    1025px — 1200px: Desktops, large screens
    1201px and more —  Extra large screens, TV
*/

  @media screen and (hover: hover) {
    article {
      filter: drop-shadow(0 0 0.25rem var(--theme-black));
    }

    article:hover {
      filter: drop-shadow(0 0 0.8rem var(--theme-black));
      transform: scale3d(1.0, 1.0, 1.0);

      transition: all var(--transition-duration) var(--transition-timing-function);
    }
  }

  @media screen and (max-width: 480px) and (orientation: portrait) {
    article {
      width: 95vw;
      top: 25%;
    }
  }

  @media screen and (max-height: 480px) and (orientation: landscape) {
    article {
      width: 95vw;
      top: auto;
    }
  }

  @media screen and (max-width: 896px) and (orientation: landscape) {
    article {
      width: 65vw;
      top: auto;
    }
  }

  @media screen and (max-width: 915px) and (orientation: landscape) {
    article {
      width: 55vw;
      top: auto;
    }
  }

  @media screen and (max-width: 820px) and (orientation: portrait) {
    article {
      width: 65vw;
    }
  }

  @media screen and (max-width: 1180px) and (orientation: landscape) {
    article {
      width: 45vw;
      top: 25%;
    }
  }

  @media screen and (max-width: 912px) and (orientation: portrait) {
    article {
      width: 65vw;
      top: 25%;

    }
  }
  
  @media screen and (max-width: 1368px) and (orientation: landscape) {
    article {
      width: 45vw;
      top: 25%;
    }
  }
</style>

<article class:IsOffline>
  <div id='money'>
    <div id='money-sum'>
      {#if wallet}
        {Number(wallet).toFixed(2)}
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
    class:IsOffline
    id="button"
    type="button"
    on:click|preventDefault|stopPropagation|trusted={handleSubmit}
  >donate</button>
</article>