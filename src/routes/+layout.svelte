<script>
  import '../app.css';
  import Toast from '$components/util/Toast.svelte';
  import Header from '$components/header/Header.svelte';
  import Footer from '$components/footer/Footer.svelte';
  import { navigating, page } from '$app/stores';
  import Spinner from '$components/util/Spinner.svelte';
</script>

{#if $page.data.connectionCount > 100}
  <div class="fixed flex h-full w-full items-center justify-center">
    <h1>
      <span class="text-red-400">LIMIT POŁĄCZEŃ OSIĄGNIĘTY, PROSZE WRÓCIĆ PÓŹNIEJ</span>
    </h1>
  </div>
{:else}
  <Header />
  {#if $navigating}
    <div class="container mx-auto my-10 flex items-center justify-center">
      <Spinner />
    </div>
  {:else}
    <slot />
  {/if}
  <Footer />
  <Toast />
{/if}
