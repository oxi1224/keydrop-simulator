<script lang="ts">
  import CaseSection from '$components/case/CaseSection.svelte';
  import { TimeInMs, type CaseSection as CaseSectionType } from '$lib';
  export let data: { sections: CaseSectionType[] };

  let time = '';
  const duration = 1687609045207 + TimeInMs.Minute * 90;
  setInterval(() => {
    const diff = duration - new Date().getTime();

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    time = hours + ':' + minutes + ':' + seconds;

    if (diff < 0) time = 'NIEDLUGO';
  }, 1000);
</script>

<main class="bg-no-repeat" style="background-position: center top; background-size: auto 1400px;">
  <div class="relative">
    <div id="caseList-root" class="py-10 pb-10">
      <div class="min-h-screen text-white">
        <div class="container mx-auto">
          {#each data.sections as sectionData}
            {#if sectionData.cases.length > 0}
              <CaseSection data="{sectionData}" />
            {:else}
              <div class="text-center text-lg text-red">
                SKRZYNKI SĄ AKTUALIZOWANE, PROSZE CZEKAĆ...
                <br />
                Oczekiwany czas: {time}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
</main>
