<script lang="ts">
  import { goldenNames } from '$lib';
  import type { Case } from '@prisma/client';
  export let ratio: string;
  export let data: Case;
</script>

<div
  class="relative grid grid-cols-1 grid-rows-1 transition-all duration-200 ratio ratio-{ratio} transform border-gold hover:border hover:-translate-y-0.5 will-change-transform rounded-lg shadow-zinc-900 shadow-xl {data.websiteName ===
    'DEADPOOL' || data.websiteName === 'THE EXPENDABLES'
    ? 'col-span-2 row-span-2'
    : ''}"
>
  <a
    href="/skins/category/{data.urlName}"
    class="z-20 w-full h-full col-start-1 row-start-1 row-end-3"
  >
    <img
      src="/cases/{data.imgName}"
      alt=""
      class="absolute top-0 right-0 object-cover w-full h-full rounded-lg"
      loading="lazy"
    />
    <div class="z-10 flex flex-col w-full h-full">
      <div
        class="flex flex-row items-center absolute py-1.5 px-3 font-semibold bg-navy-900 rounded text-gold-500 top-3 right-3 text-xs"
      >
        {goldenNames.includes(data.websiteName) ? data.price : data.price.toFixed(2)}
        {@html goldenNames.includes(data.websiteName)
          ? '<img src="/icons/gold-coin.png?v48" class="w-3 h-3 ml-1">'
          : 'PLN'}
      </div>
      <div
        class="z-10 max-w-full p-2 mx-auto mt-auto mb-4 text-sm font-normal leading-none text-center text-white uppercase rounded-lg bg-navy-700 min-w-[8rem]"
      >
        {data.websiteName}
      </div>
    </div>
  </a>
</div>
