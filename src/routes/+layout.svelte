<script lang="ts">
  import '../app.css';
  import Popup from '$components/popup.svelte';
  import Header from '$components/header.svelte';
  import Footer from '$components/footer.svelte';
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
