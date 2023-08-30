<script lang="ts">
  import CaseRoulette from './components/CaseRoulette.svelte';
  import CaseContents from './components/CaseContents.svelte';
  import { type CaseWithDrops, type CaseDrop, settings } from '$lib';
  import { _ } from 'svelte-i18n';
  export let caseData: CaseWithDrops;
  const caseDrops: CaseDrop[] = caseData.drops;

  function setFastOpen(e: MouseEvent) {
    settings.update((o) => {
      const checked = (e.target as HTMLInputElement).checked;
      o.fastOpen = checked;
      return o;
    });
  }

  function setAudioMute() {
    settings.update((o) => {
      o.muteAudio = !o.muteAudio;
      console.log(o.muteAudio);
      return o;
    });
  }
</script>

<main
  class="bg-no-repeat"
  style="background-image: url(/images/bg.webp); background-position: center top; background-size: 2570px;"
>
  <div
    id="case-root"
    style="background: url(/images/loser-bg.webp) center top / 100% auto no-repeat"
  >
    <header class="container mx-auto flex grid-cols-3 items-center py-8 sm:grid">
      <a
        href="/"
        class="flex items-center text-sm font-bold text-navy-200 transition-colors duration-200 hover:text-white"
      >
        <svg class="mr-2 h-3 w-3 md:mr-3 md:h-4 md:w-4">
          <use xlink:href="/icons/icons.svg#arrow-left"></use>
        </svg>
        <span class="pt-px leading-none">
          <span class="md:hidden">{$_('case.back')}</span>
          <span class="hidden md:inline">{$_('case.goBack')}</span>
        </span>
      </a>
      <h2 class="mx-auto px-6 text-center text-xl font-semibold uppercase leading-tight text-white">
        {caseData.websiteName}
      </h2>
      <div class="flex justify-center space-x-1 sm:justify-end sm:space-x-2">
        <button
          class="js-sound-btn flex h-10 items-center justify-center rounded-lg border border-solid border-navy-100 bg-navy-550 px-4 text-center text-xs font-bold text-white transition-all duration-300 {$settings.muteAudio
            ? 'brightness-75'
            : ''}"
          aria-label="Wyłącz dźwięk"
          on:click="{() => setAudioMute()}"
        >
          <svg viewBox="-10 0 130 120" class="block h-4 w-4 fill-current">
            <path
              fill="currentColor"
              stroke="currentColor"
              stroke-width="10"
              d="M9.6 34.1c-2.5 0-4.6 0.9-6.4 2.7 -1.7 1.7-2.6 3.8-2.6 6.3v33.8c0 2.5 0.9 4.7 2.6 6.5C5 85 7.1 85.8 9.6 85.8h17.9l39.8 30.4V3.7L27.5 34.1H9.6"
              class="css-qeu6t3"
            ></path>
            <path
              class="vol"
              d="M84.9 29.3l-7.8 8.2c6.5 6.5 9.8 14 9.8 22.5s-3.3 16-9.8 22.5l7.8 8.3C93.7 82 98 71.8 98 60S93.7 38 84.9 29.3"
              style="transform-origin: 0px 0px 0px; opacity: 1;"
              data-svg-origin="77.0999984741211 29.299999237060547"
              transform="matrix(1,0,0,1,0,0)"
            ></path>
            <path
              class="vol"
              d="M99.5 15L92 22.8c10.5 10.5 15.8 22.9 15.8 37.2 0 14.7-5.3 27.1-15.8 37.1l7.5 8.3C112.5 92.9 119 77.8 119 60 119 42.2 112.5 27.2 99.5 15z"
              style="transform-origin: 0px 0px 0px; opacity: 1;"
              data-svg-origin="92 15"
              transform="matrix(1,0,0,1,0,0)"
            ></path>
          </svg>
        </button>
        <label
          class="relative flex h-10 cursor-pointer items-center justify-center rounded-lg border border-solid border-navy-100 bg-navy-550 px-4 text-center text-xs font-bold text-white transition-all duration-300 {$settings.fastOpen
            ? ''
            : 'brightness-75'}"
        >
          <input
            type="checkbox"
            id="fast-open"
            name="fast-open"
            class="absolute h-0 w-0 cursor-pointer opacity-0"
            on:click="{(e) => setFastOpen(e)}"
          />
          <svg class="block h-4 w-4"><use xlink:href="/icons/icons.svg#lightning"></use></svg>
        </label>
      </div>
    </header>
    <CaseRoulette data="{caseData}" />
    <CaseContents {caseDrops} />
    <div class="container mx-auto"></div>
  </div>
</main>
