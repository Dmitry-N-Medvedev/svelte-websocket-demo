<script>
  import Header from '$lib/controls/Header/index.svelte';
  import Footer from '$lib/controls/Footer/index.svelte';
</script>

<Header />
<main>
  <slot />
</main>
<Footer />