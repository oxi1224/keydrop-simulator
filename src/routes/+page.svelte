<script>
  import CaseSection from '$components/caseSection.svelte';
  import caseData from '$assets/broad.json';
</script>

<main class="bg-no-repeat" style="background-position: center top; background-size: auto 1400px;">
  <div class="relative">
    <div id="caseList-root" class="py-10 pb-10">
      <div class="min-h-screen text-white">
        <div class="container mx-auto">
          {#each Object.entries(caseData) as [id, caseValues]}
            <CaseSection id="{id}" caseValues="{caseValues}" />
          {/each}
        </div>
      </div>
    </div>
  </div>
</main>