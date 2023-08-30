<script lang="ts">
  import { createToast, convertPrice, sellItems, type ItemWithGlobal } from '$lib';
  import InventoryItem from '$components/inventory/InventoryItem.svelte';
  import InventoryHeader from '$components/inventory/InventoryHeader.svelte';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { invalidateAll } from '$app/navigation';
  import SetBalance from '$components/forms/SetBalance.svelte';
  import { onMount } from 'svelte';
  import ChangeProfilePic from '$components/forms/ChangeProfilePic.svelte';

  let totalSkinPrice = 0;
  let loading = false;
  let allItemsFilter: boolean;
  let dropdownWidth: number;
  let displayFilter: string;
  let inventory: ItemWithGlobal[] = $page.data.userInventory!.sort(
    (a, b) => new Date(b.dropDate).getTime() - new Date(a.dropDate).getTime()
  );
  let paginatedInventory: ItemWithGlobal[][] = [];
  let loadedPages = [0];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (loadedPages.length < paginatedInventory.length)
              loadedPages.push(loadedPages.length);
            loadedPages = loadedPages;
          }
        });
      },
      { threshold: 1 }
    );

    const loadIndicator = document.querySelector('.loadIndicator');
    if (loadIndicator) observer.observe(loadIndicator);
  });

  $: {
    if (allItemsFilter) inventory = $page.data.userInventory || [];
    else inventory = $page.data.userInventory!.filter((obj) => !obj.sold && !obj.upgraded) || [];
  }
  $: totalSkinPrice =
    $page.data.userInventory!.reduce(
      (n, o) => n + (o.sold || o.upgraded ? 0 : o.globalInvItem.skinPrice),
      0
    ) ?? 0;

  $: {
    paginatedInventory = [];
    const iterations = Math.ceil(inventory.length / 16);
    for (let i = 0; i < iterations; i++) {
      paginatedInventory.push(inventory.slice(i * 18, i * 18 + 18));
    }
  }

  async function handleInventorySell() {
    const filterdItems = $page.data.userInventory!.filter((obj) => !obj.sold && !obj.upgraded);
    if (!filterdItems)
      return createToast({
        header: $_('error'),
        message: $_('toasts.error.messages.errorDuringSell'),
        type: 'error'
      });

    loading = true;
    const sellData = await sellItems(filterdItems);

    createToast({
      header: sellData.res.ok ? $_('success') : $_('error'),
      type: sellData.res.ok ? 'success' : 'error',
      message: $_(sellData.messageKey)
    });

    await invalidateAll();
    loading = false;
  }

  function toggleDropdown() {
    document.querySelector('.dropdown-items')?.classList.toggle('hidden');
    document.querySelector('.dropdown-arrow-svg')?.classList.toggle('rotate-180');
  }

  function sortItems(index: number) {
    loading = true;
    const optionElms = document.querySelectorAll('.dropdown-item');
    const sort = optionElms[index].textContent as string;
    let tempInv: ItemWithGlobal[] | undefined;
    displayFilter = sort;
    if (sort === $_('profile.sort.newest')) tempInv = $page.data.userInventory!;
    if (sort === $_('profile.sort.oldest')) tempInv = $page.data.userInventory!.slice().reverse();
    if (sort === $_('profile.sort.cheapest'))
      tempInv = $page.data
        .userInventory!.slice()
        .sort((a, b) => a.globalInvItem.skinPrice - b.globalInvItem.skinPrice);
    if (sort === $_('profile.sort.mostExpensive'))
      tempInv = $page.data
        .userInventory!.slice()
        .sort((a, b) => b.globalInvItem.skinPrice - a.globalInvItem.skinPrice);
    if (allItemsFilter) inventory = tempInv || [];
    else inventory = tempInv?.filter((obj) => !obj.sold) || [];
    toggleDropdown();
    loading = false;
  }
</script>

<main
  class="bg-no-repeat"
  style="
    background-image: url(/images/bg.webp);
    background-position: center top;
    background-size: 2570px;
  "
>
  <div class="pb-16 pt-4 text-white">
    <InventoryHeader />
    <div class="container mx-auto">
      <div class="mb-4 flex w-full flex-col items-center justify-center gap-y-4">
        <SetBalance />
        <ChangeProfilePic />
      </div>
      <section>
        <div class="max-w-screen-xxl mx-auto xl:px-5">
          <div
            class="mb-12 flex w-full flex-wrap items-center overflow-hidden bg-navy-750 xl:flex-nowrap xl:rounded-2xl"
          >
            <div
              class="dropdown-width w-1/2 py-4 pl-1.5 pr-3 transition-opacity duration-200 md:pr-4 xl:w-full"
            >
              <div
                class="mb-1 self-start text-[8px] font-medium uppercase tracking-wide text-navy-200 xl:self-center"
              >
                {$_('profile.sort.title')}
              </div>
              <div class="relative h-9 w-full">
                <button
                  id="dropdown"
                  class="dropdown dropdown-compact h-9 w-full rounded-lg border-[0.5px] border-navy-500 bg-navy-600 uppercase xl:mr-0"
                  bind:offsetWidth="{dropdownWidth}"
                  on:click="{toggleDropdown}"
                >
                  <div class="px-3 text-[16px] lg:text-2xs">
                    <span
                      class="text-[10px] font-semibold uppercase text-navy-300"
                      contenteditable="true"
                      bind:textContent="{displayFilter}"
                    >
                      {$_('profile.sort.newest')}
                    </span>
                  </div>
                  <div class="dropdown-arrow ml-auto">
                    <svg
                      class="dropdown-arrow-svg icon block h-2.5 w-2.5 flex-shrink-0 transition-transform duration-200"
                      viewBox="0 0 10 6"
                      fill="none"
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div
                class="dropdown-items absolute z-50 hidden w-full origin-top scale-100 transform opacity-100"
                style="width: {dropdownWidth}px;"
              >
                <div
                  class="flex flex-col rounded-lg border border-navy-200 border-opacity-30 bg-navy-700 bg-opacity-90 shadow-lg"
                >
                  <div
                    on:click="{() => sortItems(0)}"
                    on:keydown="{() => null}"
                    role="button"
                    tabindex="0"
                    class="dropdown-item flex w-full cursor-pointer items-center px-3 py-2 text-left text-[16px] font-semibold uppercase text-navy-200 outline-none transition-colors duration-200 hover:bg-navy-600 lg:text-xs"
                  >
                    {$_('profile.sort.newest')}
                  </div>
                  <div
                    on:click="{() => sortItems(1)}"
                    on:keydown="{() => null}"
                    role="button"
                    tabindex="0"
                    class="dropdown-item flex w-full cursor-pointer items-center px-3 py-2 text-left text-[16px] font-semibold uppercase text-navy-200 outline-none transition-colors duration-200 hover:bg-navy-600 lg:text-xs"
                  >
                    {$_('profile.sort.oldest')}
                  </div>
                  <div
                    on:click="{() => sortItems(2)}"
                    on:keydown="{() => null}"
                    role="button"
                    tabindex="0"
                    class="dropdown-item flex w-full cursor-pointer items-center px-3 py-2 text-left text-[16px] font-semibold uppercase text-navy-200 outline-none transition-colors duration-200 hover:bg-navy-600 lg:text-xs"
                  >
                    {$_('profile.sort.cheapest')}
                  </div>
                  <div
                    on:click="{() => sortItems(3)}"
                    on:keydown="{() => null}"
                    role="button"
                    tabindex="0"
                    class="dropdown-item flex w-full cursor-pointer items-center px-3 py-2 text-left text-[16px] font-semibold uppercase text-navy-200 outline-none transition-colors duration-200 hover:bg-navy-600 lg:text-xs"
                  >
                    {$_('profile.sort.mostExpensive')}
                  </div>
                </div>
              </div>
            </div>
            <div class="mr-auto w-1/2 py-4 pl-1.5 pr-3 md:px-3 lg:w-1/4 xl:w-auto">
              <div
                class="mb-1 self-start text-[8px] font-medium uppercase tracking-wide text-navy-200 xl:self-center"
              >
                {$_('profile.showItems.title')}
              </div>
              <div class="flex h-9 items-center">
                <div class="switch flex">
                  <label for="labelid-13" class="flex items-center">
                    <div
                      class="mr-3 cursor-pointer py-1.5 text-right {!allItemsFilter
                        ? 'text-gray'
                        : 'text-white'} text-[10px] font-semibold uppercase"
                    >
                      {$_('profile.showItems.all')}
                    </div>
                    <div class="relative cursor-pointer">
                      <input
                        id="labelid-13"
                        type="checkbox"
                        class="hidden"
                        bind:checked="{allItemsFilter}"
                      />
                      <div
                        class="toggle__line h-6 w-[3.25rem] rounded-full bg-navy-500 shadow-inner"
                      ></div>
                      <div
                        class="toggle__dot absolute inset-y-0 left-0 m-1 h-4 w-6 translate-x-5 transform rounded-lg bg-white shadow transition duration-200"
                      ></div>
                    </div>
                    <div
                      class="ml-3 cursor-pointer py-1.5 {allItemsFilter
                        ? 'text-gray'
                        : 'text-white'} text-[10px] font-semibold uppercase"
                    >
                      {$_('profile.showItems.active')}
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <a
              href="/skins/upgrader"
              class="w-1/2 px-4 py-4 sm:w-auto md:px-3 {loading
                ? 'pointer-events-none cursor-none opacity-25'
                : ''}"
            >
              <div
                class="flex items-center justify-center text-[10px] font-semibold uppercase leading-none text-red sm:justify-start"
              >
                <svg class="mr-2 h-6 w-6">
                  <use xlink:href="/icons/nav-icons.svg#donut-chart"></use>
                </svg>
                {$_('profile.upgrade')}
              </div>
            </a>
            <div
              class="w-1/2 px-4 py-4 sm:w-auto md:px-3 {loading
                ? 'pointer-events-none cursor-none opacity-25'
                : ''}"
            >
              <button
                class="group mx-auto flex items-center text-left text-[10px] font-semibold uppercase text-neonGreen sm:mx-0"
                on:click="{handleInventorySell}"
              >
                <svg class="icon mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20 4H4C2.897 4 2 4.897 2 6v2h20V6C22 4.897 21.103 4 20 4zM2 18c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-6H2V18zM5 15h6v2H5V15z"
                  ></path>
                </svg>
                <div class="mt-1 leading-none">
                  {$_('profile.sellAll')}
                  <div
                    class="text-left text-[8px] text-navy-200 transition-colors duration-200 group-hover:text-white"
                  >
                    {convertPrice($page.data.currency, totalSkinPrice)}
                  </div>
                </div>
              </button>
            </div>
            <a
              href="/skin-changer"
              class="w-1/2 px-4 py-4 sm:w-auto md:px-3 {loading
                ? 'pointer-events-none cursor-none opacity-25'
                : ''}"
            >
              <div
                class="flex items-center justify-center text-[10px] font-semibold uppercase text-teal-500 sm:justify-start"
              >
                <svg class="mr-2 h-6 w-6">
                  <use xlink:href="/icons/nav-icons.svg#lightning"></use>
                </svg>
                {$_('profile.exchange')}
              </div>
            </a>
          </div>
        </div>
        {#if inventory && inventory.length > 0}
          <ul class="profile-items-template my-3 grid gap-10">
            {#each loadedPages as page}
              {#each paginatedInventory[page] as item}
                <InventoryItem itemData="{item}" />
              {/each}
            {/each}
          </ul>
          <div class="loadIndicator"></div>
        {:else if inventory && inventory.length === 0}
          <span>No items</span>
        {:else}
          <span>{$_('loading')}</span>
        {/if}
      </section>
    </div>
  </div>
</main>
