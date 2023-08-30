<script context="module" lang="ts">
  export interface Filters {
    rounds: string | number;
    playerCount: string | number;
    sorting: string;
    searchString: string;
  }
</script>

<script lang="ts">
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition
  } from '@rgossiaux/svelte-headlessui';
  import { _ } from 'svelte-i18n';

  const roundOptions = [
    { id: 0, value: $_('battles.all') },
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 },
    { id: 11, value: '>10' }
  ] as any;

  const playerCountOptions = [
    { id: 0, value: $_('battles.all') },
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 }
  ] as any;

  const sortingOptions = [
    { id: 0, value: $_('battles.list.newest') },
    { id: 1, value: $_('battles.list.priceAsc') },
    { id: 2, value: $_('battles.list.priceDesc') }
  ] as any;

  let rounds = roundOptions[0];
  let playerCount = playerCountOptions[0];
  let sorting = sortingOptions[0];
  let searchString = '';

  export let filters: Filters = {
    rounds: rounds.value,
    playerCount: playerCount.value,
    sorting: sorting.value,
    searchString: searchString
  };

  function resetFilters() {
    rounds = roundOptions[0];
    playerCount = playerCountOptions[0];
    sorting = sortingOptions[0];
    searchString = '';
  }

  $: filters = {
    rounds: rounds.value,
    playerCount: playerCount.value,
    sorting: sorting.value,
    searchString
  };
</script>

<div class="flex w-full flex-wrap items-center bg-navy-750 xl:rounded-2xl">
  <div class="order-1 hidden w-full px-3 py-4 sm:p-3 lg:block lg:w-auto lg:flex-1 xl:pl-5">
    <div class="relative flex w-full">
      <input
        type="text"
        class="input -mr-9 h-9 w-full rounded-lg border-[0.5px] border-navy-500 bg-navy-600 pl-3 pr-9 text-[10px] font-semibold capitalize text-navy-100 placeholder-navy-300"
        placeholder="{$_('battles.list.search')}"
        bind:value="{searchString}"
      />
      <div class="flex h-9 w-9 items-center justify-center p-2">
        <svg class="icon block h-4 w-4 text-navy-200" viewBox="0 0 21.28 21.28" fill="none">
          <g
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="2"
            transform="translate(-565.25 -229.25)"
          >
            <circle cx="8.75" cy="8.75" r="8.75" transform="translate(566 230)"></circle>
            <circle
              cx="8.75"
              cy="8.75"
              r="8.75"
              transform="translate(566 230)"
              fill="currentColor"
              opacity="0"
            ></circle>
            <path d="M586 250l-5-5"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
  <div
    class="order-2 grid w-full grid-cols-1 items-center justify-between gap-2 self-stretch px-5 py-4 sm:gap-4 sm:p-3 md:grid-cols-3 lg:px-3 xl:flex xl:w-auto xl:gap-0 xl:space-x-4 xl:p-4"
  >
    <Listbox let:open bind:value="{rounds}" class="relative hidden md:block">
      <ListboxButton
        class="dropdown dropdown-compact h-9 w-full min-w-0 rounded-lg border-[0.5px] border-navy-500 bg-navy-600 capitalize text-navy-200 sm:min-w-[7rem] xl:mr-0"
      >
        <div class="overflow-hidden whitespace-nowrap px-3 text-base lg:text-2xs">
          {rounds.value === $_('battles.all') ? $_('battles.rounds') : rounds.value}
        </div>
        <div class="dropdown-arrow ml-auto">
          <svg
            class="icon block h-2.5 w-2.5 flex-shrink-0 transition-transform duration-200"
            viewBox="0 0 10 6"
            fill="none"
            style="transform: rotateX({open ? '180' : '0'}deg);"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
          </svg>
        </div>
      </ListboxButton>
      <Transition
        class="absolute z-50 w-full"
        show="{open}"
        enter="transition-all duration-200"
        enterFrom="scale-90 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition-all duration-200"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-90 opacity-0"
      >
        <ListboxOptions class="w-full origin-top">
          <div
            class="max-h-64 overflow-y-auto overflow-x-hidden rounded-lg border border-navy-200 border-opacity-30 bg-navy-700 bg-opacity-90 text-navy-200 shadow-lg outline-none md:max-h-80"
          >
            {#each roundOptions as option}
              <ListboxOption
                class="flex w-full cursor-pointer items-center px-3 py-2 text-left text-base font-light outline-none transition-colors duration-200 hover:bg-navy-500 lg:text-2xs"
                value="{option}"
              >
                {option.value}
              </ListboxOption>
            {/each}
          </div>
        </ListboxOptions>
      </Transition>
    </Listbox>

    <Listbox let:open bind:value="{playerCount}" class="relative hidden md:block">
      <ListboxButton
        class="dropdown dropdown-compact h-9 w-full min-w-0 rounded-lg border-[0.5px] border-navy-500 bg-navy-600 capitalize text-navy-200 sm:min-w-[7rem] xl:mr-0"
      >
        <div class="overflow-hidden whitespace-nowrap px-3 text-base lg:text-2xs">
          {playerCount.value === 'Wszystkie' ? 'Graczy' : playerCount.value}
        </div>
        <div class="dropdown-arrow ml-auto">
          <svg
            class="icon block h-2.5 w-2.5 flex-shrink-0 transition-transform duration-200"
            viewBox="0 0 10 6"
            fill="none"
            style="transform: rotateX({open ? '180' : '0'}deg);"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
          </svg>
        </div>
      </ListboxButton>
      <Transition
        class="absolute z-50 w-full"
        show="{open}"
        enter="transition-all duration-200"
        enterFrom="scale-90 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition-all duration-200"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-90 opacity-0"
      >
        <ListboxOptions class="w-full origin-top">
          <div
            class="max-h-64 overflow-y-auto overflow-x-hidden rounded-lg border border-navy-200 border-opacity-30 bg-navy-700 bg-opacity-90 text-navy-200 shadow-lg outline-none md:max-h-80"
          >
            {#each playerCountOptions as option}
              <ListboxOption
                class="flex w-full cursor-pointer items-center px-3 py-2 text-left text-base font-light outline-none transition-colors duration-200 hover:bg-navy-500 lg:text-2xs"
                value="{option}"
              >
                {option.value}
              </ListboxOption>
            {/each}
          </div>
        </ListboxOptions>
      </Transition>
    </Listbox>

    <Listbox let:open bind:value="{sorting}" class="relative">
      <ListboxButton
        class="dropdown dropdown-compact h-9 w-full min-w-0 rounded-lg border-[0.5px] border-navy-500 bg-navy-600 capitalize text-navy-200 sm:min-w-[7rem] xl:mr-0 xl:w-36"
      >
        <div class="overflow-hidden whitespace-nowrap px-3 text-base lg:text-2xs">
          {sorting.value === $_('battles.list.newest') ? $_('battles.list.sorting') : sorting.value}
        </div>
        <div class="dropdown-arrow ml-auto">
          <svg
            class="icon block h-2.5 w-2.5 flex-shrink-0 transition-transform duration-200"
            viewBox="0 0 10 6"
            fill="none"
            style="transform: rotateX({open ? '180' : '0'}deg);"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
          </svg>
        </div>
      </ListboxButton>
      <Transition
        class="absolute z-50 w-full"
        show="{open}"
        enter="transition-all duration-200"
        enterFrom="scale-90 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition-all duration-200"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-90 opacity-0"
      >
        <ListboxOptions class="w-full origin-top">
          <div
            class="max-h-64 overflow-y-auto overflow-x-hidden rounded-lg border border-navy-200 border-opacity-30 bg-navy-700 bg-opacity-90 text-navy-200 shadow-lg outline-none md:max-h-80"
          >
            {#each sortingOptions as option}
              <ListboxOption
                class="flex w-full cursor-pointer items-center px-3 py-2 text-left text-base font-light outline-none transition-colors duration-200 hover:bg-navy-500 lg:text-2xs"
                value="{option}"
              >
                {option.value}
              </ListboxOption>
            {/each}
          </div>
        </ListboxOptions>
      </Transition>
    </Listbox>
  </div>
  <div class="order-3 hidden flex-1 px-3 py-4 sm:p-3 md:w-1/2 lg:block">
    <div
      class="mb-1 self-start whitespace-nowrap text-[8px] font-medium uppercase tracking-wide text-navy-200 transition-opacity duration-200"
    >
      {$_('battles.list.priceRange')}
    </div>
    <div class="flex h-9 items-center">
      <div class="w-full px-1.5 transition-opacity duration-200">
        <div style="position: relative; width: 100%;">
          <div
            style="position: absolute; height: 100%; width: 42px; transform: translate(-50%, 0%); border-radius: 7px; cursor: pointer;"
          ></div>
          <div
            style="position: absolute; height: 2px; width: 100%; border-radius: 7px; pointer-events: none; background-color: rgb(106, 109, 129);"
          ></div>
          <div class="slider-handles">
            <button
              role="slider"
              aria-valuemin="{0}"
              aria-valuemax="{2000}"
              aria-valuenow="{0}"
              class="absolute mt-px h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-150 hover:scale-125 focus:outline-none"
              style="left: 0%; z-index: 2;"
            >
              <span
                class="absolute -top-3.5 left-0 flex w-3 justify-start text-[8px] font-semibold text-white"
              >
                0,00&nbsp;PLN
              </span>
              <div class="m-0 block h-full w-full rounded-full bg-gold-500"></div>
            </button>
            <button
              role="slider"
              aria-valuemin="{0}"
              aria-valuemax="{2000}"
              aria-valuenow="{1999.999999999999}"
              class="absolute mt-px h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-150 hover:scale-125 focus:outline-none"
              style="left: 100%; z-index: 2;"
            >
              <span
                class="absolute -bottom-3.5 left-0 flex w-3 justify-end text-[8px] font-semibold text-white"
              >
                &gt;2000,00&nbsp;PLN
              </span>
              <div class="m-0 block h-full w-full rounded-full bg-gold-500"></div>
            </button>
          </div>
          <div class="slider-tracks">
            <div
              class="h-0.5 bg-gold-500"
              style="position: absolute; z-index: 1; border-radius: 7px; cursor: pointer; left: 0%; width: 100%;"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="hidden px-3 xl:order-6 xl:block"><div class="h-7 w-px bg-navy-400"></div></div>
  <div
    class="order-6 mx-auto mb-2 py-4 pl-3 pr-3 lg:mb-0 lg:ml-0 lg:mr-0 lg:mt-5 xl:order-8 xl:mt-0 xl:pr-6"
  >
    <button
      class="flex items-center text-[10px] font-semibold uppercase text-navy-200 outline-none duration-300 focus:outline-none"
      on:click="{resetFilters}"
    >
      <svg class="icon mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="m2.586 15.408 4.299 4.299a.996.996 0 0 0 .707.293h12.001v-2h-6.958l7.222-7.222c.78-.779.78-2.049 0-2.828L14.906 3a2.003 2.003 0 0 0-2.828 0l-4.75 4.749-4.754 4.843a2.007 2.007 0 0 0 .012 2.816zM13.492 4.414l4.95 4.95-2.586 2.586L10.906 7l2.586-2.586zM8.749 9.156l.743-.742 4.95 4.95-4.557 4.557a1.026 1.026 0 0 0-.069.079h-1.81l-4.005-4.007 4.748-4.837z"
        ></path>
      </svg>
      {$_('battles.list.reset')}
    </button>
  </div>
</div>
