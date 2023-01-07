<style>
  .upgrader-pointer-arrow {
    margin-top: -1px;
    width: 0px;
    height: 0px;
    border-color: currentcolor transparent transparent;
    border-style: solid;
    border-width: 18px 8px 8px;
    border-image: none 100% / 1 / 0 stretch;
    filter: drop-shadow(rgba(220, 174, 100, 0.8) 0px 0px 4px);
  }
  .t-h2 {
    font-weight: 600;
    line-height: 1.2;
    text-transform: uppercase;
  }
  .add-svg {
    width: 40px;
    height: 40px;
    top: calc(50% - 20px);
    left: calc(50% - 20px);
    box-shadow: rgb(220, 174, 100) 0px 0px 30px;
  }
</style>

<script lang="ts">
  import { userData, type SkinRarity } from '$lib';
  import type { GlobalInventoryItem, Item } from '@prisma/client';
  import { onMount } from 'svelte';
  let availableItems: GlobalInventoryItem[] = [];
  let availableItemsCount = 0;

  onMount(async () => {
    const res = await fetch(
      '/api/skins/get-items?' +
        new URLSearchParams({
          page: '0',
          order: 'DESC',
          minPrice: '0',
          maxPrice: '0'
        }),
      { method: 'GET' }
    );
    const body = await res.json();
    availableItems = res.ok ? body.items : [];
    availableItemsCount = res.ok ? body.itemCount : 0;
  });

  let filteredInv: Item[] =
    $userData?.inventory
      .filter((item) => !item.sold || !item.upgraded)
      .slice()
      .sort((a, b) => b.skinPrice - a.skinPrice) ?? [];
  let paginatedInventory: Item[][] = [];
  let inventoryPage = 0;
  // eslint-disable-next-line prefer-const
  let availableItemsPage = 0;
  // eslint-disable-next-line prefer-const
  let maxPrice = 0;
  // eslint-disable-next-line prefer-const
  let minPrice = 0;
  // eslint-disable-next-line prefer-const
  let order: 'ASC' | 'DESC' = 'DESC';
  // eslint-disable-next-line prefer-const
  let rarity = '';
  // eslint-disable-next-line prefer-const
  let searchString = '';

  async function updateItems(
    page: number,
    skinOrder: 'ASC' | 'DESC',
    minSkinPrice: number,
    maxSkinPrice: number,
    skinRarity: string,
    search: string
  ) {
    await fetch(
      '/api/skins/get-items?' +
        new URLSearchParams({
          page: page.toString(),
          order: skinOrder,
          minPrice: minSkinPrice.toString(),
          maxPrice: maxSkinPrice.toString(),
          skinRarity: skinRarity,
          searchString: search
        }),
      { method: 'GET' }
    )
      .then((res) => res.json())
      .then((data) => {
        availableItems = data.items || [];
        availableItemsCount = data.itemCount || [];
      });
  }

  $: updateItems(availableItemsPage, order, minPrice, maxPrice, rarity, searchString);

  $: filteredInv =
    $userData?.inventory
      .filter((item) => !item.sold || !item.upgraded)
      .slice()
      .sort((a, b) => b.skinPrice - a.skinPrice) ?? [];
  $: {
    paginatedInventory = [];
    const iterations = Math.ceil(filteredInv.length / 15);
    for (let i = 0; i < iterations; i++) {
      paginatedInventory.push(filteredInv.slice(i * 15, i * 15 + 15));
    }
  }
</script>

<div
  id="upgrader-root"
  style="background: url(/images/upgrader-bg.png) center top / 100% auto no-repeat"
>
  <div class="container pb-10 md:pb-16 mx-auto">
    <main>
      <header class="grid items-center grid-cols-3 py-12">
        <a
          href="/"
          class="flex items-center transition-colors duration-200 hover:text-white uppercase font-semibold text-gray-500"
        >
          <svg class="w-3 h-3 mr-2 md:w-4 md:h-4 md:mr-3">
            <use xlink:href="/icons/icons.svg#arrow-left"></use>
          </svg>
          <span class="pt-px leading-none">
            <span class="md:hidden">Return</span>
            <span class="hidden md:inline">Back to home page</span>
          </span>
        </a>
        <h2 class="text-center text-white t-h2">UPGRADER</h2>
      </header>
      <div
        class="grid gap-3 sm:gap-5 lg:gap-0"
        style="grid-template: 'userSkins center upgradeSkins' 1fr 'options center upgradeBtn' / 1fr 1fr 1fr"
      >
        <div
          class="flex flex-col rounded-l-lg rounded-r-lg lg:mt-10 lg:rounded-r-none bg-navy-800"
          style="grid-area: userSkins; background-image: radial-gradient(rgba(255, 255, 255, 0.08) 3%, transparent)"
        >
          <div class="p-3 pb-0 my-auto sm:p-6 sm:pb-0 h-[220px]">
            <img
              src="/images/item-placeholder.png?v50"
              alt=""
              class="block object-contain w-3/5 h-full mx-auto mt-6 pointer-events-none"
              style="filter: brightness(1.2);"
            />
          </div>
          <div
            class="flex flex-col items-center pb-3 text-center md:flex-row md:pb-6 md:pl-6 md:text-left"
          >
            <div class="pr-1">
              <div class="flex">
                <p class="font-bold text-sm md:text-base lg:text-lg leading-tight text-gold">
                  Choose your item
                </p>
              </div>
              <p class="text-xs leading-tight sm:text-sm text-navy-300">
                Item, that you want to upgrade
              </p>
            </div>
            <div
              class="px-5 py-3 mt-3 text-center rounded-lg md:mt-0 md:rounded-r-none md:ml-auto bg-navy-900 md:text-right"
              style="visibility: hidden;"
            >
              <div class="text-lg font-bold leading-none text-white whitespace-nowrap">
                <span>0,00&nbsp;PLN</span>
              </div>
              <div class="text-xs font-bold leading-none text-gold"><span>+0.00%</span></div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col rounded-l-lg rounded-r-lg lg:mt-10 lg:rounded-l-none bg-navy-800"
          style="grid-area: upgradeSkins; background-image: radial-gradient(rgba(255, 255, 255, 0.08) 3%, transparent);"
        >
          <div class="p-3 pb-0 my-auto sm:p-6 sm:pb-0 h-[220px]">
            <img
              src="/images/item-placeholder.png"
              alt=""
              class="block object-contain w-3/5 h-full mx-auto mt-6 pointer-events-none"
              style="filter: brightness(1.2);"
            />
          </div>
          <div
            class="flex flex-col items-center pb-3 text-center md:flex-row md:pb-6 md:pr-6 md:text-right"
          >
            <div
              class="order-2 px-5 py-3 mt-3 text-center rounded-lg md:mt-0 md:rounded-l-none md:mr-auto bg-navy-900 md:text-left md:order-1"
              style="visibility: hidden;"
            >
              <div class="text-lg font-bold leading-none text-white whitespace-nowrap">
                <span>0,00&nbsp;PLN</span>
              </div>
              <div class="text-xs font-bold leading-none text-gold"><span>0.00x</span></div>
            </div>
            <div class="order-1 pl-1 md:order-2">
              <p class="font-bold text-sm md:text-base lg:text-lg leading-tight text-gold">
                Choose item
              </p>
              <p class="text-xs leading-tight sm:text-sm text-navy-300">
                Item, that you want to receive.
              </p>
            </div>
          </div>
        </div>
        <div
          id="upgraderResult"
          class="z-10 flex flex-col items-center justify-center rounded-lg select-none bg-navy-800"
          style="box-shadow: rgba(0, 0, 0, 0.46) 0px 5px 20px;"
        >
          <div
            class="relative flex-1 mt-12 mb-8 border-2 border-current border-solid rounded-full"
            style="color: rgb(220, 174, 100); width: 40%; min-width: 250px; box-shadow: rgba(220, 174, 100, 0.7) 0px 0px 5px, rgba(220, 174, 100, 0.7) 0px 0px 7px inset;"
          >
            <div class="pt-[100%]"></div>
            <div
              class="absolute border border-solid rounded-full border-navy-500 w-[94%] h-[94%] top-[3%] left-[3%]"
            ></div>
            <div
              class="absolute bg-current w-[1px] h-[10px] top-[-6px] left-[50%]"
              style="box-shadow: rgba(220, 174, 100, 0.7) 0px 0px 6px 1px"
            ></div>
            <div
              class="absolute bg-current w-[10px] h-[1px] top-[50%] right-[-6px]"
              style="box-shadow: rgba(220, 174, 100, 0.7) 0px 0px 6px 1px"
            ></div>
            <div
              class="absolute bg-current w-[1px] h-[10px] bottom-[-6px] left-[50%]"
              style="box-shadow: rgba(220, 174, 100, 0.7) 0px 0px 6px 1px"
            ></div>
            <div
              class="absolute bg-current w-[10px] h-[1px] top-[50%] left-[-6px]"
              style="box-shadow: rgba(220, 174, 100, 0.7) 0px 0px 6px 1px"
            ></div>
            <div class="absolute top-0 left-0 z-10 flex justify-center w-full h-full">
              <div class="upgrader-spin-triangle upgrader-pointer-arrow"></div>
            </div>
            <div class="absolute top-0 left-0 z-10 w-full h-full p-5">
              <div
                class="relative flex items-center justify-center w-full h-full text-center border border-current border-solid rounded-full upgrader-spin-circle"
                style="perspective: 400px; box-shadow: rgba(220, 174, 100, 0.7) 0px 0px 5px, rgba(220, 174, 100, 0.7) 0px 0px 7px inset;"
              >
                <svg
                  viewBox="0 0 100 100"
                  class="absolute top-0 left-0 w-full h-full transition-transform duration-700 rounded-full pointer-events-none"
                  style="transform: rotate(-450deg);"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="50"
                    fill="none"
                    stroke-width="100"
                    stroke-dasharray="313.7 313.7"
                    stroke-dashoffset="313.7"
                    stroke="#dcae64"
                    opacity="0.15"
                    style="transition: stroke-dashoffset 0.5s ease-out 0s;"
                  ></circle>
                </svg>
                <div style="height: 80%; width: 80%; transform-style: preserve-3d;">
                  <div
                    class="absolute flex flex-col items-center justify-center w-full h-full rounded-full"
                    style="transform: rotateX(0deg); backface-visibility: hidden; background-image: radial-gradient(rgb(17, 17, 20), rgba(17, 17, 20, 0.5));"
                  >
                    <div class="text-4xl font-bold leading-none text-white">
                      <span>//CHANCE</span>
                    </div>
                    <div class="mt-1 text-sm leading-none text-navy-300">Upgrade chance</div>
                  </div>
                  <div
                    class="absolute flex flex-col items-center justify-center w-full h-full border-4 border-current border-solid rounded-full"
                    style="transform: rotateY(180deg); backface-visibility: hidden; background-image: radial-gradient(rgb(17, 17, 20), rgba(17, 17, 20, 0.5));"
                  >
                    <div class="text-3xl font-bold leading-none">LOST</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-8">
            <div class="relative">
              <svg viewBox="0 0 234.5066 50.7309" class="block mx-auto" style="width: 230px;">
                <path
                  fill="none"
                  stroke="#31303e"
                  stroke-width="1"
                  stroke-miterlimit="10"
                  d="M76.7533,38.7536c-34.9199-2.3026-59.2692-7.4914-59.2692-13.5234c0-8.1699,44.6682-14.7929,99.7693-14.7929c55.101,0,99.7692,6.623,99.7692,14.7929c0,6.032-24.3493,11.2208-59.2692,13.5234"
                ></path>
                <path
                  fill="none"
                  stroke="#dcae64"
                  stroke-width="1"
                  stroke-miterlimit="10"
                  d="M76.7533,48.2309C32.3526,44.7684,0.7087,35.7769,0.7087,25.2303c0-13.5428,52.1788-24.5216,116.5446-24.5216S233.798,11.6875,233.798,25.2303c0,10.5466-31.6439,19.5381-76.0446,23.0006"
                ></path>
                <g fill="#dcae64">
                  <path
                    d="M157.7534,45.7309c1.3806,0,2.5,1.1193,2.5,2.5001c0,1.3807-1.1194,2.4999-2.5,2.4999c-1.3808,0-2.5-1.1192-2.5-2.4999C155.2534,46.8502,156.3726,45.7309,157.7534,45.7309z"
                  ></path>
                  <path
                    d="M76.7533,45.7309c1.3808,0,2.5,1.1193,2.5,2.5001c0,1.3807-1.1192,2.4999-2.5,2.4999c-1.3807,0-2.5-1.1192-2.5-2.4999C74.2533,46.8502,75.3726,45.7309,76.7533,45.7309z"
                  ></path>
                </g>
              </svg>
              <div
                class="absolute text-base font-semibold text-center text-white"
                style="width: 120px; top: 28%; left: calc(50% - 60px);"
              >
                <span>//BALANCE INPUT</span>
              </div>
              <div
                class="absolute text-sm text-center text-navy-300"
                style="width: 120px; top: 73%; left: calc(50% - 60px);"
              >
                Balance
              </div>
            </div>
          </div>
          <div
            class="flex flex-col justify-center p-5 mt-auto tracking-wider rounded-lg sm:px-6 bg-navy-900 transition-opacity duration-300 self-stretch sm:h-[85px]"
          >
            <div class="flex items-baseline -mt-1">
              <span class="text-xs leading-none text-white uppercase">Use balance</span>
              <div class="ml-auto">
                <span class="text-xs font-bold leading-none text-gold">// EXTRA PERCENTAGE</span>
                <span class="ml-1 font-bold leading-none text-white">// SELECT AMOUNT</span>
                <span class="ml-1 font-bold leading-none text-navy-300">
                  / {$userData?.balance.toFixed(2)}&nbsp;PLN
                </span>
              </div>
            </div>
            <div style="position: relative;" class="flex items-center h-8 mt-1 sm:h-5 disabled">
              <div
                class="h-px bg-navy-500 track track-0"
                style="position: absolute; left: 0px; right: 377.8px;"
              ></div>
              <div
                class="h-px bg-navy-500 track track-1"
                style="position: absolute; left: 0px; right: 0px;"
              ></div>
              <div
                class="flex justify-center items-center leading-none text-sm text-white font-bold px-3 h-8 sm:h-5 bg-gold-600 rounded-full outline-none transform transition-transform duration-200 hover:scale-110 active:scale-150 whitespace-nowrap cursor-pointer cursor-pointer-0 "
                style="position: absolute; touch-action: none; z-index: 1; left: 0px;"
                tabindex="0"
                role="slider"
                aria-orientation="horizontal"
                aria-valuenow="{0}"
                aria-valuemin="{0}"
                aria-valuemax="{$userData?.balance ?? 0}"
              >
                0.00
              </div>
            </div>
          </div>
        </div>
        <div
          id="upgraderOptions"
          class="grid grid-cols-4 row-start-2 gap-3 lg:pt-10 lg:px-10"
          style="grid-area: options;"
        >
          <button
            class="text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent"
          >
            1.5x
          </button>
          <button
            class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg font-bold text-white border-navy-100 bg-navy-550"
          >
            2x
          </button>
          <button
            class="text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent"
          >
            5x
          </button>
          <button
            class="text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent"
          >
            10x
          </button>
          <button
            disabled
            class="h-10 col-span-2 flip-btn focus:outline-none disabled:opacity-25 disabled:pointer-events-none"
          ></button>
        </div>
        <div class="col-start-3 row-start-2 lg:pt-10 lg:px-10" style="grid-area: upgradeBtn;">
          <button
            class="h-full text-lg font-semibold rounded-lg bg-gold w-full px-[2.5em] pt-8 pb-7 uppercase hover:bg-gold-600 hover:shadow-lg hover:-translate-y-1 disabled:bg-white disabled:bg-opacity-10 disabled:hover:-translate-y-0 disabled:!shadow-none"
            style="box-shadow: rgba(220, 174, 100, 0.5) 0px 0px 10px;"
            disabled
          >
            Upgrade
          </button>
        </div>
      </div>
      <div class="grid gap-5 mt-3 sm:mt-5 lg:mt-10 lg:grid-cols-2">
        <div class="flex flex-col relative p-6 rounded-b-lg lg:rounded-t-lg bg-navy-800 ">
          <div class="flex items-center">
            <p
              class="font-bold text-sm md:text-base lg:text-lg leading-tight text-white hidden md:block"
            >
              Your items
              <span class="text-navy-300">
                ({filteredInv.length})
              </span>
            </p>
            <div
              class="flex flex-wrap justify-end -mt-3 -ml-3 sm:ml-auto sm:w-auto"
              style="visibility: visible;"
            >
              <button
                class="text-gray-500 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent opacity-50 pointer-events-none mt-3 ml-3"
              >
                Selected
              </button>
              <button
                class="text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent mt-3 ml-3"
              >
                Price
                <svg
                  class="ml-2 transition-transform duration-300"
                  style="transform: rotateX(180deg); width: 8px; height: 10px;"
                >
                  <use xlink:href="/icons/icons.svg#full-arrow-down"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul
            class="grid gap-3 mt-6 transition-opacity duration-300"
            style="grid-template: 1fr / repeat(auto-fill, minmax(110px, 1fr));"
          >
            {#if paginatedInventory.length > 0}
              {#each paginatedInventory[inventoryPage] as item}
                <li>
                  <div
                    class="relative flex flex-col items-center justify-between w-full bg-center bg-cover border border-solid rounded-lg select-none group border-navy-500 bg-navy-600 cursor-pointer"
                    style="aspect-ratio: 10 / 13; background-image: url(/images/browserItemBg.png);"
                  >
                    <div
                      class="absolute w-full h-5 border-t border-solid border-{item.skinRarity} rounded-lg pointer-events-none -top-px"
                      style=""
                    ></div>
                    <div class="flex items-center w-full">
                      <div
                        class="py-1.5 my-1.5 ml-2 mr-1 font-bold leading-none text-white uppercase text-2xs"
                      >
                        WW
                      </div>
                      <div
                        class="p-1.5 m-1.5 ml-auto font-bold leading-none rounded-md whitespace-nowrap text-gold bg-navy-900 min-w-0"
                        style="font-size: 9px;"
                      >
                        <div style="display: block; white-space: nowrap;">
                          {item.skinPrice.toFixed(2)}&nbsp;PLN
                        </div>
                      </div>
                    </div>
                    <div class="relative flex-1" style="width: calc(100% - 8px);">
                      <img
                        src="{item.skinImgSource}"
                        alt=""
                        class="absolute top-0 left-0 object-contain w-full h-full ease-out transform transition pointer-events-none group-hover:opacity-25 group-hover:scale-75"
                      />
                      <div
                        class="absolute flex items-center justify-center transform scale-90 rounded-full opacity-0 font-body group-hover:opacity-100 transition ease-out group-hover:scale-100 bg-gold add-svg"
                      >
                        <svg class="w-5 h-5 text-white">
                          <use xlink:href="/icons/icons.svg#plus-circle"></use>
                        </svg>
                      </div>
                    </div>
                    <p
                      class="flex-shrink-0 w-full px-1 font-bold leading-tight text-center text-white uppercase truncate text-2xs"
                    >
                      {item.weaponName}
                    </p>
                    <p
                      class="flex-shrink-0 mb-2 leading-tight text-center uppercase truncate text-navy-300 w-full px-0.5 text-2xs"
                    >
                      {item.skinName}
                    </p>
                  </div>
                </li>
              {/each}
            {/if}
          </ul>
          <div class="grid grid-cols-3 gap-3 pt-6 mt-auto transition-opacity duration-300">
            <button
              class="text-navy-300 flex items-center h-10 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent justify-center px-10 py-2 md:px-4 sm:justify-self-start"
              on:click="{() => (inventoryPage > 0 ? inventoryPage-- : null)}"
            >
              <svg class="w-4 h-4">
                <use xlink:href="/icons/icons.svg#arrow-left"></use>
              </svg>
            </button>
            <div
              class="flex items-center justify-center p-3 text-sm font-bold leading-none text-center text-white rounded bg-navy-900 sm:justify-self-center"
            >
              {inventoryPage + 1}/{Math.ceil(filteredInv.length / 15)}
            </div>
            <button
              class="text-navy-300 flex items-center h-10 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent justify-center px-10 py-2 md:px-4 sm:justify-self-end"
              on:click="{() =>
                inventoryPage < Math.ceil(filteredInv.length / 15) ? inventoryPage++ : null}"
            >
              <svg class="w-4 h-4 rotate-180">
                <use xlink:href="/icons/icons.svg?38#arrow-left"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col relative p-6 rounded-b-lg lg:rounded-t-lg bg-navy-800">
          <div class="text-navy-200 flex items-center ml-3 sm:ml-0">
            <p
              class="font-bold text-sm md:text-base lg:text-lg leading-tight text-white hidden md:block"
            >
              Upgrade
            </p>
            <div
              class="flex flex-wrap justify-between -mt-3 -ml-3 sm:justify-end sm:ml-auto sm:w-auto"
              style="visibility: visible;"
            >
              <button
                class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent opacity-50 pointer-events-none order-2 mt-3 sm:ml-3 sm:order-none w-[23%] sm:w-auto"
              >
                Selected
              </button>
              <label
                class="justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent flex order-1 w-full mt-3 sm:ml-3 sm:order-none sm:w-[150px]"
              >
                <svg class="self-center flex-shrink-0 w-4 h-4 mr-2 -ml-1">
                  <use xlink:href="/icons/icons.svg#find"></use>
                </svg>
                <input
                  type="text"
                  class="input flex-1 w-full text-xs text-white bg-transparent border-none focus:outline-none placeholder-navy-200 !pl-0"
                  placeholder="Find skin"
                  bind:value="{searchString}"
                />
              </label>
              <label
                class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent order-3 pr-0 mt-3 sm:ml-3 whitespace-nowrap sm:order-none w-[23%] sm:w-auto"
                aria-label="Minimum price"
              >
                PLN &gt;
                <input
                  type="number"
                  placeholder="0"
                  class="ml-1 text-white bg-transparent border-none outline-none placeholder-navy-300 w-[50px]"
                  bind:value="{minPrice}"
                />
              </label>
              <button
                class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent relative order-4 mt-3 sm:ml-3 sm:order-none w-[23%] sm:w-auto"
                aria-label="Select rarity"
              >
                Rarity
                <svg class="w-2 h-2 ml-2 transition-transform duration-700 ease-out transform">
                  <use xlink:href="/icons/icons.svg#arrow-down"></use>
                </svg>
                <ul
                  class="absolute left-0 z-10 py-2 text-left text-navy-100 border border-solid rounded-lg border-navy-300 bg-navy-700 whitespace-nowrap transform origin-top-left transition-all duration-700 ease-out will-change invisible opacity-0 scale-90"
                  style="top: calc(100% + 3px);"
                >
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500 font-bold text-white bg-navy-500"
                  >
                    <div class="flex-shrink-0 h-3 mr-2 w-2px"></div>
                    All
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(176, 195, 217);"
                    ></div>
                    Consumer grade
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(94, 152, 217);"
                    ></div>
                    Industrial grade
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(75, 105, 255);"
                    ></div>
                    Mil-spec
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(136, 71, 255);"
                    ></div>
                    Restricted
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(211, 44, 230);"
                    ></div>
                    Classified
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(235, 75, 75);"
                    ></div>
                    Covert
                  </li>
                  <li
                    class="flex items-center px-4 py-2 uppercase leading-none transition duration-300 hover:text-white hover:bg-navy-500"
                  >
                    <div
                      class="flex-shrink-0 h-3 mr-2 w-2px"
                      style="background-color: rgb(228, 174, 57);"
                    ></div>
                    Exceedingly Rare ★
                  </li>
                </ul>
              </button>
              <button
                class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent order-5 mt-3 sm:ml-3 sm:order-none w-[23%] sm:w-auto"
                aria-label="Sort by highest price"
              >
                Price
                <svg
                  class="ml-2 transition-transform duration-300"
                  style="transform: rotateX(180deg); height: 10px; width: 8px;"
                >
                  <use xlink:href="/icons/icons.svg#full-arrow-down"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul
            class="grid gap-3 mt-6 transition-opacity duration-300"
            style="grid-template: 1fr / repeat(auto-fill, minmax(110px, 1fr));"
          >
            {#if availableItems.length != 0}
              {#each availableItems as item}
                <li>
                  <div
                    class="relative flex flex-col items-center justify-between w-full bg-center bg-cover border border-solid rounded-lg select-none group border-navy-500 bg-navy-600 cursor-pointer"
                    style="aspect-ratio: 10 / 13; background-image: url(/images/browserItemBg.png);"
                  >
                    <div
                      class="absolute w-full h-5 border-t border-solid border-{item.skinRarity} rounded-lg pointer-events-none -top-px"
                      style=""
                    ></div>
                    <div class="flex items-center w-full">
                      <div
                        class="py-1.5 my-1.5 ml-2 mr-1 font-bold leading-none text-white uppercase text-2xs"
                      >
                        {item.skinQuality}
                      </div>
                      <div
                        class="p-1.5 m-1.5 ml-auto font-bold leading-none rounded-md whitespace-nowrap text-gold bg-navy-900 min-w-0"
                        style="font-size: 9px;"
                      >
                        <div style="display: block; white-space: nowrap;">
                          {item.skinPrice.toFixed(2)}&nbsp;PLN
                        </div>
                      </div>
                    </div>
                    <div class="relative flex-1" style="width: calc(100% - 8px);">
                      <img
                        src="{item.skinImgSource}"
                        alt=""
                        class="absolute top-0 left-0 object-contain w-full h-full ease-out transform transition pointer-events-none group-hover:opacity-25 group-hover:scale-75"
                      />
                      <div
                        class="absolute flex items-center justify-center transform scale-90 rounded-full opacity-0 font-body group-hover:opacity-100 transition ease-out group-hover:scale-100 bg-gold add-svg"
                      >
                        <svg class="w-5 h-5 text-white">
                          <use xlink:href="/icons/icons.svg#plus-circle"></use>
                        </svg>
                      </div>
                    </div>
                    <p
                      class="flex-shrink-0 w-full px-1 font-bold leading-tight text-center text-white uppercase truncate text-2xs"
                    >
                      {item.weaponName}
                    </p>
                    <p
                      class="flex-shrink-0 mb-2 leading-tight text-center uppercase truncate text-navy-300 w-full px-0.5 text-2xs"
                    >
                      {item.skinName}
                    </p>
                  </div>
                </li>
              {/each}
            {:else}
              placeholder
            {/if}
          </ul>
          <div class="grid grid-cols-3 gap-3 pt-6 mt-auto transition-opacity duration-300">
            <button
              on:click="{() => (availableItemsPage > 0 ? availableItemsPage-- : null)}"
              class="text-navy-300 flex items-center h-10 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent justify-center px-10 py-2 md:px-4 sm:justify-self-start"
            >
              <svg class="w-4 h-4">
                <use xlink:href="/icons/icons.svg#arrow-left"></use>
              </svg>
            </button>
            <div
              class="flex items-center justify-center p-3 text-sm font-bold leading-none text-center text-white rounded bg-navy-900 sm:justify-self-center"
            >
              {availableItemsPage + 1}/{Math.ceil(availableItemsCount / 15)}
            </div>
            <button
              on:click="{() =>
                availableItemsPage < Math.ceil(availableItemsCount / 15) - 1
                  ? availableItemsPage++
                  : null}"
              class="text-navy-300 flex items-center h-10 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent justify-center px-10 py-2 md:px-4 sm:justify-self-end"
            >
              <svg class="w-4 h-4 rotate-180">
                <use xlink:href="/icons/icons.svg#arrow-left"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
