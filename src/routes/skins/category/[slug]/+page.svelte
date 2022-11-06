<script>
  import { page } from '$app/stores';
  import Case from '$components/case.svelte';
  export let promise = import(`../../../../assets/cases/${$page.params.slug}.json`);
</script>

{#await promise then data}
  <Case data="{data}" />
{/await}
