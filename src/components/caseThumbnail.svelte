<script lang="ts">
  import { page } from '$app/stores';
  import { goldenNames, lazyLoad } from '$lib';
  import { localisePrice } from '$lib';
  import type { Case } from '@prisma/client';
  import Spinner from './util/Spinner.svelte';
  export let ratio: string;
  export let data: Case;
</script>

<div
  class="relative grid grid-cols-1 grid-rows-1 transition-all duration-200 transform border-gold hover:border hover:-translate-y-0.5 will-change-transform rounded-lg shadow-zinc-900 shadow-xl {data.websiteName ===
    'DEADPOOL' || data.websiteName === 'THE EXPENDABLES'
    ? 'col-span-2 row-span-2'
    : ''}"
  style="aspect-ratio: 1/{ratio};"
>
  <a
    href="/skins/category/{data.urlName}"
    class="z-20 w-full h-full col-start-1 row-start-1 row-end-3"
  >
    <img
      use:lazyLoad="{`https://raw.githubusercontent.com/oxi1224/images/main/${data.imgName}`}"
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
        {goldenNames.includes(data.websiteName)
          ? data.price
          : localisePrice(page, data.price)}&nbsp;{@html goldenNames.includes(data.websiteName)
          ? '<img src="/icons/gold-coin.webp" alt="coin" class="w-3 h-3 ml-1">'
          : $page.data?.currency.toUpperCase()}
      </div>
      <div
        class="z-10 max-w-[90%] whitespace-nowrap py-2 px-0 lg:px-2 mx-auto mt-auto mb-4 text-xs lg:text-sm font-normal leading-none text-center text-white uppercase rounded-lg bg-navy-700 w-32"
      >
        {data.websiteName}
      </div>
    </div>
  </a>
</div>
