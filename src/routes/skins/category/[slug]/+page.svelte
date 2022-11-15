<script lang="ts">
  import Case from '$components/case.svelte';
  import type { Case as CaseType } from '$lib';
  export let data: CaseType;
</script>

<Case data="{data}" />
