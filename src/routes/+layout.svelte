<script lang="ts">
  import '../app.css';
  import Popup from '$components/util/Popup.svelte';
  import Header from '$components/Header.svelte';
  import Footer from '$components/Footer.svelte';
  import { onMount } from 'svelte';
  onMount(async () => {
    const { setUserData } = await import('$lib');
    await setUserData();
  });
</script>

<Header />
<slot />
<Footer />
<Popup />
