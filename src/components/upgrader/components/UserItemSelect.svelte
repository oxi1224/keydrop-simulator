<script lang="ts">
  import { page } from '$app/stores';
  import { convertPrice, createToast, type ItemWithGlobal } from '$lib';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let selectedUpgradeItems: ItemWithGlobal[] = [];
  let paginatedInventory: ItemWithGlobal[][] = [];
  let inventoryPage = 0;
  let inventorySkinOrder: 'ASC' | 'DESC' = 'ASC';
  let filteredInv: ItemWithGlobal[] =
    $page.data
      .userInventory!.filter((item) => !item.sold && !item.upgraded)
      .sort((a, b) => b.globalInvItem.skinPrice - a.globalInvItem.skinPrice) ?? [];

  const dispatch = createEventDispatcher();

  function selectUpgradeItem(item: ItemWithGlobal, targetElm: EventTarget | null) {
    dispatch('upgrade-item-select');
    if (!filteredInv.map((i) => i.dropId).includes(item.dropId))
      return createToast({
        type: 'error',
        header: 'błąd',
        message: 'Refresh'
      });
    if (!targetElm)
      return createToast({
        type: 'error',
        header: 'błąd',
        message: ''
      });

    if (selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)) {
      const selectedIndex = selectedUpgradeItems.findIndex((i) => i.dropId == item.dropId);
      selectedUpgradeItems.splice(selectedIndex, 1);
      selectedUpgradeItems = selectedUpgradeItems;
    } else {
      if (selectedUpgradeItems.length == 15)
        return createToast({
          type: 'error',
          header: 'błąd',
          message: $_('toasts.error.messages.maxItemsSelected')
        });
      selectedUpgradeItems.push(item);
      selectedUpgradeItems = selectedUpgradeItems;
    }
  }

  function handleFastSelect(e: MouseEvent, item: ItemWithGlobal, targetElm: EventTarget | null) {
    if (e.buttons !== 1 || selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)) return;
    selectUpgradeItem(item, targetElm);
  }

  $: filteredInv =
    $page.data
      .userInventory!.filter((item) => !item.sold && !item.upgraded)
      .sort((a, b) =>
        inventorySkinOrder === 'ASC'
          ? b.globalInvItem.skinPrice - a.globalInvItem.skinPrice
          : a.globalInvItem.skinPrice - b.globalInvItem.skinPrice
      ) ?? [];

  $: {
    paginatedInventory = [];
    const iterations = Math.ceil(filteredInv.length / 15);
    for (let i = 0; i < iterations; i++) {
      paginatedInventory.push(filteredInv.slice(i * 15, i * 15 + 15));
    }
  }
</script>

<div class="relative flex flex-col rounded-b-lg bg-navy-800 p-6 lg:rounded-t-lg">
  <div class="flex items-center">
    <p class="hidden text-sm font-bold leading-tight text-white md:block md:text-base lg:text-lg">
      {$_('upgrader.yourItems')}
      <span class="text-navy-300">
        ({filteredInv.length})
      </span>
    </p>
    <div
      class="-ml-3 -mt-3 flex flex-wrap justify-end sm:ml-auto sm:w-auto"
      style="visibility: visible;"
    >
      <button
        class="ml-3 mt-3 flex h-10 items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-4 text-center text-xs text-navy-200 transition-all duration-300 hover:border-navy-300 hover:text-white"
        on:click="{() => (inventorySkinOrder = inventorySkinOrder === 'ASC' ? 'DESC' : 'ASC')}"
      >
        {$_('upgrader.price')}
        <svg
          class="ml-2 transition-transform duration-300"
          style="transform: rotateX({inventorySkinOrder === 'ASC'
            ? '180deg'
            : '0deg'}); width: 8px; height: 10px;"
        >
          <use xlink:href="/icons/icons.svg#full-arrow-down"></use>
        </svg>
      </button>
    </div>
  </div>
  <ul
    class="mt-6 grid gap-3 transition-opacity duration-300"
    style="grid-template: 1fr / repeat(auto-fill, minmax(110px, 1fr));"
  >
    {#if paginatedInventory.length > 0}
      {#each paginatedInventory[inventoryPage] as item}
        <li
          on:keypress="{() => null}"
          on:focus="{() => null}"
          on:mousedown="{(e) => selectUpgradeItem(item, e.target)}"
          on:mouseover="{(e) => handleFastSelect(e, item, e.target)}"
        >
          <div
            class="group relative flex w-full cursor-pointer select-none flex-col items-center justify-between rounded-lg border border-solid border-navy-500 bg-navy-600 bg-cover bg-center"
            style="aspect-ratio: 10 / 13; background-image: url(/images/browseritembg.webp);"
          >
            <div
              class="absolute h-5 w-full border-t border-solid border-{item.globalInvItem
                .skinRarity} pointer-events-none -top-px rounded-lg"
              style=""
            ></div>
            <div class="flex w-full items-center">
              <div
                class="my-1.5 ml-2 mr-1 py-1.5 text-2xs font-bold uppercase leading-none text-white"
              >
                {item.globalInvItem.skinQuality}
              </div>
              <div
                class="m-1.5 ml-auto min-w-0 whitespace-nowrap rounded-md bg-navy-900 p-1.5 font-bold leading-none text-gold"
                style="font-size: 9px;"
              >
                <div style="display: block; white-space: nowrap;">
                  {convertPrice($page.data.currency, item.globalInvItem.skinPrice)}
                </div>
              </div>
            </div>
            <div class="relative flex-1" style="width: calc(100% - 8px);">
              <img
                src="{item.globalInvItem.skinImgSource}"
                alt=""
                class="pointer-events-none absolute left-0 top-0 h-full w-full transform object-contain transition ease-out group-hover:scale-75 group-hover:opacity-25"
              />
              <div
                class="absolute {selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)
                  ? 'hidden'
                  : 'flex'} font-body add-svg scale-90 transform items-center justify-center rounded-full bg-gold opacity-0 transition ease-out group-hover:scale-100 group-hover:opacity-100"
              >
                <svg class="h-5 w-5 text-white">
                  <use xlink:href="/icons/icons.svg#plus-circle"></use>
                </svg>
              </div>
              <div
                class="absolute {selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)
                  ? 'flex'
                  : 'hidden'} font-body selected-svg scale-90 transform items-center justify-center rounded-full bg-red transition ease-out"
              >
                <svg class="h-5 w-5 text-white">
                  <use xlink:href="/icons/icons.svg#tick"></use>
                </svg>
              </div>
            </div>
            <p
              class="w-full flex-shrink-0 truncate px-1 text-center text-2xs font-bold uppercase leading-tight text-white"
            >
              {item.globalInvItem.weaponName}
            </p>
            <p
              class="mb-2 w-full flex-shrink-0 truncate px-0.5 text-center text-2xs uppercase leading-tight text-navy-300"
            >
              {item.globalInvItem.skinName}
            </p>
          </div>
        </li>
      {/each}
    {/if}
  </ul>
  <div class="mt-auto grid grid-cols-3 gap-3 pt-6 transition-opacity duration-300">
    <button
      class="flex h-10 items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-10 py-2 text-center text-xs text-navy-300 transition-all duration-300 hover:border-navy-300 hover:text-white sm:justify-self-start md:px-4"
      on:click="{() => (inventoryPage > 0 ? inventoryPage-- : null)}"
    >
      <svg class="h-4 w-4">
        <use xlink:href="/icons/icons.svg#arrow-left"></use>
      </svg>
    </button>
    <div
      class="flex items-center justify-center rounded bg-navy-900 p-3 text-center text-sm font-bold leading-none text-white sm:justify-self-center"
    >
      {inventoryPage + 1}/{Math.ceil(filteredInv.length / 15)}
    </div>
    <button
      class="flex h-10 items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-10 py-2 text-center text-xs text-navy-300 transition-all duration-300 hover:border-navy-300 hover:text-white sm:justify-self-end md:px-4"
      on:click="{() =>
        inventoryPage < Math.ceil(filteredInv.length / 15) ? inventoryPage++ : null}"
    >
      <svg class="h-4 w-4 rotate-180">
        <use xlink:href="/icons/icons.svg?38#arrow-left"></use>
      </svg>
    </button>
  </div>
</div>

<style>
  .add-svg {
    width: 40px;
    height: 40px;
    top: calc(50% - 20px);
    left: calc(50% - 20px);
    box-shadow: rgb(220, 174, 100) 0px 0px 30px;
  }

  .selected-svg {
    width: 40px;
    height: 40px;
    top: calc(50% - 20px);
    left: calc(50% - 20px);
    box-shadow: rgb(220, 174, 100) 0px 0px 30px;
  }
</style>
