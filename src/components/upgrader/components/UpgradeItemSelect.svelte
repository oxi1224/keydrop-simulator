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
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { convertPrice, createToast } from '$lib';
  import type { GlobalInventoryItem } from '@prisma/client';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let availableItems: GlobalInventoryItem[];
  export let minPrice: number;
  export let selectedGoalItems: GlobalInventoryItem[] = [];
  export let totalGoalValue = 0;
  let availableItemsCount = availableItems.length;
  let availableItemsPage = 0;

  let order: 'ASC' | 'DESC' = 'ASC';
  let searchString = '';

  const dispatch = createEventDispatcher();

  function selectGoalItem(item: GlobalInventoryItem, targetElm: EventTarget | null) {
    dispatch('goal-item-select');
    if (!targetElm)
      return createToast({
        type: 'error',
        header: 'błąd',
        message: ''
      });

    if (selectedGoalItems.map((i) => i.id).includes(item.id)) {
      const selectedIndex = selectedGoalItems.findIndex((i) => i.id == item.id);
      selectedGoalItems.splice(selectedIndex, 1);
      selectedGoalItems = selectedGoalItems;
      availableItems = availableItems;
      totalGoalValue -= item.skinPrice;
    } else {
      if (selectedGoalItems.length == 15)
        return createToast({
          type: 'error',
          header: 'błąd',
          message: $_('toasts.error.messages.maxItemsSelected')
        });

      selectedGoalItems.push(item);
      selectedGoalItems = selectedGoalItems;
      totalGoalValue += item.skinPrice;
    }
  }

  function handleFastSelect(e: MouseEvent, item: GlobalInventoryItem, targetElm: EventTarget | null) {
    if (e.buttons !== 1 || selectedGoalItems.map((i) => i.id).includes(item.id)) return;
    selectGoalItem(item, targetElm);
  }

  async function updateItems(
    currentPage: number,
    skinOrder: 'ASC' | 'DESC',
    minSkinPrice: number,
    maxSkinPrice: number,
    search: string
  ) {
    await fetch(
      '/api/skins/get-items?' +
        new URLSearchParams({
          page: currentPage.toString(),
          order: skinOrder,
          minPrice: (minSkinPrice || 0).toString(),
          maxPrice: maxSkinPrice.toString(),
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

  $: browser ? updateItems(availableItemsPage, order, minPrice, 0, searchString) : null;
</script>

<div class="flex flex-col relative p-6 rounded-b-lg lg:rounded-t-lg bg-navy-800">
  <div class="text-navy-200 flex items-center ml-3 sm:ml-0">
    <p class="font-bold text-sm md:text-base lg:text-lg leading-tight text-white hidden md:block">
      Upgrade
    </p>
    <div
      class="flex flex-wrap justify-between -mt-3 -ml-3 sm:justify-end sm:ml-auto sm:w-auto"
      style="visibility: visible;"
    >
      <label
        class="justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent flex order-1 w-full mt-3 sm:ml-3 sm:order-none sm:w-[150px]"
      >
        <svg class="self-center flex-shrink-0 w-4 h-4 mr-2 -ml-1">
          <use xlink:href="/icons/icons.svg#find"></use>
        </svg>
        <input
          type="text"
          class="input flex-1 w-full text-xs text-white bg-transparent border-none focus:outline-none placeholder-navy-200 !pl-0"
          placeholder="{$_('upgrader.findSkin')}"
          bind:value="{searchString}"
        />
      </label>
      <label
        class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent order-3 pr-0 mt-3 sm:ml-3 whitespace-nowrap sm:order-none w-[23%] sm:w-auto"
        aria-label="Minimum price"
      >
        {$page.data.currency.toUpperCase()} &gt;
        <input
          type="number"
          placeholder="0"
          class="ml-1 text-white bg-transparent border-none outline-none placeholder-navy-300 w-[50px]"
          bind:value="{minPrice}"
        />
      </label>
      <button
        class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent order-5 mt-3 sm:ml-3 sm:order-none w-[23%] sm:w-auto"
        aria-label="Sort by highest price"
        on:click="{() => (order = order === 'ASC' ? 'DESC' : 'ASC')}"
      >
        {$_('upgrader.price')}
        <svg
          class="ml-2 transition-transform duration-300"
          style="transform: rotateX({order === 'ASC'
            ? '180deg'
            : '0deg'});; height: 10px; width: 8px;"
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
        <li
          on:keypress="{() => null}"
          on:focus="{() => null}"
          on:mousedown="{(e) => selectGoalItem(item, e.target)}"
          on:mouseover="{(e) => handleFastSelect(e, item, e.target)}"
        >
          <div
            class="relative flex flex-col items-center justify-between w-full bg-center bg-cover border border-solid rounded-lg select-none group border-navy-500 bg-navy-600 cursor-pointer"
            style="aspect-ratio: 10 / 13; background-image: url(/images/browseritembg.webp);"
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
                  {convertPrice($page.data.currency, item.skinPrice)}
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
                class="absolute {selectedGoalItems.map((i) => i.id).includes(item.id)
                  ? 'hidden'
                  : 'flex'} items-center justify-center transform scale-90 rounded-full opacity-0 font-body group-hover:opacity-100 transition ease-out group-hover:scale-100 bg-gold add-svg"
              >
                <svg class="w-5 h-5 text-white">
                  <use xlink:href="/icons/icons.svg#plus-circle"></use>
                </svg>
              </div>
              <div
                class="absolute {selectedGoalItems.map((i) => i.id).includes(item.id)
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
        availableItemsPage < Math.ceil(availableItemsCount / 15) - 1 ? availableItemsPage++ : null}"
      class="text-navy-300 flex items-center h-10 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent justify-center px-10 py-2 md:px-4 sm:justify-self-end"
    >
      <svg class="w-4 h-4 rotate-180">
        <use xlink:href="/icons/icons.svg#arrow-left"></use>
      </svg>
    </button>
  </div>
</div>
