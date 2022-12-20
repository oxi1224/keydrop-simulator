<script lang="ts">
  import { page } from '$app/stores';
  import Case from '$components/Case.svelte';
  import type { CaseWithDrops } from '$lib';
  const caseName = $page.params.slug;
  const promise: Promise<CaseWithDrops> = fetch(`/api/get-case?caseName=${caseName}`, {
    method: 'GET'
  }).then(async (res) => (await res.json()).data);
</script>

{#await promise then data}
  <Case caseData="{data}" />
{/await}
