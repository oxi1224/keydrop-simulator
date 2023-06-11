<script lang="ts">
  import Case from '$components/case.svelte';
  import type { CaseWithDrops } from '$lib';
  export let data: { caseData: CaseWithDrops };
</script>

<Case caseData="{data.caseData}" />
