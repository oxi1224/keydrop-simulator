<script lang="ts">
  import CaseSection from '$components/CaseSection.svelte';
  import type { CaseSection as CaseSectionType } from '$lib';

  const promise: Promise<CaseSectionType[]> = fetch('/api/get-case?caseName=sections', {
    method: 'GET'
  }).then(async (res) => (await res.json()).data);
</script>

<main class="bg-no-repeat" style="background-position: center top; background-size: auto 1400px;">
  <div class="relative">
    <div id="caseList-root" class="py-10 pb-10">
      <div class="min-h-screen text-white">
        <div class="container mx-auto">
          {#await promise then data}
            {#each data as sectionData}
              <CaseSection data="{sectionData}" />
            {/each}
          {/await}
        </div>
      </div>
    </div>
  </div>
</main>
