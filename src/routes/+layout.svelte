<script lang="ts">
  import '../app.css';
  import Toast from '$components/util/toast.svelte';
  import Header from '$components/header.svelte';
  import Footer from '$components/footer.svelte';
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';
  import { navigating, page } from '$app/stores';
  import Spinner from '$components/util/spinner.svelte';

  inject({ mode: dev ? 'development' : 'production' });
</script>

{#if $page.data.connectionCount > 100}
  <div class="w-full h-full fixed flex justify-center items-center">
    <h1>
      <span class="text-red-400">
        LIMIT POŁĄCZEŃ OSIĄGNIĘTY, PROSZE WRÓCIĆ PÓŹNIEJ
      </span>
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
