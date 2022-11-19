<script lang="ts">
  import type { Item } from '@prisma/client';
  import { sellItems, setUserData, userData } from '$lib';
  import InventoryItem from '$components/inventory components/InventoryItem.svelte';
  import InventoryHeader from '$components/inventory components/InventoryHeader.svelte';

  let totalSkinPrice = 0;
  let loading = false;
  let allItemsFilter: boolean;
  let dropdownWidth: number;
  let displayFilter: string;
  let inventory = $userData?.inventory || [];
  $: {
    if (allItemsFilter) inventory = $userData?.inventory || [];
    else inventory = $userData?.inventory.filter((obj) => !obj.sold) || [];
  }
  $: totalSkinPrice = $userData?.inventory.reduce((n, o) => n + (o.sold ? 0 : o.skinPrice), 0) ?? 0;

  async function handleMassSell(skins: Item[]) {
    loading = true;
    const res = await sellItems(skins.filter((obj) => !obj.sold || !obj.upgraded));
    if (res.ok) await setUserData();
    loading = false;
  }

  function toggleDropdown() {
    document.querySelector('.dropdown-items')?.classList.toggle('hidden');
    document.querySelector('.dropdown-arrow-svg')?.classList.toggle('rotate-180');
  }

  function sortItems(index: number) {
    console.log(allItemsFilter);
    loading = true;
    const optionElms = document.querySelectorAll('.dropdown-item');
    const sort = optionElms[index].textContent as string;
    let tempInv: Item[] | undefined;
    displayFilter = sort;
    if (sort === 'najnowsze') tempInv = $userData?.inventory;
    if (sort === 'najstarsze') tempInv = $userData?.inventory.slice().reverse();
    if (sort === 'najtańsze')
      tempInv = $userData?.inventory.slice().sort((a, b) => a.skinPrice - b.skinPrice);
    if (sort === 'najdroższe')
      tempInv = $userData?.inventory.slice().sort((a, b) => b.skinPrice - a.skinPrice);
    if (allItemsFilter) inventory = tempInv || [];
    else inventory = tempInv?.filter((obj) => !obj.sold) || [];
    toggleDropdown();
    loading = false;
  }
</script>

<main
  class="bg-no-repeat"
  style="
    background-image: url(/images/bg.png);
    background-position: center top;
    background-size: 2570px;
  "
>
  <div class="pt-4 pb-16 text-white">
    <InventoryHeader />
    <div class="container mx-auto">
      <section>
        <div class="mx-auto xl:px-5 max-w-screen-xxl">
          <div
            class="flex flex-wrap xl:flex-nowrap items-center w-full mb-12 xl:rounded-2xl bg-navy-750 overflow-hidden"
          >
            <div
              class="w-1/2 py-4 pl-1.5 pr-3 md:pr-4 xl:w-full duration-200 transition-opacity dropdown-width"
            >
              <div
                class="self-start mb-1 font-medium tracking-wide uppercase xl:self-center text-[8px] text-navy-200"
              >
                Sortowanie
              </div>
              <div class="relative w-full h-9">
                <button
                  id="dropdown"
                  class="dropdown dropdown-compact uppercase w-full xl:mr-0 h-9 border-navy-500 rounded-lg"
                  bind:offsetWidth="{dropdownWidth}"
                  on:click="{toggleDropdown}"
                >
                  <div class="px-3 text-[16px] lg:text-2xs">
                    <span
                      class="font-semibold uppercase text-[10px] text-navy-300"
                      contenteditable="true"
                      bind:textContent="{displayFilter}"
                    >
                      Najnowsze
                    </span>
                  </div>
                  <div class="ml-auto dropdown-arrow">
                    <svg
                      class="dropdown-arrow-svg icon flex-shrink-0 block transition-transform duration-200 w-2.5 h-2.5"
                      viewBox="0 0 10 6"
                      fill="none"
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div
                class="hidden dropdown-items absolute z-50 w-full origin-top transform scale-100 opacity-100"
                style="width: {dropdownWidth}px;"
              >
                <div
                  class="flex flex-col rounded-lg border border-navy-200 border-opacity-30 shadow-lg bg-navy-700 bg-opacity-90"
                >
                  <div
                    on:click="{() => sortItems(0)}"
                    class="dropdown-item cursor-pointer text-[16px] lg:text-xs font-semibold py-2 w-full text-left px-3 flex items-center outline-none transition-colors duration-200 uppercase text-navy-200 hover:bg-navy-600"
                  >
                    najnowsze
                  </div>
                  <div
                    on:click="{() => sortItems(1)}"
                    class="dropdown-item cursor-pointer text-[16px] lg:text-xs font-semibold py-2 w-full text-left px-3 flex items-center outline-none transition-colors duration-200 uppercase text-navy-200 hover:bg-navy-600"
                  >
                    najstarsze
                  </div>
                  <div
                    on:click="{() => sortItems(2)}"
                    class="dropdown-item cursor-pointer text-[16px] lg:text-xs font-semibold py-2 w-full text-left px-3 flex items-center outline-none transition-colors duration-200 uppercase text-navy-200 hover:bg-navy-600"
                  >
                    najtańsze
                  </div>
                  <div
                    on:click="{() => sortItems(3)}"
                    class="dropdown-item cursor-pointer text-[16px] lg:text-xs font-semibold py-2 w-full text-left px-3 flex items-center outline-none transition-colors duration-200 uppercase text-navy-200 hover:bg-navy-600"
                  >
                    najdroższe
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/2 pl-1.5 pr-3 md:px-3 py-4 mr-auto lg:w-1/4 xl:w-auto">
              <div
                class="self-start mb-1 font-medium tracking-wide uppercase xl:self-center text-[8px] text-navy-200"
              >
                Pokaż przedmioty
              </div>
              <div class="flex items-center h-9">
                <div class="flex switch">
                  <label for="labelid-13" class="flex items-center">
                    <div
                      class="mr-3 cursor-pointer py-1.5 text-right {!allItemsFilter
                        ? 'text-gray'
                        : 'text-white'} text-[10px] font-semibold uppercase"
                    >
                      Wszystkie
                    </div>
                    <div class="relative cursor-pointer">
                      <input
                        id="labelid-13"
                        type="checkbox"
                        class="hidden"
                        bind:checked="{allItemsFilter}"
                      />
                      <div
                        class="h-6 rounded-full shadow-inner w-[3.25rem] toggle__line bg-navy-500"
                      ></div>
                      <div
                        class="absolute inset-y-0 left-0 w-6 h-4 m-1 transition duration-200 transform translate-x-5  shadow rounded-lg toggle__dot bg-white"
                      ></div>
                    </div>
                    <div
                      class="ml-3 cursor-pointer py-1.5 {allItemsFilter
                        ? 'text-gray'
                        : 'text-white'} text-[10px] font-semibold uppercase"
                    >
                      Aktywne
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <a
              href="/skins/Upgrader"
              class="px-4 md:px-3 py-4 w-1/2 sm:w-auto {loading
                ? 'opacity-25 pointer-events-none cursor-none'
                : ''}"
            >
              <div
                class="flex items-center justify-center font-semibold leading-none uppercase sm:justify-start text-[10px] text-red"
              >
                <svg class="w-6 h-6 mr-2">
                  <use xlink:href="/icons/nav-icons.svg#donut-chart"></use>
                </svg>
                Ulepsz&nbsp;wszystko
              </div>
            </a>
            <div
              class="w-1/2 px-4 py-4 md:px-3 sm:w-auto {loading
                ? 'opacity-25 pointer-events-none cursor-none'
                : ''}"
            >
              <button
                class="group flex items-center text-left font-semibold uppercase text-[10px] text-neonGreen mx-auto sm:mx-0"
                on:click="{() =>
                  handleMassSell(inventory.filter((obj) => !obj.sold || !obj.upgraded))}"
              >
                <svg class="icon w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20 4H4C2.897 4 2 4.897 2 6v2h20V6C22 4.897 21.103 4 20 4zM2 18c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-6H2V18zM5 15h6v2H5V15z"
                  ></path>
                </svg>
                <div class="mt-1 leading-none">
                  Sprzedaj&nbsp;wszystko
                  <div
                    class="text-left transition-colors duration-200 text-[8px] text-navy-200 group-hover:text-white"
                  >
                    {totalSkinPrice.toFixed(2)}&nbsp;PLN
                  </div>
                </div>
              </button>
            </div>
            <a
              href="/skin-changer"
              class="px-4 md:px-3 py-4 w-1/2 sm:w-auto {loading
                ? 'opacity-25 pointer-events-none cursor-none'
                : ''}"
            >
              <div
                class="flex items-center justify-center font-semibold uppercase sm:justify-start text-[10px] text-teal-500"
              >
                <svg class="w-6 h-6 mr-2">
                  <use xlink:href="/icons/nav-icons.svg#lightning"></use>
                </svg>
                Wymień
              </div>
            </a>
          </div>
        </div>
        {#if inventory}
          <ul class="grid gap-10 my-3 profile-items-template">
            {#each inventory as item}
              <InventoryItem itemData="{item}" />
            {/each}
          </ul>
        {:else}
          Ładowanie
        {/if}
      </section>
    </div>
  </div>
</main>
