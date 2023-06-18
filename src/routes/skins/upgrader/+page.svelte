<script lang="ts">
  import Upgrader from '$components/upgrader/Upgrader.svelte';
  import type { GlobalInventoryItem } from '@prisma/client';

  export let data: { [key: string]: GlobalInventoryItem[] };
</script>

<Upgrader availableItems="{data.availableItems}" />
