<script>
  import Footer from '@components/footer.svelte';
  import Header from '@components/header.svelte';
  import { page } from '$app/stores';
  import Case from '@components/case.svelte';
  export let promise = import(`../../../../assets/cases/${$page.params.slug}.json`);
</script>

<Header />
{#await promise then data}
  <Case data="{data}" />
{/await}
<Footer />
