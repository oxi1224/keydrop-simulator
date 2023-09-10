<script lang="ts">
  import {
    colors,
    createToast,
    goldenNames,
    sellItems,
    wearConversions,
    type CaseDrop,
    type CaseWithDrops,
    settings,
    convertPrice,
    type ItemWithGlobal
  } from '$lib';
  import { invalidateAll } from '$app/navigation';
  import { _ } from 'svelte-i18n';
  import Spinner from '$components/util/Spinner.svelte';
  import type { Item } from '@prisma/client';
  import { page } from '$app/stores';

  const WINNING_ITEM = 55;

  export let data: CaseWithDrops;
  let rouletteItems: CaseDrop[] = [];
  let multipleRoulettesItems: CaseDrop[][] = [];
  let casePrice = data.price;
  let rouletteCount = 1;

  let totalWinnings = 0;
  let totalSpendings = 0;
  let totalProfit = 0;

  const allSessionDrops: CaseDrop[] = [];
  let wonItems: ItemWithGlobal[] = [];
  let soldItems: Item[] = [];
  let wonItemsPrice: number;

  let loading = false;
  let sellLoading = false;
  let sellSuccess = false;
  let menuState: 0 | 1 = 0;

  let caseStartPlayer: HTMLAudioElement;
  let caseEndPlayer: HTMLAudioElement;

  // prettier-ignore
  $: tooPoor = !$page.data.user ? true : $page.data.user[data.goldenCase ? 'goldBalance' : 'balance'] < casePrice;
  $: wonItemsPrice = wonItems.reduce((n, o) => n + o.globalInvItem.skinPrice, 0);
  $: totalProfit = totalWinnings - totalSpendings;

  generateRollItems(rouletteCount);
  function generateRollItems(count: number) {
    rouletteItems = [];
    multipleRoulettesItems = [];

    if (count === 1) {
      for (let i = 0; i < 60; i++) {
        const rollNumber = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
        const item = data.drops.find(
          (obj) => obj.oddsRange[0] <= rollNumber && obj.oddsRange[1] >= rollNumber
        );
        if (!item) {
          i--;
          continue;
        }
        rouletteItems.push(item);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const rollItems: CaseDrop[] = [];
        for (let itemI = 0; itemI < 60; itemI++) {
          const rollNumber = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
          const item = data.drops.find(
            (obj) => obj.oddsRange[0] <= rollNumber && obj.oddsRange[1] >= rollNumber
          );
          if (!item) {
            i--;
            continue;
          }
          rollItems.push(item);
        }
        multipleRoulettesItems.push(rollItems);
      }
    }
  }

  function changeRouletteCount(rollCount: number) {
    [
      ...document.querySelectorAll(
        `div.${rouletteCount === 1 ? 'single-roll-winScreen' : 'CaseRolls-winScreen'}`
      )
    ].forEach((elm) => {
      elm.classList.add('hidden');
      elm.classList.remove('flex');
    });
    const singleRoll = document.querySelector('.single-roll');
    const btnArr = [...document.querySelectorAll('.case-count-btn')];
    const btnOverlay = document.querySelector('div.css-1ti3c59') as HTMLElement;
    const arrows = [...document.querySelectorAll('svg.point-arrow')];
    document
      .querySelector('.case-count-btn.case-count-selected-btn')
      ?.classList.toggle('case-count-selected-btn');
    btnArr[rollCount - 1].classList.toggle('case-count-selected-btn');
    if (rollCount !== 1 && !singleRoll?.classList.contains('hidden')) {
      singleRoll?.classList.toggle('hidden');
      arrows[0].classList.toggle('arrow-left');
      arrows[1].classList.toggle('arrow-right');
    }
    if (rollCount === 1 && singleRoll?.classList.contains('hidden')) {
      singleRoll.classList.remove('hidden');
      arrows[0].classList.remove('arrow-left');
      arrows[1].classList.remove('arrow-right');
    }
    rouletteCount = rollCount;
    btnOverlay!.style.transform = `translateX(${100 * (rouletteCount - 1)}%)`;
    casePrice = Math.round(data.price * rouletteCount * 100) / 100;
    generateRollItems(rouletteCount);
  }

  async function handleRoll() {
    generateRollItems(rouletteCount);
    sellSuccess = false;
    [...document.querySelectorAll('.single-sell-btn')].forEach((el) => {
      (el as HTMLButtonElement).disabled = false;
    });
    soldItems = [];
    if (
      !$page.data.user ||
      $page.data.user[data.goldenCase ? 'goldBalance' : 'balance'] < casePrice
    ) {
      createToast({
        type: 'error',
        header: $_('error'),
        message: $_('toasts.error.messages.notEnoughBalance')
      });
      return;
    }
    const winElmArr = [
      ...document.querySelectorAll(
        `div.${rouletteCount === 1 ? 'single-roll-winScreen' : 'CaseRolls-winScreen'}`
      )
    ];
    winElmArr.forEach((elm) => {
      elm.classList.add('hidden');
      elm.classList.remove('flex');
    });
    loading = true;
    const res = await fetch('/api/skins/case-open', {
      method: 'POST',
      body: JSON.stringify({ count: rouletteCount, websiteName: data.websiteName }),
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
    } else {
      await invalidateAll();
    }
    const winningCaseDrops: CaseDrop[] = resBody.caseDrops;
    wonItems = resBody.items;

    if (rouletteCount === 1) rouletteItems[WINNING_ITEM] = winningCaseDrops[0];
    else winningCaseDrops.forEach((item, i) => (multipleRoulettesItems[i][WINNING_ITEM] = item));

    await playRollAnimation();
    winElmArr.forEach((elm, i) => {
      elm.classList.remove('hidden');
      elm.classList.add('flex');
      elm.querySelector('.award-chance')!.textContent = winningCaseDrops[i].displayOdds;
      elm.querySelector('.award-skin')!.textContent = winningCaseDrops[i].skinName;
      elm.querySelector('.award-weapon')!.textContent = winningCaseDrops[i].weaponName;
      elm.querySelector('.award-wear')!.textContent =
        wearConversions[winningCaseDrops[i].skinQuality as keyof typeof wearConversions];
      elm.querySelector('.award-price')!.textContent = convertPrice(
        $page.data.currency,
        winningCaseDrops[i].skinPrice
      );
      if (elm.querySelector('.award-img')) {
        (elm.querySelector('.award-img') as HTMLImageElement).src =
          winningCaseDrops[i].skinImgSource;
        (elm.querySelector('.award-bg-img') as HTMLImageElement).src =
          colors.itemBg[winningCaseDrops[i].skinRarity as keyof typeof colors.itemBg];
      }
    });

    createToast({
      type: 'success',
      header: `${$_('toasts.special.caseOpen.header')}: ${convertPrice(
        $page.data.currency,
        winningCaseDrops.reduce((n, o) => n + o.skinPrice, 0)
      )}`,
      message: `${$_('toasts.special.caseOpen.message')}: ${convertPrice(
        $page.data.currency,
        winningCaseDrops.reduce((n, o) => n + o.skinPrice, 0) - casePrice
      )}`
    });
    switchMenus();
    allSessionDrops.push(...winningCaseDrops);
    totalSpendings += casePrice;
    totalWinnings = allSessionDrops.reduce((sum, obj) => sum + obj.skinPrice, 0);
    loading = false;
    await invalidateAll();
    return;
  }

  async function playRollAnimation() {
    const easing = 'cubic-bezier(.1,.8,.01,1)';
    const rectSelection = document.querySelector('.point-arrow-top')!.getBoundingClientRect();

    caseEndPlayer.currentTime = 0;
    caseEndPlayer.pause();
    if (!$settings.muteAudio) caseStartPlayer.play();
    const duration = $settings.fastOpen ? 1750 : 7000;
    let interval;
    if (rouletteCount === 1) {
      const bounds = document
        .querySelectorAll('li.case-item')
        [WINNING_ITEM].getBoundingClientRect();
      const x = Math.floor(
        Math.random() *
          (bounds.width * (WINNING_ITEM - 2.5) - bounds.width * (WINNING_ITEM - 3.5)) +
          bounds.width * (WINNING_ITEM - 3.5)
      );
      document
        .querySelector('ul.CaseRolls-row')!
        .animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${x}px)` }], {
          iterations: 1,
          duration: duration,
          easing: easing,
          fill: 'forwards'
        });

      const ticked: Element[] = [];

      interval = setInterval(() => {
        document.querySelectorAll('li.case-item').forEach((li) => {
          const tickIndicator = li.querySelector('.tick-indicator')!;
          const rect = tickIndicator.getBoundingClientRect();
          if (
            !$settings.muteAudio &&
            !ticked.find((el) => el.isSameNode(tickIndicator)) &&
            rect.bottom > rectSelection.top &&
            rect.right > rectSelection.left &&
            rect.top < rectSelection.bottom &&
            rect.left < rectSelection.right
          ) {
            ticked.push(tickIndicator);
            const tickPlayer = new Audio('/audio/case-tick.webm');
            tickPlayer.currentTime = 0.05;
            tickPlayer.play();
          }
        });
      }, 10);
    } else {
      const roulettes = [...document.querySelectorAll('div.CaseRolls-roll')];
      roulettes.forEach((roulette) => {
        const bounds = [...document.querySelectorAll('div.CaseRolls-skin')][
          WINNING_ITEM
        ].getBoundingClientRect();
        const y =
          Math.floor(bounds.height * WINNING_ITEM - bounds.height * (WINNING_ITEM + 1) + 1) +
          bounds.height * (WINNING_ITEM + 1);
        roulette.animate(
          [
            { transform: 'translateY(0)' },
            { transform: `translateY(-${y / 2}px)` },
            { transform: `translateY(-${y}px)` }
          ],
          {
            iterations: 1,
            duration: duration,
            easing: easing,
            fill: 'forwards'
          }
        );
      });

      const ticked: Element[] = [];
      interval = setInterval(() => {
        document
          .querySelector('div.CaseRolls-roll')!
          .querySelectorAll('.CaseRolls-skin')
          .forEach((elm) => {
            const tickIndicator = elm.querySelector('.tick-indicator')!;
            const rect = tickIndicator.getBoundingClientRect();
            if (
              !$settings.muteAudio &&
              !ticked.find((el) => el.isSameNode(tickIndicator)) &&
              rect.bottom > rectSelection.top &&
              rect.right > rectSelection.left &&
              rect.top < rectSelection.bottom &&
              rect.left < rectSelection.right
            ) {
              ticked.push(tickIndicator);
              const tickPlayer = new Audio('/audio/case-tick.webm');
              tickPlayer.currentTime = 0.05;
              tickPlayer.play();
            }
          });
      }, 10);
    }
    await new Promise((r) => setTimeout(r, duration));
    clearInterval(interval);
    if (!$settings.muteAudio) caseEndPlayer.play();
  }

  async function switchMenus() {
    menuState = menuState === 0 ? 1 : 0;
    document.querySelector('div.Case-MainUI')?.classList.toggle('is-open');
    document.querySelector('div.Case-AfterOpen')?.classList.toggle('is-open');
  }

  function reOpen() {
    caseStartPlayer.currentTime = 0;
    caseStartPlayer.pause();
    caseEndPlayer.currentTime = 0;
    caseEndPlayer.pause();
    if (rouletteCount === 1) {
      (document.querySelector('ul.CaseRolls-row') as HTMLElement)!
        .getAnimations()
        .forEach((anim) => anim.cancel());
    } else {
      const roulettes = [...document.querySelectorAll('div.CaseRolls-roll')] as HTMLElement[];
      for (const roulette of roulettes) roulette.getAnimations().forEach((anim) => anim.cancel());
    }
    switchMenus();
    const winElmArr = [
      ...document.querySelectorAll(
        `div.${rouletteCount === 1 ? 'single-roll-winScreen' : 'CaseRolls-winScreen'}`
      )
    ];
    winElmArr.forEach((elm) => {
      elm.classList.add('hidden');
      elm.classList.remove('flex');
    });

    handleRoll();
  }

  async function handleSingleSell(e: MouseEvent) {
    sellLoading = true;
    const sellBtns = [...document.querySelectorAll('.single-sell-btn')];
    const clickedEl = (e.target as Element).closest('.single-sell-btn') as Element;
    const index = sellBtns.indexOf(clickedEl);
    const item = wonItems[index];
    const sellData = await sellItems([item]);
    clickedEl.setAttribute('disabled', '');

    createToast({
      type: sellData.res.ok ? 'success' : 'error',
      header: sellData.res.ok ? 'sukces' : 'błąd',
      message: $_(sellData.messageKey)
    });

    if (sellData.res.ok) {
      soldItems.push(item);
      wonItemsPrice -= item.globalInvItem.skinPrice;
    }
    sellLoading = false;
  }

  async function handleMassSell(skins: Item[]) {
    sellLoading = true;
    const soldIDs = soldItems.map((i) => i.dropId);
    const itemsToSell = skins.filter((i) => !soldIDs.includes(i.dropId));
    const IDs = itemsToSell.map((i) => i.dropId);
    const sellData = await sellItems(itemsToSell);
    createToast({
      type: sellData.res.ok ? 'success' : 'error',
      header: sellData.res.ok ? 'sukces' : 'błąd',
      message: $_(sellData.messageKey)
    });

    if (sellData.res.ok) {
      wonItems = wonItems.filter((item) => IDs.includes(item.dropId));
      wonItemsPrice = 0;
      [...document.querySelectorAll('.single-sell-btn')].forEach((el) => {
        (el as HTMLButtonElement).disabled = true;
      });
      sellSuccess = true;
      await invalidateAll();
    }
    sellLoading = false;
  }
</script>

<div
  class="glow-gold fixed bottom-0 left-0 z-50 m-2 rounded-xl bg-navy-700 bg-opacity-75 p-5 text-base text-navy-200"
>
  <p>
    {$_('case.winScreen.spendings')}: {convertPrice($page.data.currency, totalSpendings)}
  </p>
  <p>
    {$_('case.winScreen.winnings')}: {convertPrice($page.data.currency, totalWinnings)}
  </p>
  <p>
    {$_('case.winScreen.profit')}: {convertPrice($page.data.currency, totalProfit)}
  </p>
</div>
<section class="container mx-auto mb-8 mt-1" style="max-width: 1480px;">
  <audio bind:this="{caseStartPlayer}" src="/audio/case-start.webm"></audio>
  <audio bind:this="{caseEndPlayer}" src="/audio/case-end.webm"></audio>
  <div class="relative overflow-hidden lg:overflow-visible">
    <svg
      viewBox="0 0 31 31"
      class="point-arrow point-arrow-top absolute left-1/2 top-0 z-10 -ml-5 -mt-5 h-10 w-10 rotate-180"
    >
      <defs>
        <filter id="Polygon_43" x="1.5" y="2.5" width="28" height="24" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="blur"></feGaussianBlur>
          <feFlood flood-color="#ff445d" flood-opacity="0.388"></feFlood>
          <feComposite operator="in" in2="blur"></feComposite>
          <feComposite in="SourceGraphic"></feComposite>
        </filter>
      </defs>
      <g transform="translate(-1265 -607)">
        <g transform="translate(1270 612)" fill="#19181e" stroke="#262630" stroke-width="3">
          <circle cx="10.5" cy="10.5" r="13.5" stroke="none"></circle>
          <circle cx="10.5" cy="10.5" r="13" fill="none"></circle>
        </g>
        <g transform="matrix(1, 0, 0, 1, 1265, 607)" filter="url(#Polygon_43)">
          <g transform="translate(9 10)" fill="none">
            <path d="M6.5,0,13,9H0Z" stroke="none"></path>
            <path
              class="point-arrow-triangle"
              d="M 6.5 3.415939807891846 L 3.91151237487793 7 L 9.08848762512207 7 L 6.5 3.415939807891846 M 6.5 0 L 13 9 L 0 9 L 6.5 0 Z"
              stroke="none"
              fill="#ff445d"
            ></path>
          </g>
        </g>
      </g>
    </svg>
    <svg
      viewBox="0 0 31 31"
      class="point-arrow absolute left-1/2 top-full z-10 -ml-5 -mt-5 h-10 w-10 rotate-0"
    >
      <defs>
        <filter id="Polygon_43" x="1.5" y="2.5" width="28" height="24" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="blur"></feGaussianBlur>
          <feFlood flood-color="#ff445d" flood-opacity="0.388"></feFlood>
          <feComposite operator="in" in2="blur"></feComposite>
          <feComposite in="SourceGraphic"></feComposite>
        </filter>
      </defs>
      <g transform="translate(-1265 -607)">
        <g transform="translate(1270 612)" fill="#19181e" stroke="#262630" stroke-width="3">
          <circle cx="10.5" cy="10.5" r="13.5" stroke="none"></circle>
          <circle cx="10.5" cy="10.5" r="13" fill="none"></circle>
        </g>
        <g transform="matrix(1, 0, 0, 1, 1265, 607)" filter="url(#Polygon_43)">
          <g transform="translate(9 10)" fill="none">
            <path d="M6.5,0,13,9H0Z" stroke="none"></path>
            <path
              class="point-arrow-triangle"
              d="M 6.5 3.415939807891846 L 3.91151237487793 7 L 9.08848762512207 7 L 6.5 3.415939807891846 M 6.5 0 L 13 9 L 0 9 L 6.5 0 Z"
              stroke="none"
              fill="#ff445d"
            ></path>
          </g>
        </g>
      </g>
    </svg>
    <div
      class="relative overflow-hidden bg-navy-800 sm:rounded-lg"
      style="height: 300px; box-shadow: rgba(66, 66, 84, 0.2) 0px 0px 0px 5px;"
    >
      <div
        class="grid-stack single-roll absolute left-0 top-0 grid h-full"
        style="width: 1480px; left: calc(50% - 740px);"
      >
        <div
          class="single-roll-winScreen absolute left-1/2 z-40 hidden w-full -translate-x-1/2 overflow-hidden bg-navy-800 bg-opacity-50 sm:rounded-lg"
          style="height: 300px; box-shadow: rgba(66, 66, 84, 0.2) 0px 0px 0px 5px;"
        >
          <div
            class="absolute left-1/2 top-1/2 z-10 flex h-5/6 -translate-x-1/2 -translate-y-1/2 scale-100 transform self-center justify-self-center transition-all duration-700"
          >
            <div
              class="glow-gold ratio css-dap7rg group z-0 grid grid-cols-1 grid-rows-1 items-center justify-center justify-items-center rounded border border-solid border-gold bg-navy-700 bg-cover bg-center sm:rounded-lg"
              style="aspect-ratio: 5/3;"
            >
              <div
                class="z-10 col-start-1 row-start-1 mb-auto flex w-full items-center justify-end px-11 py-2 text-right text-3xs font-semibold uppercase leading-none text-navy-200 sm:px-2 md:p-5"
              >
                <div class="ml-2">
                  Chance
                  <br />
                  <!-- chance -->
                  <span class="award-chance"></span>
                </div>
              </div>
              <!-- bg img -->
              <img
                src=""
                alt=""
                class="award-bg-img col-start-1 row-start-1 mt-6 w-3/5 transform object-contain duration-300 ease-in-out group-hover:scale-110 md:mt-0"
              />
              <!-- img -->
              <img
                alt=""
                class="award-img group-hover:rotate-10 pointer-events-none col-start-1 row-start-1 mt-6 w-2/3 transform object-contain duration-300 ease-in-out group-hover:scale-75"
              />
              <div
                class="z-10 col-start-1 row-start-2 w-full self-end justify-self-start px-11 py-3 font-semibold uppercase leading-tight sm:px-3 md:row-start-1 md:p-5"
              >
                <!-- skin, weapon, wear, price -->
                <div class="award-skin truncate text-2xs text-navy-200"></div>
                <div class="award-weapon truncate text-xs font-bold text-white"></div>
                <div class="award-wear truncate text-2xs text-navy-200"></div>
                <div class="award-price -mb-1 truncate text-xs font-bold text-gold"></div>
              </div>
            </div>
          </div>
        </div>
        <ul class="CaseRolls-row flex h-full w-full">
          {#each rouletteItems as item}
            <li
              class="case-item relative flex h-full min-w-0 flex-shrink-0"
              style="width: 14.2857%; background-image: {colors.gradient[item.skinRarity]};"
            >
              <img src="{item.skinImgSource}" alt="" class="mx-auto h-full w-4/5 object-contain" />
              <div
                class="absolute bottom-0 left-0 -mb-1 w-full p-2 font-semibold uppercase leading-tight md:p-5"
              >
                <div class="css-1vba4yg truncate text-navy-200">{item.skinName}</div>
                <div class="truncate font-bold text-white" title="{item.weaponName} ">
                  {item.weaponName}
                </div>
              </div>
              <div class="tick-indicator absolute -right-0.5 top-0 h-5 w-1"></div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="css-1ubc7bb absolute left-0 top-0 flex h-full w-full">
        {#each multipleRoulettesItems as rouletteItemsArray}
          <div
            style="width: {(1 / rouletteCount) * 100}%;"
            class="CaseRolls-wrapper h-full border-r border-dashed border-navy-550 will-change-transform"
          >
            <div
              class="CaseRolls-winScreen fixed left-1/2 top-1/2 z-30 hidden h-full w-full -translate-x-1/2 -translate-y-1/2"
            >
              <div
                class="mb-auto w-full translate-y-3 transform items-center space-y-1 p-2 text-right text-2xs font-semibold uppercase leading-none text-navy-200 opacity-100 sm:space-y-0 md:p-5"
              >
                <div class="ml-2 text-2xs">
                  Chance
                  <br />
                  <!-- chance -->
                  <span style="font-size: 110%;" class="award-chance"></span>
                </div>
              </div>
              <div
                class="absolute bottom-0 flex w-full min-w-0 flex-col items-center justify-between p-2 font-semibold uppercase leading-tight opacity-100 md:p-5 md:text-xl lg:flex-row"
              >
                <div class="flex w-full flex-1 flex-col justify-start">
                  <!-- skin -->
                  <div class="award-skin truncate text-2xs text-navy-200"></div>
                  <!-- weapon -->
                  <div class="award-weapon truncate text-xs font-bold text-white"></div>
                  <!-- wear -->
                  <div class="award-wear truncate text-2xs text-navy-200"></div>
                </div>
                <button
                  class="single-sell-btn events -ml-2px mt-1 h-3/4 truncate rounded-md border border-solid px-2 py-1 text-3xs font-bold uppercase text-gold brightness-75 transition duration-200 hover:brightness-100 disabled:brightness-50 sm:py-2 md:text-xs lg:px-4"
                  on:click="{(e) => handleSingleSell(e)}"
                >
                  {$_('case.winScreen.sell')}
                  <br class="md:hidden" />
                  <span class="award-price"></span>
                </button>
              </div>
            </div>
            <div class="CaseRolls-roll h-full w-full flex-shrink-0">
              {#each rouletteItemsArray as caseItem}
                <div
                  class="CaseRolls-skin css-1hmgmgm relative flex h-full w-full items-center justify-center border border-dotted border-navy-400"
                >
                  <img
                    alt=""
                    class="absolute mx-auto object-contain"
                    style="width: {(3 + rouletteCount) * 10}%;"
                    src="{colors.itemBg[caseItem.skinRarity]}"
                  />
                  <img
                    src="{caseItem.skinImgSource}"
                    alt=""
                    style="width: {(3 + rouletteCount) * 10}%;"
                    class="z-10 block h-full object-contain"
                  />
                  <div class="tick-indicator absolute -bottom-0.5 left-0 h-5 w-1"></div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="mt-6 grid w-full px-2 sm:mt-8 sm:w-auto">
    <div
      class="Case-AfterOpen -z-10 col-start-1 row-start-1 -translate-y-5 opacity-0 transition duration-1000 ease-out is-open:z-20 is-open:translate-y-0 is-open:opacity-100"
    >
      <div
        class="mx-auto mb-4 grid max-w-5xl grid-cols-2 gap-2 sm:mb-6 sm:gap-4 md:gap-8"
        style="grid-template-columns: auto 1fr 1fr 1fr;"
      >
        <button
          on:click="{switchMenus}"
          disabled="{menuState === 0}"
          class="md:w-15 sm:h-15 active:bg-opacity-15 flex aspect-square h-10 items-center justify-center rounded-md border border-solid border-navy-400 bg-navy-700 text-center text-2xs font-extrabold uppercase leading-tight text-navy-400 transition-colors duration-200 hover:bg-gray hover:bg-opacity-5 active:duration-0 sm:rounded-lg sm:text-sm"
        >
          <svg class="h-3 w-3 flex-shrink-0 sm:h-5 sm:w-5">
            <use xlink:href="/icons/icons.svg#arrow-left"></use>
          </svg>
        </button>
        <button
          class="sm:h-15 active:bg-opacity-15 glow-red flex h-10 items-center justify-center rounded-md border border-solid border-red bg-navy-700 px-1 text-center text-2xs font-bold uppercase leading-tight text-red transition-colors duration-200 hover:bg-red hover:bg-opacity-5 active:duration-0 sm:rounded-lg sm:px-8 sm:text-sm md:px-12"
          on:click="{reOpen}"
          disabled="{loading || menuState === 0}"
        >
          <svg class="mr-2 h-3 w-3 flex-shrink-0 sm:mr-3 sm:h-5 sm:w-5">
            <use xlink:href="/icons/icons.svg#try-again"></use>
          </svg>
          {$_('case.winScreen.reOpen')}
        </button>
        <button
          class="mass-sell-btn sm:h-15 active:bg-opacity-15 glow-gold flex h-10 items-center justify-center rounded-md border border-solid border-gold bg-navy-700 px-1 text-center text-2xs font-bold uppercase text-gold transition-colors duration-200 hover:bg-gold hover:bg-opacity-5 active:duration-0 disabled:brightness-50 disabled:hover:bg-navy-700 sm:rounded-lg sm:px-8 sm:text-sm md:px-12"
          on:click="{() => handleMassSell(wonItems)}"
          disabled="{sellLoading || sellSuccess || menuState === 0}"
        >
          {#if sellLoading}
            <Spinner size="1.5em" borderWidth=".25em" />
          {:else if sellSuccess}
            {$_('case.sellSuccess')}
          {:else}
            <svg class="mr-2 h-4 w-3 flex-shrink-0 sm:mr-3 sm:h-6 sm:w-5">
              <use xlink:href="/icons/icons.svg#sell"></use>
            </svg>
            {$_('case.winScreen.sell')}&nbsp;
            <span class="total-award-price">
              {convertPrice($page.data.currency, wonItemsPrice)}
            </span>
          {/if}
        </button>
        <a
          href="/skins/upgrader"
          class="sm:h-15 active:bg-opacity-15 glow-teal flex h-10 items-center justify-center rounded-md border border-solid border-teal-500 bg-navy-700 px-1 text-center text-2xs font-bold uppercase leading-tight text-teal-500 transition-colors duration-200 hover:bg-teal-500 hover:bg-opacity-5 active:duration-0 sm:rounded-lg sm:px-8 sm:text-sm md:px-12"
          style="{menuState === 0 ? 'pointer-events: none;' : ''}"
        >
          <svg class="mr-2 h-3 w-3 flex-shrink-0 sm:mr-3 sm:h-5 sm:w-5">
            <use xlink:href="/icons/icons.svg?38#upgrader"></use>
          </svg>
          {$_('case.winScreen.upgrade')}
        </a>
      </div>
    </div>
    <div
      class="Case-MainUI is-open -z-10 col-start-1 row-start-1 mx-auto grid w-full -translate-y-5 grid-cols-2 gap-2 p-1 opacity-0 transition duration-1000 ease-in-out will-change-transform is-open:z-20 is-open:translate-y-0 is-open:opacity-100 sm:gap-4 md:w-auto md:gap-8"
    >
      <div class="sm:h-15 relative flex h-10">
        <div
          style="left: 0;"
          class="css-1ti3c59 absolute top-0 z-10 -ml-px h-full border border-solid border-pastelGreen py-6 transition-transform duration-700 will-change-transform"
        ></div>
        <button
          on:click="{() => changeRouletteCount(1)}"
          disabled="{loading || menuState === 1}"
          class="case-count-btn case-count-selected-btn ml-0 flex h-full w-full flex-1 items-center justify-center rounded-l border border-solid border-navy-500 bg-navy-700 py-6 text-center text-2xs font-bold leading-tight text-navy-200 transition-colors duration-200 hover:bg-navy-600 hover:text-white sm:rounded-l-lg sm:px-6 sm:text-sm"
        >
          1
        </button>
        <button
          on:click="{() => changeRouletteCount(2)}"
          disabled="{loading || menuState === 1}"
          class="case-count-btn -ml-px flex h-full w-full flex-1 items-center justify-center border border-solid border-navy-500 bg-navy-700 py-6 text-center text-xs font-bold leading-tight text-navy-200 transition-colors duration-200 hover:bg-navy-600 hover:text-white sm:px-6 sm:text-sm"
        >
          2
        </button>
        <button
          on:click="{() => changeRouletteCount(3)}"
          disabled="{loading || menuState === 1}"
          class="case-count-btn -ml-px flex h-full w-full flex-1 items-center justify-center border border-solid border-navy-500 bg-navy-700 py-6 text-center text-xs font-bold leading-tight text-navy-200 transition-colors duration-200 hover:bg-navy-600 hover:text-white sm:px-6 sm:text-sm"
        >
          3
        </button>
        <button
          on:click="{() => changeRouletteCount(4)}"
          disabled="{loading || menuState === 1}"
          class="case-count-btn -ml-px flex h-full w-full flex-1 items-center justify-center border border-solid border-navy-500 bg-navy-700 py-6 text-center text-xs font-bold leading-tight text-navy-200 transition-colors duration-200 hover:bg-navy-600 hover:text-white sm:px-6 sm:text-sm"
        >
          4
        </button>
        <button
          on:click="{() => changeRouletteCount(5)}"
          disabled="{loading || menuState === 1}"
          class="case-count-btn -ml-px flex h-full w-full flex-1 items-center justify-center rounded-r border border-solid border-navy-500 bg-navy-700 py-6 text-center text-xs font-bold leading-tight text-navy-200 transition-colors duration-200 hover:bg-navy-600 hover:text-white sm:rounded-r-lg sm:px-6 sm:text-sm"
        >
          5
        </button>
      </div>
      <button
        class="sm:h-15 ga_openButtonLoser active:bg-opacity-15 css-8f0coi grid h-10 w-auto grid-cols-1 grid-rows-1 items-center justify-center justify-items-center rounded border border-solid bg-navy-700 py-6 text-2xs font-bold uppercase transition-colors duration-200 hover:bg-opacity-5 active:duration-0 sm:rounded-lg sm:px-12 sm:text-sm md:text-xs
        {!$page.data.user
          ? 'glow-red border-red text-red hover:bg-red'
          : $page.data.user[data.goldenCase ? 'goldBalance' : 'balance'] >= casePrice
          ? 'glow-pastelGreen border-green text-green hover:bg-green'
          : 'glow-red border-red text-red hover:bg-red'}"
        on:click="{handleRoll}"
        disabled="{loading || tooPoor || menuState === 1}"
      >
        <span
          class="col-start-1 row-start-1 flex scale-50 transform items-center justify-center opacity-0 transition duration-300"
        >
          <svg
            viewBox="9 0 188.4 140.4"
            fill="none"
            class="-translate-y-2px css-9uqyfg block h-6 w-6 rotate-180 transform stroke-current text-pastelGreen sm:h-10 sm:w-10"
          >
            <path
              class="triangle-path css-1sx0a3p"
              stroke-width="5"
              stroke-dasharray="79,40"
              stroke-dashoffset="15"
              d="M163.4 20.6L103.2 121 43 20.6h120.4z"
            ></path>
          </svg>
        </span>
        <span class="col-start-1 row-start-1 flex items-center transition-opacity duration-300">
          {#if loading}
            <Spinner size="1.5em" borderWidth=".25em" />
          {:else}
            {#if !$page.data.user}
              {$_('case.notLoggedIn')}
            {:else}
              {$page.data.user[data.goldenCase ? 'goldBalance' : 'balance'] >= casePrice
                ? `${$_('case.open')} ${convertPrice($page.data.currency, casePrice)}`
                : `${$_('case.tooPoor')} ${convertPrice($page.data.currency, casePrice)}`}
            {/if}
            {#if $page.data.user}
              <div class="ml-1 flex items-center">
                {@html goldenNames.includes(data.websiteName)
                  ? '<img src="/icons/gold-coin.webp" class="w-3 h-3 ml-1">'
                  : ''}
              </div>
            {/if}
          {/if}
        </span>
      </button>
    </div>
  </div>
</section>
