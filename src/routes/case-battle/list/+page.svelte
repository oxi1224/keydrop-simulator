<script lang="ts">
  import BattleContainer from '$components/case-battle/BattleContainer.svelte';
  import MobileBattleContainer from '$components/case-battle/MobileBattleContainer.svelte';
  import type { CaseBattle } from '$lib';
  import { io } from 'socket.io-client';
  import ListFilters from '$components/case-battle/ListFilters.svelte';
  import type { Filters } from '$components/case-battle/ListFilters.svelte';
  import CaseBattleHeader from '$components/case-battle/CaseBattleHeader.svelte';
  import { _ } from 'svelte-i18n';

  const socket = io();
  let activeBattles: CaseBattle[] = [];
  let filteredBattles: CaseBattle[];
  socket.on('caseBattleListUpdate', (data) => {
    activeBattles = data;
  });

  let filters: Filters = {
    rounds: $_('battles.all'),
    playerCount: $_('battles.all'),
    sorting: $_('battles.list.newest'),
    searchString: ''
  };
  $: {
    filteredBattles = activeBattles.filter((cbData) => {
      let passes = true;
      if (filters.rounds === '>10' && cbData.totalCases < 10) passes = false;
      else if (typeof filters.rounds === 'number' && cbData.totalCases !== filters.rounds)
        passes = false;
      if (typeof filters.playerCount === 'number' && cbData.playerCount !== filters.playerCount)
        passes = false;
      if (!cbData.caseData.find((c) => c.websiteName.includes(filters.searchString)))
        passes = false;
      return passes;
    });

    if (filters.sorting !== $_('battles.list.newest')) {
      filteredBattles = filteredBattles.sort((a, b) => {
        if (filters.sorting === $_('battles.list.priceAsc')) return a.totalPrice - b.totalPrice;
        return b.totalPrice - a.totalPrice;
      });
    }
  }
</script>

<div class="min-h-screen pb-16 pt-4">
  <CaseBattleHeader title="{$_('battles.header.activeBattles')}" activeTab="{0}">
    <button
      class="button button-primary h-12 w-full border-gold bg-navy-600 hover:bg-navy-500 lg:w-64"
    >
      <svg class="icon mr-2 h-4 w-4 flex-shrink-0" viewBox="0 0 19 21" fill="none">
        <path
          d="M10.5 3.055C15 3.552 18.5 7.367 18.5 12V21H0.5V12C0.5 7.367 4 3.552 8.5 3.055V0H10.5V3.055ZM9.5 17C10.8261 17 12.0979 16.4732 13.0355 15.5355C13.9732 14.5979 14.5 13.3261 14.5 12C14.5 10.6739 13.9732 9.40215 13.0355 8.46447C12.0979 7.52678 10.8261 7 9.5 7C8.17392 7 6.90215 7.52678 5.96447 8.46447C5.02678 9.40215 4.5 10.6739 4.5 12C4.5 13.3261 5.02678 14.5979 5.96447 15.5355C6.90215 16.4732 8.17392 17 9.5 17ZM9.5 15C8.70435 15 7.94129 14.6839 7.37868 14.1213C6.81607 13.5587 6.5 12.7956 6.5 12C6.5 11.2044 6.81607 10.4413 7.37868 9.87868C7.94129 9.31607 8.70435 9 9.5 9C10.2956 9 11.0587 9.31607 11.6213 9.87868C12.1839 10.4413 12.5 11.2044 12.5 12C12.5 12.7956 12.1839 13.5587 11.6213 14.1213C11.0587 14.6839 10.2956 15 9.5 15ZM9.5 13C9.76522 13 10.0196 12.8946 10.2071 12.7071C10.3946 12.5196 10.5 12.2652 10.5 12C10.5 11.7348 10.3946 11.4804 10.2071 11.2929C10.0196 11.1054 9.76522 11 9.5 11C9.23478 11 8.98043 11.1054 8.79289 11.2929C8.60536 11.4804 8.5 11.7348 8.5 12C8.5 12.2652 8.60536 12.5196 8.79289 12.7071C8.98043 12.8946 9.23478 13 9.5 13Z"
          fill="currentColor"
        ></path>
      </svg>
      <span>{$_('battles.header.seeBots')}</span>
    </button>
  </CaseBattleHeader>
  <div class="mx-auto mb-5 max-w-screen-2xl opacity-100 transition duration-500 xl:px-5">
    <ListFilters bind:filters />
  </div>
  <div class="fixed bottom-5 right-0 z-20">
    <div
      data-testid="case_battle_list_pause_button"
      class="flex h-20 w-[10rem] translate-x-[5.5rem] items-stretch rounded-lg bg-navy-900 pr-4 transition-transform duration-300 ease-out"
    >
      <div
        class="group flex cursor-pointer items-center justify-center rounded-l-lg px-2 transition-colors duration-150 hover:bg-navy-800"
      >
        <svg
          class="icon h-3 w-3 text-navy-300 transition duration-300 group-hover:text-white"
          viewBox="0 0 10 6"
          fill="none"
          style="transform: rotateZ(90deg) rotateX(0deg);"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
        </svg>
      </div>
      <button class="ml-1 flex items-center space-x-4">
        <div class="grid-stack rounded-full">
          <div style="opacity: 1; transform: none;">
            <svg class="icon h-6 w-6 text-red" viewBox="0 0 31 31" fill="currentColor">
              <path
                d="M15.5003 30.9167C6.98572 30.9167 0.0836792 24.0146 0.0836792 15.5C0.0836792 6.98539 6.98572 0.0833435 15.5003 0.0833435C24.015 0.0833435 30.917 6.98539 30.917 15.5C30.917 24.0146 24.015 30.9167 15.5003 30.9167ZM10.8753 10.875V20.125H13.9587V10.875H10.8753ZM17.042 10.875V20.125H20.1253V10.875H17.042Z"
              ></path>
            </svg>
          </div>
        </div>
      </button>
    </div>
  </div>
  <div
    class="pointer-events-none fixed left-4 top-0 z-50 opacity-0 transition-opacity duration-100"
  >
    <div class="h-4 w-4 transform transition duration-200">
      <svg class="h-full w-full animate-spin text-gold" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </div>
  <div
    class="css-d45wua container order-5 mx-auto min-h-screen max-w-screen-2xl px-5 opacity-100 transition-opacity duration-500 md:order-none"
  >
    <div class="-mx-5 mb-8 mt-5 flex justify-between border-b border-navy-500 md:mx-0">
      <div class="-mb-px hidden w-60 items-center border-b border-navy-200 md:flex">
        <h3 class="mb-4 text-base font-normal text-navy-100">{$_('battles.battles')}</h3>
      </div>
      <ul
        class="flex w-full items-center justify-center text-2xs sm:text-xs md:w-auto md:justify-normal"
      >
        <li>
          <button
            class="flex items-center gap-2 whitespace-nowrap px-3 py-3 uppercase text-gold transition-colors duration-200 hover:text-gold md:px-4"
          >
            {$_('battles.all')}
          </button>
        </li>
        <li>
          <button
            class="flex items-center gap-2 whitespace-nowrap px-3 py-3 uppercase text-green-400 transition-colors duration-200 hover:text-gold md:px-4"
          >
            <svg class="icon h-5 w-5" viewBox="0 0 44 43" fill="currentColor">
              <path
                d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
              ></path>
            </svg>
            {$_('battles.list.classicMode')}
          </button>
        </li>
        <li>
          <button
            class="flex flex-nowrap items-center gap-2 whitespace-nowrap px-3 py-3 uppercase text-pink-400 transition-colors duration-200 hover:text-gold md:px-4"
          >
            <svg class="icon h-5 w-5" viewBox="0 0 22 22" fill="currentColor">
              <path
                d="M18.4023 17.0273C18.3967 19.3405 16.4551 21.3091 14.2491 21.3208C13.687 21.3239 13.2115 21.0763 12.7663 20.7526C11.0271 19.488 10.8727 19.4847 9.13894 20.7536C8.51354 21.2113 7.85265 21.3926 7.07077 21.2624C5.10343 20.9351 3.53967 19.1705 3.50342 17.1702C3.49015 16.4358 3.74541 15.7971 4.23323 15.2491C4.63681 14.7955 5.10114 14.4072 5.58155 14.0427C6.39891 13.4226 7.05929 12.6681 7.62062 11.8157C8.03313 11.1893 8.42675 10.5473 8.9743 10.0215C10.1427 8.89931 11.7613 8.89905 12.9291 10.021C13.3327 10.4084 13.6661 10.8536 13.9538 11.3279C14.7009 12.5588 15.6656 13.5791 16.8105 14.4501C17.5441 15.0081 18.1978 15.6542 18.3533 16.6344C18.3788 16.7955 18.3939 16.9578 18.4023 17.0273Z"
              ></path>
              <path
                d="M0.549316 9.2194C0.561824 8.43267 0.703753 7.76999 1.08308 7.17497C1.86649 5.94586 3.2748 5.71433 4.41354 6.62206C5.79224 7.72124 6.24023 9.96988 5.38738 11.5096C4.61061 12.9121 3.02259 13.1763 1.83943 12.0952C0.96923 11.3003 0.606496 10.2816 0.549316 9.2194Z"
              ></path>
              <path
                d="M5.35303 3.9206C5.36349 3.35952 5.5478 2.59296 6.0231 1.91599C7.11871 0.3558 9.0281 0.412214 9.98254 2.0717C10.828 3.54204 10.7884 5.04224 9.83755 6.45871C8.91859 7.8272 7.25068 7.88489 6.18647 6.62693C5.66956 6.01634 5.35405 5.08819 5.35303 3.9206Z"
              ></path>
              <path
                d="M16.5572 4.27184C16.5146 5.18365 16.2552 6.09189 15.539 6.8171C14.5942 7.77358 13.2663 7.75852 12.328 6.79106C11.0018 5.42385 11.0299 2.82269 12.3854 1.48764C13.4059 0.482404 14.8153 0.571492 15.7164 1.6939C16.3035 2.42498 16.5411 3.27017 16.5572 4.27184Z"
              ></path>
              <path
                d="M21.3384 8.9349C21.2814 10.2518 20.8161 11.3806 19.7473 12.199C18.2708 13.3298 16.4431 12.6651 16.0444 10.8499C15.7204 9.37549 16.1608 8.09533 17.1926 7.04235C17.8879 6.33297 18.7551 5.94267 19.7687 6.30642C20.8214 6.68422 21.1969 7.56871 21.3361 8.5931C21.3514 8.70516 21.3384 8.82105 21.3384 8.9349Z"
              ></path>
            </svg>
            <span class="relative">
              <span
                class="absolute bottom-[calc(100%_+_0.2rem)] left-0 inline-flex min-h-0 flex-shrink-0 items-center justify-center self-start rounded-[0.4em] bg-gold p-1 text-center align-super text-2xs font-bold leading-none text-navy-700 transition-colors duration-100"
              >
                NEW
              </span>
              {$_('battles.list.underdogMode')}
            </span>
            <div class="group relative h-min w-min normal-case">
              <button class="-m-2 h-min w-min cursor-pointer p-2" type="button">
                <svg
                  class="icon mt-px h-4 w-4 text-white text-opacity-50 duration-200 group-hover:text-opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-1-7v2h2v-2h-2Zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.501 3.501 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2v-.645Z"
                  ></path>
                </svg>
              </button>
            </div>
          </button>
        </li>
      </ul>
    </div>
    <table
      class="w-min-[1000px] relative hidden w-full border-separate border-spacing-y-[5px] xl:table"
    >
      <thead>
        <tr class="h-10">
          <th class="w-24 text-xs font-semibold uppercase text-navy-100">{$_('battles.rounds')}</th>
          <th class="text-xs font-semibold uppercase text-navy-100">{$_('battles.cases')}</th>
          <th class="w-28 text-xs font-semibold uppercase text-navy-100">{$_('battles.worth')}</th>
          <th class="w-48 text-xs font-semibold uppercase text-navy-100">
            {$_('battles.players')}
          </th>
          <th class="w-80 text-xs font-semibold uppercase text-navy-100">{$_('battles.status')}</th>
        </tr>
      </thead>
      <tbody class="relative">
        {#each filteredBattles as battleData}
          <BattleContainer data="{battleData}" />
        {/each}
      </tbody>
    </table>
    <div class="block opacity-100 transition-opacity duration-500 xl:hidden">
      {#each filteredBattles as battleData}
        <MobileBattleContainer data="{battleData}" />
      {/each}
    </div>
  </div>
</div>
