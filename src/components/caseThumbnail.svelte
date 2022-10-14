<script lang="ts">
  import { goldenNames } from "@lib";
  export let name: string;
  export let data: {
    imgName: string;
    price: number;
    href: string;
  };
  export let sectionId: string;
</script>

<div
  class="relative grid grid-cols-1 grid-rows-1 transition-all duration-200 ratio {sectionId ===
    'cs-go-kings' || sectionId === 'gold-area'
    ? 'ratio-1.5'
    : ''} {sectionId === 'youtubers-cases'
    ? 'ratio-1.12'
    : ''} transform border-gold hover:border hover:-translate-y-0.5 will-change-transform rounded-lg shadow-zinc-900 shadow-xl {name ===
    'DEADPOOL' || name === 'THE EXPENDABLES'
    ? 'col-span-2 row-span-2'
    : ''}"
>
  <a href="{data.href}" class="z-20 w-full h-full col-start-1 row-start-1 row-end-3">
    <img
      src="/cases/{data.imgName}"
      alt=""
      class="absolute top-0 right-0 object-cover w-full h-full rounded-lg"
      loading="lazy"
    />
    <div class="z-10 flex flex-col w-full h-full">
      <div
        class="flex flex-row items-center absolute py-1.5 px-3 font-semibold rounded bg-navy-900 text-gold-500 top-3 right-3 text-xs"
      >
        {data.price} {@html goldenNames.includes(name) ? '<img src="https://key-drop.com/web/KD/static/images/gold-coin.png?v48" class="w-3 h-3 ml-1">' : 'PLN'}
      </div>
      <div
        class="z-10 max-w-full p-2 mx-auto mt-auto mb-4 text-sm font-normal leading-none text-center text-white uppercase rounded-lg bg-navy-700 min-w-[8rem]"
      >
        {name}
      </div>
    </div>
  </a>
</div>
