<script lang="ts">
  import { page } from '$app/stores';
  import { convertPrice } from '$lib';
  import type { Case } from '@prisma/client';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition
  } from '@rgossiaux/svelte-headlessui';
  import { _ } from 'svelte-i18n';

  export let cases: Case[];
  export let selectedCases: (Case & { count: number })[] = [];
  let filteredCases = cases;
  let modalElement: Element;
  let totalPrice = 0;
  let caseSearchString = '';

  const sortingOptions: any[] = [
    { id: 0, value: $_('battles.list.default'), unavailable: false },
    { id: 1, value: $_('battles.list.priceAsc'), unavailable: false },
    { id: 2, value: $_('battles.list.priceDesc'), unavailable: false },
    { id: 3, value: $_('battles.list.name'), unavailable: false }
  ];

  let sorting = sortingOptions[0];

  function selectCase(caseData: Case) {
    if (selectedCases.map((c) => c.urlName).includes(caseData.urlName) || totalCaseCount >= 20)
      return;
    selectedCases.push({ ...caseData, count: 1 });
    selectedCases = selectedCases;
  }

  function updateCount(caseData: Case, n: number) {
    const index = selectedCases.findIndex((c) => c.urlName === caseData.urlName);
    const selectedCase = selectedCases[index];
    if (totalCaseCount + n > 20 || selectedCase.count <= 0) return;
    if (selectedCase.count + n == 0) {
      selectedCases.splice(index, 1);
      selectedCases = selectedCases;
    } else {
      selectedCases[index].count += n;
    }
  }

  export function toggleModal() {
    modalElement.classList.toggle('is-open');
  }

  $: totalCaseCount = selectedCases.reduce((t, c) => (t += c.count), 0);
  $: totalPrice = selectedCases.reduce((t, c) => (t += c.price * c.count), 0);

  $: {
    let sortedCases = cases;
    if (sorting.value === $_('battles.list.priceAsc'))
      sortedCases = [...cases].sort((a, b) => a.price - b.price);
    else if (sorting.value === $_('battles.list.priceDesc'))
      sortedCases = [...cases].sort((a, b) => b.price - a.price);
    else if (sorting.value === $_('battles.list.name'))
      sortedCases = [...cases].sort((a, b) => a.websiteName.localeCompare(b.websiteName));
    filteredCases = sortedCases.filter((c) =>
      c.websiteName.toLowerCase().includes(caseSearchString.toLowerCase())
    );
  }
</script>

<div
  class="fixed left-0 top-0 z-50 hidden h-screen w-screen items-center overflow-hidden is-open:flex"
  style="background: rgba(0, 0, 0, 0.85); opacity: 1;"
  bind:this="{modalElement}"
>
  <div
    aria-modal="true"
    role="dialog"
    tabindex="-1"
    aria-label="Modal"
    class="case-dialog"
    style="opacity: 1; transform: none;"
    data-reach-dialog-content=""
  >
    <div class="relative rounded-xl bg-navy-700">
      <button
        class="absolute right-0 top-0 z-10 p-5 text-navy-200 transition-colors duration-200 hover:text-white"
        on:click="{toggleModal}"
      >
        <svg class="icon h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          ></path>
        </svg>
      </button>
      <div
        class="css-12z2xf8 flex max-h-screen w-screen flex-col items-center justify-center rounded-md p-5 sm:w-screen sm:p-10"
      >
        <div class="mt-2 grid w-full grid-cols-2 gap-x-2 sm:grid-cols-3 sm:gap-0">
          <div class="relative row-start-2 mb-2 flex w-full sm:row-start-auto sm:mb-0 sm:w-44">
            <input
              type="text"
              class="input -mr-9 h-9 w-full rounded-lg border-[0.5px] border-navy-500 bg-navy-600 pl-3 pr-9 text-[10px] uppercase text-navy-100 placeholder-navy-300"
              placeholder="{$_('battles.list.search')}"
              bind:value="{caseSearchString}"
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
          <h3
            class="col-span-3 mb-4 text-center text-lg font-semibold uppercase leading-9 text-white sm:col-span-1 sm:col-start-2 md:text-xl"
          >
            {$_('battles.create.caseAddition')}
          </h3>
          <div class="relative z-[100] ml-auto mr-0 h-9 rounded-lg sm:col-start-3">
            <Listbox let:open bind:value="{sorting}">
              <ListboxButton
                class="dropdown dropdown-compact h-9 w-full rounded-lg border-[0.5px] border-navy-500 bg-navy-600 uppercase text-navy-100 xl:mr-0 xl:w-36"
              >
                <div class="overflow-hidden whitespace-nowrap px-3 text-base lg:text-2xs">
                  {sorting.value}
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
                show="{open}"
                enter="transition-all duration-200"
                enterFrom="scale-90 opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all duration-200"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-90 opacity-0"
              >
                <ListboxOptions class="relative w-full origin-top">
                  <div
                    class="max-h-64 overflow-y-auto overflow-x-hidden rounded-lg border border-navy-200 border-opacity-30 bg-navy-700 bg-opacity-90 text-navy-200 shadow-lg outline-none md:max-h-80"
                  >
                    {#each sortingOptions as option}
                      <ListboxOption
                        class="flex w-full cursor-pointer items-center px-3 py-2 text-left text-base font-light outline-none transition-colors duration-200 hover:bg-navy-700 lg:text-2xs"
                        value="{option}"
                        disabled="{option.unavailable}"
                      >
                        {option.value}
                      </ListboxOption>
                    {/each}
                  </div>
                </ListboxOptions>
              </Transition>
            </Listbox>
          </div>
        </div>
        <div
          class="sm:grid-cols-wrap-giveaways css-144y8of mb-4 grid w-full grid-cols-2 justify-items-center gap-2 overflow-x-hidden overflow-y-scroll pb-5 md:mb-8 md:grid-cols-4 md:gap-4"
        >
          {#each filteredCases as caseData}
            <div
              class="relative grid aspect-[1/1.1] w-full cursor-pointer grid-cols-1 grid-rows-1 rounded-lg border border-transparent transition-all duration-200 hover:border-gold-500 {selectedCases
                .map((c) => c.urlName)
                .includes(caseData.urlName)
                ? 'border border-gold'
                : ''}"
              style="background-size: cover; background-position: center center; box-shadow: rgba(8, 7, 10, 0.81) 0px 4px 19px; background-image: {selectedCases
                .map((c) => c.urlName)
                .includes(caseData.urlName)
                ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),'
                : ''} url('{caseData.imgName}');"
              on:click="{() => selectCase(caseData)}"
              on:keypress="{(e) => (e.key === 'Enter' ? selectCase(caseData) : null)}"
              role="button"
              tabindex="0"
            >
              <div class="relative z-20 col-start-1 row-start-1 row-end-3 h-full w-full">
                <div
                  class="absolute left-1/2 top-1/2 z-20 mt-2 flex h-11 w-28 -translate-x-1/2 -translate-y-1/2 transform items-center justify-between rounded-md border border-navy-500 bg-navy-700 {selectedCases
                    .map((c) => c.urlName)
                    .includes(caseData.urlName)
                    ? ''
                    : 'hidden'}"
                >
                  <button
                    class="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-navy-400 bg-navy-500 text-xs font-bold text-white transition-colors duration-200 hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none"
                    on:click="{(e) => {
                      e.stopPropagation();
                      updateCount(caseData, -1);
                    }}"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    class="input mx-1.5 w-full rounded-md border-0 bg-transparent p-0 text-center text-xl font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    value="{selectedCases[
                      selectedCases.findIndex((c) => c.urlName === caseData.urlName)
                    ]?.count || 0}"
                    max="20"
                    min="0"
                  />
                  <button
                    class="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-navy-400 bg-navy-500 text-xs font-bold text-white transition-colors duration-200 hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:cursor-default disabled:opacity-25"
                    on:click="{(e) => {
                      e.stopPropagation();
                      updateCount(caseData, 1);
                    }}"
                    disabled="{totalCaseCount >= 20}"
                  >
                    +
                  </button>
                </div>
                <div class="z-10 flex h-full w-full flex-col">
                  <span
                    class="absolute right-3 top-3 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-gold-500"
                  >
                    {convertPrice($page.data.currency, caseData.price)}
                  </span>
                  <div
                    class="z-10 mb-4 mt-auto text-center text-xl font-light uppercase text-white"
                  >
                    {caseData.websiteName}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
        <button class="button button-primary w-48 flex-shrink-0" on:click="{toggleModal}">
          <span>
            <p>
              {$_('battles.confirm')}
              <span class="font-semibold text-gold">
                {convertPrice($page.data.currency, totalPrice)}
              </span>
            </p>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .case-dialog {
    padding: 0px !important;
    background: transparent !important;
    width: max-content !important;
    max-width: calc(-30px + 100vw) !important;
    margin: auto !important;
  }
  @media (min-width: 1280px) {
    .css-12z2xf8 {
      max-width: 1024px;
    }
  }
  @media (max-width: 768px) {
    .case-dialog {
      max-width: 100vw !important;
    }
  }
</style>
