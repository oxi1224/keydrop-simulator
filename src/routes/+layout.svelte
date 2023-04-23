<script lang="ts">
  import '../app.css';
  import Popup from '$components/util/Popup.svelte';
  import Header from '$components/Header.svelte';
  import Footer from '$components/Footer.svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    const { setUserData, fastOpen, loggedIn } = await import('$lib');
    fastOpen.set(localStorage['fast_open'] === 'true');
    loggedIn.set(localStorage['logged_in'] === 'true');

    await setUserData();   
  });
</script>

<Header />
<slot />
<Footer />
<Popup />
