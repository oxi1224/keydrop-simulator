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

  function handleFastSelect(
    e: MouseEvent,
    item: GlobalInventoryItem,
    targetElm: EventTarget | null
  ) {
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

<div class="relative flex flex-col rounded-b-lg bg-navy-800 p-6 lg:rounded-t-lg">
  <div class="ml-3 flex items-center text-navy-200 sm:ml-0">
    <p class="hidden text-sm font-bold leading-tight text-white md:block md:text-base lg:text-lg">
      Upgrade
    </p>
    <div
      class="-ml-3 -mt-3 flex flex-wrap justify-between sm:ml-auto sm:w-auto sm:justify-end"
      style="visibility: visible;"
    >
      <label
        class="order-1 mt-3 flex h-10 w-full items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-4 text-center text-xs transition-all duration-300 hover:border-navy-300 hover:text-white sm:order-none sm:ml-3 sm:w-[150px]"
      >
        <svg class="-ml-1 mr-2 h-4 w-4 flex-shrink-0 self-center">
          <use xlink:href="/icons/icons.svg#find"></use>
        </svg>
        <input
          type="text"
          class="input w-full flex-1 border-none bg-transparent !pl-0 text-xs text-white placeholder-navy-200 focus:outline-none"
          placeholder="{$_('upgrader.findSkin')}"
          bind:value="{searchString}"
        />
      </label>
      <label
        class="order-3 mt-3 flex h-10 w-[23%] items-center justify-center whitespace-nowrap rounded-lg border border-solid border-navy-500 bg-transparent px-4 pr-0 text-center text-xs transition-all duration-300 hover:border-navy-300 hover:text-white sm:order-none sm:ml-3 sm:w-auto"
        aria-label="Minimum price"
      >
        {$page.data.currency.toUpperCase()} &gt;
        <input
          type="number"
          placeholder="0"
          class="ml-1 w-[50px] border-none bg-transparent text-white placeholder-navy-300 outline-none"
          bind:value="{minPrice}"
        />
      </label>
      <button
        class="order-5 mt-3 flex h-10 w-[23%] items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-4 text-center text-xs transition-all duration-300 hover:border-navy-300 hover:text-white sm:order-none sm:ml-3 sm:w-auto"
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
    class="mt-6 grid gap-3 transition-opacity duration-300"
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
            class="group relative flex w-full cursor-pointer select-none flex-col items-center justify-between rounded-lg border border-solid border-navy-500 bg-navy-600 bg-cover bg-center"
            style="aspect-ratio: 10 / 13; background-image: url(/images/browseritembg.webp);"
          >
            <div
              class="absolute h-5 w-full border-t border-solid border-{item.skinRarity} pointer-events-none -top-px rounded-lg"
              style=""
            ></div>
            <div class="flex w-full items-center">
              <div
                class="my-1.5 ml-2 mr-1 py-1.5 text-2xs font-bold uppercase leading-none text-white"
              >
                {item.skinQuality}
              </div>
              <div
                class="m-1.5 ml-auto min-w-0 whitespace-nowrap rounded-md bg-navy-900 p-1.5 font-bold leading-none text-gold"
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
                class="pointer-events-none absolute left-0 top-0 h-full w-full transform object-contain transition ease-out group-hover:scale-75 group-hover:opacity-25"
              />
              <div
                class="absolute {selectedGoalItems.map((i) => i.id).includes(item.id)
                  ? 'hidden'
                  : 'flex'} font-body add-svg scale-90 transform items-center justify-center rounded-full bg-gold opacity-0 transition ease-out group-hover:scale-100 group-hover:opacity-100"
              >
                <svg class="h-5 w-5 text-white">
                  <use xlink:href="/icons/icons.svg#plus-circle"></use>
                </svg>
              </div>
              <div
                class="absolute {selectedGoalItems.map((i) => i.id).includes(item.id)
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
              {item.weaponName}
            </p>
            <p
              class="mb-2 w-full flex-shrink-0 truncate px-0.5 text-center text-2xs uppercase leading-tight text-navy-300"
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
  <div class="mt-auto grid grid-cols-3 gap-3 pt-6 transition-opacity duration-300">
    <button
      on:click="{() => (availableItemsPage > 0 ? availableItemsPage-- : null)}"
      class="flex h-10 items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-10 py-2 text-center text-xs text-navy-300 transition-all duration-300 hover:border-navy-300 hover:text-white sm:justify-self-start md:px-4"
    >
      <svg class="h-4 w-4">
        <use xlink:href="/icons/icons.svg#arrow-left"></use>
      </svg>
    </button>
    <div
      class="flex items-center justify-center rounded bg-navy-900 p-3 text-center text-sm font-bold leading-none text-white sm:justify-self-center"
    >
      {availableItemsPage + 1}/{Math.ceil(availableItemsCount / 15)}
    </div>
    <button
      on:click="{() =>
        availableItemsPage < Math.ceil(availableItemsCount / 15) - 1 ? availableItemsPage++ : null}"
      class="flex h-10 items-center justify-center rounded-lg border border-solid border-navy-500 bg-transparent px-10 py-2 text-center text-xs text-navy-300 transition-all duration-300 hover:border-navy-300 hover:text-white sm:justify-self-end md:px-4"
    >
      <svg class="h-4 w-4 rotate-180">
        <use xlink:href="/icons/icons.svg#arrow-left"></use>
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
