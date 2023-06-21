<script>
  import '../app.css';
  import Toast from '$components/util/Toast.svelte';
  import Header from '$components/header/Header.svelte';
  import Footer from '$components/footer/Footer.svelte';
  import { navigating, page } from '$app/stores';
  import Spinner from '$components/util/Spinner.svelte';
</script>

{#if $page.data.connectionCount > 100}
  <div class="w-full h-full fixed flex justify-center items-center">
    <h1>
      <span class="text-red-400">LIMIT POŁĄCZEŃ OSIĄGNIĘTY, PROSZE WRÓCIĆ PÓŹNIEJ</span>
    </h1>
  </div>
{:else}
  <Header />
  {#if $navigating}
    <div class="container flex justify-center items-center my-10 mx-auto">
      <Spinner />
    </div>
  {:else}
    <slot />
  {/if}
  <Footer />
  <Toast />
{/if}