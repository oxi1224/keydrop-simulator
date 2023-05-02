<script lang="ts">
  import '../app.css';
  import Toast from '$components/util/Toast.svelte';
  import Header from '$components/Header.svelte';
  import Footer from '$components/Footer.svelte';
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';

  inject({ mode: dev ? 'development' : 'production' });
</script>

<Header />
<slot />
<Footer />
<Toast />
