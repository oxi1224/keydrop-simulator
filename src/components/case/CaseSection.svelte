<style>
  @media (min-width: 768px) {
    .grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }
    .grid-cols-5 {
      grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
    }
    .grid-cols-6 {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
    }
    .grid-cols-7 {
      grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 640px) {
    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }

  @media (min-width: 640px) {
    .grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>

<script lang="ts">
  import { goldenNames, lazyLoad, convertPrice, type CaseSection } from '$lib';
  import Spinner from '../util/Spinner.svelte';
  import { page } from '$app/stores';

  export let data: CaseSection;
  data.id === 'expired'
    ? data.cases.sort((a, b) => a.websiteName.localeCompare(b.websiteName))
    : null;
</script>

<section id="{data.id}" class="relative">
  <div
    class="relative flex mb-4 md:mb-0 {data.id !== 'youtubers-cases'
      ? 'border-gray-700 border-b'
      : ''}"
  >
    <div class="flex items-end w-1/6 sm:w-1/3"></div>
    <div class="flex items-center w-4/6 sm:w-1/3">
      <h1
        class="row-start-1 row-end-1 px-2 pb-5 mt-10 ml-auto mr-auto -mb-px text-base font-semibold text-center text-white uppercase sm:text-lg lg:max-w-xs lg:col-start-2 lg:col-end-2 {data.id !==
        'youtubers-cases'
          ? 'border-b border-gray-100'
          : ''}"
      >
        <div class="flex items-center leading-none h-7 sm:h-8 whitespace-nowrap">
          {#if data.id === 'youtubers-cases'}
            <svg class="mr-3 -mt-px fill-current w-9 h-9" viewBox="0 0 24 24">
              <rect fill="#fff" width="10" height="8" x="5" y="7"></rect>
              <path
                fill="#ff0000"
                d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"
              ></path>
            </svg>
          {/if}
          {data.name}
        </div>
      </h1>
    </div>
  </div>
  <div
    class="grid gap-6 grid-cols-2 grid-cols-{data.colSpan ||
      '6'} px-3 grid-cols-3 grid-rows-{data.rowSpan || '[auto]'} relative z-0 md:py-7 {data.id ===
    'youtubers-cases'
      ? 'md:px-8'
      : ''}"
  >
    {#if data.id === 'youtubers-cases'}
      <div class="z-[-1] absolute inset-[-1px] hidden md:flex youtuber-cases-border">
        <div class="absolute bg-navy-600 inset-px" style="border-radius: 1.20rem;"></div>
      </div>
    {/if}
    {#each data.cases as caseData}
      <div
        class="relative grid grid-cols-1 grid-rows-1 transition-all duration-200 transform border-gold hover:border hover:-translate-y-0.5 will-change-transform rounded-lg shadow-zinc-900 shadow-xl {caseData.websiteName ===
          'DEADPOOL' || caseData.websiteName === 'THE EXPENDABLES'
          ? 'col-span-2 row-span-2'
          : ''}"
        style="aspect-ratio: 1/{data.ratio};"
      >
        <a
          href="/skins/category/{caseData.urlName}"
          class="z-20 w-full h-full col-start-1 row-start-1 row-end-3"
        >
          <img
            use:lazyLoad="{data.id === 'expired' ? `https://raw.githubusercontent.com/oxi1224/images/main/${caseData.imgName}` : caseData.imgName}"
            alt=""
            class="absolute top-0 right-0 object-cover w-full h-full rounded-lg"
          />
          <div class="loader-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner />
          </div>
          <div class="z-10 flex flex-col w-full h-full">
            <div
              class="flex flex-row items-center absolute py-1.5 px-3 font-semibold bg-navy-900 rounded text-gold-500 top-3 right-3 text-xs"
            >
              {goldenNames.includes(caseData.websiteName)
                ? caseData.price
                : convertPrice($page.data.currency, caseData.price)}
              {@html goldenNames.includes(caseData.websiteName)
                ? '<img src="/icons/gold-coin.webp" alt="coin" class="w-3 h-3 ml-1">'
                : ''}
            </div>
            <div
              class="z-10 max-w-[90%] whitespace-nowrap py-2 px-0 lg:px-2 mx-auto mt-auto mb-4 text-xs lg:text-sm font-normal leading-none text-center text-white uppercase rounded-lg bg-navy-700 w-32"
            >
              {caseData.websiteName}
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</section>
