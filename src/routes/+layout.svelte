<script lang="ts">
  import '../app.css';
  import Popup from '$components/popup.svelte';
  import { onMount } from 'svelte';
  onMount(async () => {
    const { setUserData } = await import('$lib');
    await setUserData();
  });
</script>

<slot />
<Popup />
