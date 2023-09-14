<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import CaseAddModal from '$components/case-battle/CaseAddModal.svelte';
  import { convertPrice, createToast } from '$lib';
  import type { Case } from '@prisma/client';
  import { RadioGroup, RadioGroupOption } from '@rgossiaux/svelte-headlessui';
  import { _ } from 'svelte-i18n';

  const cases: Case[] = $page.data.cases;

  let selectedCases: (Case & { count: number })[] = [];
  let playerCount = 2;
  let publicMode: 'public' | 'private' = 'public';
  let mode: 'classic' | 'underdog' = 'classic';
  let loading = false;

  let modal: CaseAddModal;

  async function createBattle() {
    loading = true;
    const res = await fetch('/api/case-battle/create', {
      method: 'POST',
      body: JSON.stringify({
        cases: selectedCases.map((c) => ({ caseName: c.urlName, count: c.count })),
        playerCount: playerCount,
        publicMode: publicMode,
        mode: mode
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const resBody = await res.json();
    if (!res.ok) {
      createToast({
        type: 'error',
        header: $_('error'),
        message: $_(resBody.messageKey)
      });
      loading = false;
      return;
    }
    loading = false;
    goto(resBody.redirectTo);
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

  $: totalCaseCount = selectedCases.reduce((t, c) => (t += c.count), 0);
  $: totalPrice = selectedCases.reduce((t, c) => (t += c.price * c.count), 0);
</script>

<div class="min-h-screen pb-16 pt-4">
  <div class="mx-auto max-w-screen-2xl overflow-hidden lg:px-5">
    <div
      class="order-2 my-5 flex w-full flex-col justify-between border-b border-gray-700 lg:order-none lg:mb-0 lg:mt-8 lg:flex-row"
    >
      <div
        class="-mb-px hidden items-center self-end border-b border-navy-100 pb-6 pr-10 font-semibold uppercase text-white lg:flex"
      >
        <a
          class="-my-2 -ml-3 px-3 py-2 text-navy-100 transition-colors duration-200 hover:text-white"
          href="/case-battle/"
        >
          <svg
            class="icon h-4 w-4"
            viewBox="0 0 10 6"
            fill="none"
            style="transform: rotate(90deg);"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
          </svg>
        </a>
        {$_('battles.header.createBattleShort')}
      </div>
      <div class="relative">
        <div
          class="hide-scrollbar flex items-start overflow-x-auto whitespace-nowrap px-5 pb-1 sm:-mr-4 sm:ml-auto sm:items-end lg:px-0 lg:pb-3"
        >
          <a
            class="-ml-4 flex flex-shrink-0 cursor-pointer items-center px-4 py-3 text-xs uppercase leading-none text-navy-100 transition-colors duration-200 hover:text-gold lg:ml-0"
            href="/case-battle/list/"
          >
            <div class="grid-stack mr-2 grid flex-shrink-0 place-items-center">
              <svg
                class="icon h-4 w-4 scale-95 transform opacity-100"
                viewBox="0 0 44 43"
                fill="currentColor"
              >
                <path
                  d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
                ></path>
              </svg>
            </div>
            {$_('battles.header.activeBattles')}
          </a>
          <a
            class="flex flex-shrink-0 cursor-pointer items-center px-4 py-3 text-xs uppercase leading-none text-navy-100 transition-colors duration-200 hover:text-gold"
            href="/case-battle/list/finished/"
          >
            <div class="grid-stack mr-2 grid flex-shrink-0 place-items-center">
              <svg class="icon w-6 opacity-100" viewBox="0 0 69.02 41.04" fill="currentColor">
                <path
                  d="M41.02,0V7.85S14.87,34,14.87,34l3.13,3.13-3.13,3.13-5.48-5.47-6.26,6.26-3.13-3.13,6.26-6.26L.78,26.17l3.13-3.13,3.13,3.13L33.21,0h7.81Z"
                ></path>
                <path
                  d="M69.02,0V7.85s-26.16,26.15-26.16,26.15l3.13,3.13-3.13,3.13-5.48-5.47-6.26,6.26-3.13-3.13,6.26-6.26-5.48-5.48,3.13-3.13,3.13,3.13L61.21,0h7.81Z"
                ></path>
              </svg>
            </div>
            {$_('battles.header.finishedBattles')}
          </a>
          <a
            class="flex flex-shrink-0 cursor-pointer items-center px-4 py-3 text-xs uppercase leading-none text-navy-100 transition-colors duration-200 hover:text-gold"
            href="/case-battle/list/my"
          >
            <div class="grid-stack mr-2 grid flex-shrink-0 place-items-center">
              <svg class="icon h-4 w-4 opacity-100" viewBox="0 0 13 14" fill="currentColor">
                <path
                  d="M12.9268 0.620117L12.9248 3.00118L4.98926 10.936L5.93873 11.8862L4.98926 12.8356L3.32735 11.1744L1.42774 13.0733L0.478268 12.1239L2.37788 10.2243L0.715972 8.56236L1.66544 7.61289L2.61558 8.56236L10.5558 0.622132L12.9268 0.620117Z"
                ></path>
              </svg>
            </div>
            {$_('battles.header.myBattles')}
          </a>
          <div
            class="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-transparent opacity-0 transition-opacity duration-200"
            style="--tw-gradient-to: #201e27;"
          ></div>
          <div
            class="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-r from-transparent opacity-100 transition-opacity duration-200"
            style="--tw-gradient-to: #201e27;"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-3 opacity-100 transition-opacity duration-500">
    <div
      class="pointer-events-none fixed left-4 top-0 z-50 opacity-0 transition-opacity duration-100"
      style="transform: translate(0px);"
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
    <div data-testid="case_battle_selected_cases" class="my-8 w-full">
      <div class="flex h-10 items-center">
        <div class="flex w-24 items-center text-xs font-bold uppercase text-navy-100">
          {$_('battles.create.roundSum')}
        </div>
        <div
          class="flex h-10 flex-1 items-center justify-center text-xs font-bold uppercase text-navy-100"
        >
          {$_('battles.cases')}
        </div>
      </div>
      <div class="relative flex">
        <div class="rounded-bl-full rounded-tl-full bg-navy-750">
          <div
            data-testid="case_battle_list_item_round"
            class="mr-1 flex h-[96px] w-[96px] items-center justify-center rounded-full border border-[#234861] bg-[#0B0F14] text-2xl transition"
            style="box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(26, 38, 48) 0px 0px 8px 6.4px inset;"
          >
            <div
              class="flex h-[56%] w-[56%] items-center justify-center rounded-full border-2 !border-[#46AEFD] text-center font-bold !text-[#46AEFD] transition"
              style="filter: drop-shadow(rgb(38, 98, 153) 0px 0px 6.4px); "
            >
              {totalCaseCount || 0}
            </div>
          </div>
        </div>
        <div
          class="css-16r72od relative min-w-0 flex-1 rounded-br-lg rounded-tr-lg bg-navy-750 p-2"
        >
          <div class="flex h-full w-full">
            <div class="group flex h-full w-7 items-center justify-center">
              <svg
                class="icon z-10 mr-2 h-2 rotate-90 transform self-center text-white transition-colors duration-100 group-hover:text-navy-100"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
              </svg>
            </div>

            <div
              class="no-scrollbar flex min-w-0 max-w-full flex-1 touch-pan-x snap-x overflow-x-scroll"
            >
              {#each selectedCases as caseData}
                {#each Array(caseData.count) as i}
                  <div class="snap-center" style="width: 85px; margin-right: 10px;">
                    <div
                      class="w- flex h-full items-end justify-center rounded-md bg-cover bg-center pb-1 text-xs uppercase"
                      style="width: 85px; background-image: url('{caseData.imgName}');"
                    >
                      <p
                        class="mx-1 line-clamp-2 overflow-hidden break-words text-center text-xs leading-tight text-white"
                      >
                        {caseData.websiteName}
                      </p>
                    </div>
                  </div>
                {/each}
              {/each}
            </div>

            <div class="group flex h-full w-7 items-center justify-center">
              <svg
                class="icon z-10 h-2 -rotate-90 transform self-center text-white transition-colors duration-100 group-hover:text-navy-200"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-8 grid grid-cols-2 flex-wrap gap-2 sm:flex sm:gap-5">
      {#each selectedCases as caseData}
        <div class="relative h-80 sm:w-56">
          <div
            class="absolute right-3 top-3 flex h-7 items-center justify-center rounded-sm bg-navy-700 px-2"
          >
            <span class="text-xs font-semibold text-gold">
              {convertPrice($page.data.currency, caseData.price)}
            </span>
          </div>
          <div
            class="flex h-64 w-full items-end justify-center rounded-lg bg-cover bg-center pb-1 text-xs uppercase"
            style="background-image: url('{caseData.imgName}');"
          >
            <p
              class="mx-1 mb-4 line-clamp-2 overflow-hidden break-all text-center text-base leading-tight text-white"
            >
              {caseData.websiteName}
            </p>
          </div>
          <div class="mt-2 flex items-center justify-between rounded-xl bg-navy-700 px-2.5 py-2">
            <button
              class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-navy-400 bg-navy-500 text-xs font-bold text-white transition-colors duration-200 hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              on:click="{() => updateCount(caseData, -1)}"
            >
              -
            </button>
            <div
              class="input mx-1.5 h-auto w-full rounded-md border-0 bg-transparent p-0 text-center text-xl font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {caseData.count}
            </div>
            <button
              class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-navy-400 bg-navy-500 text-xs font-bold text-white transition-colors duration-200 hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:cursor-default disabled:opacity-25"
              on:click="{() => updateCount(caseData, 1)}"
              disabled="{totalCaseCount >= 20}"
            >
              +
            </button>
          </div>
        </div>
      {/each}
      <div
        class="group flex h-80 cursor-pointer flex-col items-center justify-center rounded-lg border border-navy-500 bg-navy-700 sm:w-56"
        on:click="{modal.toggleModal}"
        on:keydown="{(e) => (e.key === 'Enter' ? modal.toggleModal() : null)}"
        role="button"
        tabindex="0"
      >
        <div
          class="rounded-full border border-gold-500 p-3 transition-colors duration-200 group-hover:bg-navy-500"
        >
          <svg
            class="icon h-9 w-9 rounded-full border-2 border-white p-1 text-white"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M17.833 6.166c-3.216-3.216-8.45-3.216-11.666 0-3.217 3.217-3.217 8.45 0 11.667 3.216 3.216 8.45 3.216 11.666 0 3.217-3.216 3.217-8.45 0-11.667zm-5.008 9.917h-1.65v-3.258H7.917v-1.65h3.258V7.916h1.65v3.259h3.258v1.65h-3.258v3.258z"
            ></path>
          </svg>
        </div>
        <p class="mt-5 text-center text-sm font-semibold uppercase text-white">
          {$_('battles.create.addCase')}
        </p>
      </div>
    </div>
    <div
      class="my-8 flex flex-col flex-wrap gap-8 border-y border-navy-500 py-5 sm:flex-row sm:items-center"
    >
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="icon h-5 w-5 text-gold" viewBox="0 0 25 25" fill="currentColor">
            <path
              d="M2.69922 22.7344C2.69922 20.6126 3.54207 18.5778 5.04236 17.0775C6.54266 15.5772 8.57749 14.7344 10.6992 14.7344C12.821 14.7344 14.8558 15.5772 16.3561 17.0775C17.8564 18.5778 18.6992 20.6126 18.6992 22.7344H2.69922ZM10.6992 13.7344C7.38422 13.7344 4.69922 11.0494 4.69922 7.73438C4.69922 4.41937 7.38422 1.73438 10.6992 1.73438C14.0142 1.73438 16.6992 4.41937 16.6992 7.73438C16.6992 11.0494 14.0142 13.7344 10.6992 13.7344ZM18.0622 15.9674C19.5919 16.3605 20.9585 17.2262 21.9675 18.4412C22.9766 19.6562 23.5766 21.1585 23.6822 22.7344H20.6992C20.6992 20.1244 19.6992 17.7484 18.0622 15.9674ZM16.0392 13.6914C16.8772 12.9418 17.5474 12.0237 18.0058 10.9971C18.4642 9.97053 18.7005 8.85866 18.6992 7.73438C18.7013 6.36784 18.3518 5.02375 17.6842 3.83137C18.8169 4.05896 19.8357 4.67175 20.5677 5.56557C21.2996 6.45939 21.6994 7.5791 21.6992 8.73438C21.6995 9.44684 21.5475 10.1511 21.2533 10.8C20.9592 11.449 20.5298 12.0275 19.9938 12.4969C19.4578 12.9663 18.8277 13.3157 18.1457 13.5217C17.4636 13.7277 16.7454 13.7856 16.0392 13.6914Z"
            ></path>
          </svg>
          <p class="text-xs font-bold uppercase text-navy-100">
            {$_('battles.create.playerCount.title')}
          </p>
        </div>
        <p class="mt-1 text-2xs font-medium text-navy-200">
          {$_('battles.create.playerCount.desc')}
        </p>
        <RadioGroup bind:value="{playerCount}" class="mt-4 grid grid-cols-2 gap-2.5 sm:flex">
          <RadioGroupOption value="{2}">
            <button
              class="button w-full px-4 text-[10px] {playerCount === 2
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              2 {$_('battles.players')}
            </button>
          </RadioGroupOption>
          <RadioGroupOption value="{3}">
            <button
              class="button w-full px-4 text-[10px] {playerCount === 3
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              3 {$_('battles.players')}
            </button>
          </RadioGroupOption>
          <RadioGroupOption value="{4}">
            <button
              class="button w-full px-4 text-[10px] {playerCount === 4
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              4 {$_('battles.players')}
            </button>
          </RadioGroupOption>
        </RadioGroup>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="icon h-5 w-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 10H20C20.2652 10 20.5196 10.1054 20.7071 10.2929C20.8946 10.4804 21 10.7348 21 11V21C21 21.2652 20.8946 21.5196 20.7071 21.7071C20.5196 21.8946 20.2652 22 20 22H4C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21V11C3 10.7348 3.10536 10.4804 3.29289 10.2929C3.48043 10.1054 3.73478 10 4 10H5V9C5 8.08075 5.18106 7.1705 5.53284 6.32122C5.88463 5.47194 6.40024 4.70026 7.05025 4.05025C7.70026 3.40024 8.47194 2.88463 9.32122 2.53284C10.1705 2.18106 11.0807 2 12 2C12.9193 2 13.8295 2.18106 14.6788 2.53284C15.5281 2.88463 16.2997 3.40024 16.9497 4.05025C17.5998 4.70026 18.1154 5.47194 18.4672 6.32122C18.8189 7.1705 19 8.08075 19 9V10ZM17 10V9C17 7.67392 16.4732 6.40215 15.5355 5.46447C14.5979 4.52678 13.3261 4 12 4C10.6739 4 9.40215 4.52678 8.46447 5.46447C7.52678 6.40215 7 7.67392 7 9V10H17ZM11 14V18H13V14H11Z"
            ></path>
          </svg>
          <p class="text-xs font-bold uppercase text-navy-100">
            {$_('battles.create.privacy.title')}
          </p>
        </div>
        <p class="mt-1 text-2xs font-medium text-navy-200">{$_('battles.create.privacy.desc')}</p>
        <RadioGroup bind:value="{publicMode}" class="mt-4 grid grid-cols-2 gap-2.5 sm:flex">
          <RadioGroupOption value="public">
            <button
              class="button w-full px-4 text-[10px] {publicMode === 'public'
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              {$_('battles.create.public')}
            </button>
          </RadioGroupOption>
          <RadioGroupOption value="private">
            <button
              class="button w-full px-4 text-[10px] {publicMode === 'private'
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              {$_('battles.create.private')}
            </button>
          </RadioGroupOption>
        </RadioGroup>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="icon h-5 w-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17 4C18.5913 4 20.1174 4.63214 21.2426 5.75736C22.3679 6.88258 23 8.4087 23 10V14C23 15.5913 22.3679 17.1174 21.2426 18.2426C20.1174 19.3679 18.5913 20 17 20H7C5.4087 20 3.88258 19.3679 2.75736 18.2426C1.63214 17.1174 1 15.5913 1 14V10C1 8.4087 1.63214 6.88258 2.75736 5.75736C3.88258 4.63214 5.4087 4 7 4H17ZM10 9H8V11H6V13H7.999L8 15H10L9.999 13H12V11H10V9ZM18 13H16V15H18V13ZM16 9H14V11H16V9Z"
            ></path>
          </svg>
          <p class="text-xs font-bold uppercase text-navy-100">{$_('battles.create.mode.title')}</p>
          <span
            class="relative mt-px inline-flex min-h-0 flex-shrink-0 items-center justify-center self-start rounded-[0.4em] bg-gold p-1 text-center align-baseline text-2xs font-bold leading-none text-navy-700 transition-colors duration-100"
          >
            NEW
          </span>
        </div>
        <p class="mt-1 text-2xs font-medium text-navy-200">{$_('battles.create.mode.desc')}</p>
        <RadioGroup bind:value="{mode}" class="mt-4 grid grid-cols-2 gap-2.5 sm:flex">
          <RadioGroupOption value="classic">
            <button
              class="button w-full px-4 text-[10px] {mode === 'classic'
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              {$_('battles.create.classic')}
            </button>
          </RadioGroupOption>
          <RadioGroupOption value="underdog">
            <button
              class="button w-full px-4 text-[10px] disabled:cursor-default disabled:brightness-75 {mode ===
              'underdog'
                ? 'border border-gold bg-navy-700 transition-colors duration-200 hover:bg-navy-600'
                : 'button-secondary'}"
            >
              Underdog
            </button>
          </RadioGroupOption>
        </RadioGroup>
      </div>
      <div
        class="flex h-min basis-full flex-col rounded-lg bg-navy-700 p-4 sm:flex-row sm:px-8 sm:py-6 xl:ml-auto xl:basis-auto"
      >
        <div class="grid w-full grid-cols-2 justify-center sm:justify-start md:flex">
          <div class="flex flex-col text-center sm:mr-12 md:text-left">
            <p class="text-xs font-bold uppercase text-navy-200">
              {$_('battles.create.confirm.title')}
            </p>
            <p class="text-2xs font-medium text-navy-200">{$_('battles.create.confirm.desc')}</p>
            <span class="mt-3 text-base font-semibold leading-none text-gold">
              {convertPrice($page.data.currency, totalPrice)}
            </span>
          </div>
          <div>
            <div>
              <button
                class="button button-primary col-span-2 ml-auto mr-auto mt-4 h-12 self-center px-3 text-2xs disabled:brightness-75 md:mr-0 md:mt-0 md:text-xs xl:ml-0"
                disabled="{totalCaseCount <= 0 || loading}"
                on:click="{createBattle}"
              >
                <svg
                  class="icon mr-2 h-5 w-5 flex-shrink-0 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="M17.833 6.166c-3.216-3.216-8.45-3.216-11.666 0-3.217 3.217-3.217 8.45 0 11.667 3.216 3.216 8.45 3.216 11.666 0 3.217-3.216 3.217-8.45 0-11.667zm-5.008 9.917h-1.65v-3.258H7.917v-1.65h3.258V7.916h1.65v3.259h3.258v1.65h-3.258v3.258z"
                  ></path>
                </svg>
                <span>{$_('battles.header.createBattle')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<CaseAddModal bind:this="{modal}" bind:selectedCases {cases} />
