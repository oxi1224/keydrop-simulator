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
    if (
      e.buttons !== 1 ||
      selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)
    )
      return;
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

<div class="flex flex-col relative p-6 rounded-b-lg lg:rounded-t-lg bg-navy-800">
  <div class="flex items-center">
    <p class="font-bold text-sm md:text-base lg:text-lg leading-tight text-white hidden md:block">
      {$_('upgrader.yourItems')}
      <span class="text-navy-300">
        ({filteredInv.length})
      </span>
    </p>
    <div
      class="flex flex-wrap justify-end -mt-3 -ml-3 sm:ml-auto sm:w-auto"
      style="visibility: visible;"
    >
      <button
        class="text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent mt-3 ml-3"
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
    class="grid gap-3 mt-6 transition-opacity duration-300"
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
            class="relative flex flex-col items-center justify-between w-full bg-center bg-cover border border-solid rounded-lg select-none group border-navy-500 bg-navy-600 cursor-pointer"
            style="aspect-ratio: 10 / 13; background-image: url(/images/browseritembg.webp);"
          >
            <div
              class="absolute w-full h-5 border-t border-solid border-{item.globalInvItem
                .skinRarity} rounded-lg pointer-events-none -top-px"
              style=""
            ></div>
            <div class="flex items-center w-full">
              <div
                class="py-1.5 my-1.5 ml-2 mr-1 font-bold leading-none text-white uppercase text-2xs"
              >
                {item.globalInvItem.skinQuality}
              </div>
              <div
                class="p-1.5 m-1.5 ml-auto font-bold leading-none rounded-md whitespace-nowrap text-gold bg-navy-900 min-w-0"
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
                class="absolute top-0 left-0 object-contain w-full h-full ease-out transform transition pointer-events-none group-hover:opacity-25 group-hover:scale-75"
              />
              <div
                class="absolute {selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)
                  ? 'hidden'
                  : 'flex'} items-center justify-center transform scale-90 rounded-full opacity-0 font-body group-hover:opacity-100 transition ease-out group-hover:scale-100 bg-gold add-svg"
              >
                <svg class="w-5 h-5 text-white">
                  <use xlink:href="/icons/icons.svg#plus-circle"></use>
                </svg>
              </div>
              <div
                class="absolute {selectedUpgradeItems.map((i) => i.dropId).includes(item.dropId)
                  ? 'flex'
                  : 'hidden'} items-center justify-center transform scale-90 rounded-full font-body transition ease-out bg-red selected-svg"
              >
                <svg class="w-5 h-5 text-white">
                  <use xlink:href="/icons/icons.svg#tick"></use>
                </svg>
              </div>
            </div>
            <p
              class="flex-shrink-0 w-full px-1 font-bold leading-tight text-center text-white uppercase truncate text-2xs"
            >
              {item.globalInvItem.weaponName}
            </p>
            <p
              class="flex-shrink-0 mb-2 leading-tight text-center uppercase truncate text-navy-300 w-full px-0.5 text-2xs"
            >
              {item.globalInvItem.skinName}
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
