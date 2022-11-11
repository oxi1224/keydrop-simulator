<script lang="ts">
  import Spinner from '$components/spinner.svelte';
  import type { Item } from '@prisma/client';
  import { massSellSkins, sellSkin, setUserData, userData } from '$lib';
  let totalSkinPrice = 0;
  let sellLoading = false;
  let inventory = $userData?.inventory.reverse();
  $: inventory = $userData?.inventory.reverse();
  $: totalSkinPrice = $userData?.inventory.reduce((n, o) => n + o.skinPrice, 0) ?? 0;

  async function handleMassSell(skins: Item[]) {
    sellLoading = true;
    const IDs = (skins.map((obj) => obj.dropId));
    const res = await massSellSkins(IDs);
    if (res.ok) await setUserData();
    sellLoading = false;
  }

  async function handleSingleSell(e: MouseEvent, item: Item) {
    sellLoading = true;
    const clickedEl = (e.target as Element).closest('.single-sell-btn') as HTMLButtonElement;
    const res = await sellSkin(item);
    clickedEl.disabled = true;
    if (res.ok) await setUserData();
    sellLoading = false;
  }
</script>

<div class="container mx-auto">
  <div class="w-fuill flex align-center justify-center my-3">
    <button
      class="mass-sell-btn flex items-center justify-center h-10 px-3 font-bold text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 bg-navy-700 hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 text-gold hover:bg-gold glow-gold border-gold disabled:brightness-50 disabled:hover:bg-navy-700"
      disabled="{sellLoading}"
      on:click="{() => handleMassSell(inventory ?? [])}"
    >
      {#if sellLoading}
        <Spinner size="1.5em" borderWidth=".25em" />
      {:else}
        <svg class="flex-shrink-0 w-3 h-4 mr-2 sm:mr-3 sm:w-5 sm:h-6">
          <use xlink:href="/icons/icons.svg#sell"></use>
        </svg>
        {#if inventory}
          sprzedaj wszystko za&nbsp;
          <span class="total-award-price">{totalSkinPrice?.toFixed(2)}</span>
        {:else}
          Ładowanie
        {/if}
      {/if}
    </button>
  </div>
  {#if inventory}
    <ul class="grid gap-10 my-3" style="grid-template-columns: repeat(6, 1fr);">
      {#each inventory as item}
        <li
          class="relative z-0 rounded-lg group transition-transform hover:-translate-y-6 bg-navy-700"
          style="padding-top: 135%; box-shadow: rgb(8, 10, 13) 0px 0px 35px 0px;"
        >
          <div
            class="absolute top-0 left-0 hidden w-full h-full transition-transform duration-200 border-t border-solid rounded-lg will-change-transform bg-navy-900 group-hover:rounded-b-none border-blue css-cwrogv"
            style="display: flex;"
          >
            <div class="absolute top-0 left-0 w-full h-full transition-opacity duration-200"></div>
            <div class="absolute top-0 left-0 z-10 flex items-center w-full p-2 sm:p-4">
              <div class="flex items-center font-bold leading-none uppercase text-2xs text-gold">
                <svg class="w-4 h-4 mr-2 -mt-px" style="transform: scale(0.95);">
                  <use xlink:href="/icons/icons.svg#rating-star"></use>
                </svg>
                New
              </div>
              <div
                class="flex items-center p-2 ml-auto text-sm font-bold leading-none rounded-md bg-navy-700 text-gold"
              >
                {item.skinPrice.toFixed(2)} PLN
              </div>
            </div>
            <div
              class="absolute flex flex-col items-center justify-end w-full h-full pb-4 transition-opacity duration-200 rounded-t-lg bg-navy-600"
            >
              <img
                src="/images/inventory-item.webp"
                alt=""
                class="absolute top-0 left-0 object-cover w-full h-full rounded-lg"
              />
              <img
                src="{item.skinImgSource}"
                alt=""
                class="relative flex-1 object-contain w-4/5 mt-8"
              />
              <div
                class="flex flex-col items-center transition-opacity duration-200 group-hover:opacity-0"
              >
                <div
                  class="relative px-2 overflow-hidden text-sm font-light leading-none text-center text-navy-100 sm:mb-2 line-clamp"
                >
                  {item.skinWeapon}
                </div>
                <div
                  class="relative px-2 overflow-hidden text-sm font-semibold leading-none text-center text-white sm:mb-2 line-clamp"
                  title="Mainframe "
                >
                  {item.skinName}
                </div>
                <div
                  class="relative px-2 overflow-hidden font-light leading-none text-center text-navy-100 text-2xs sm:mb-2 line-clamp"
                >
                  ({item.skinQuality})
                </div>
              </div>
            </div>
            <ul
              class="absolute bottom-0 left-0 z-10 w-full text-xs font-bold leading-none whitespace-nowrap transition-opacity duration-200 bg-navy-700 text-navy-100 divide-y divide-navy-800 opacity-0 group-hover:opacity-100
              
              "
            >
              <li class="border-solid">
                <button
                  class="single-sell-btn flex items-center justify-center w-full px-2 py-4 font-semibold uppercase transition-colors duration-150 text-[11px] hover:text-white"
                  on:click="{(e) => handleSingleSell(e, item)}"
                >
                  <svg class="w-4 h-4 mr-2">
                    <use xlink:href="/icons/icons.svg?38#sell"></use>
                  </svg>
                  <span>
                    Sprzedaj za <span class="text-gold">{item.skinPrice.toFixed(2)} PLN</span>
                  </span>
                </button>
              </li>
            </ul>
            <div
              class="absolute bottom-0 flex w-full overflow-hidden transition-transform duration-200 rounded-b-lg will-change-transform h-[50px] -translate-y-[1px]"
            >
              <button
                class="hidden hover-none:flex items-center px-3 transition-colors duration-150 border-t-0 border-b-0 border-l border-r-0 border-solid border-gold-800 "
              >
                <svg class="w-6 h-6 text-navy-600">
                  <use xlink:href="/icons/icons.svg?38#dots-vertical"></use>
                </svg>
              </button>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    Ładowanie
  {/if}
</div>
