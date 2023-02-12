<script lang="ts">
  import {
    colors,
    createPopup,
    goldenNames,
    sellItems,
    setUserData,
    userData,
    wearConversions,
    type CaseDrop,
    type CaseWithDrops
  } from '$lib';
  import Spinner from '$components/util/Spinner.svelte';
  import type { Item } from '@prisma/client';
  export let data: CaseWithDrops;
  export let rouletteItems: CaseDrop[] = [];

  let multipleRoulettesItems: CaseDrop[][] = [];
  let rouletteCount = 1;
  let casePrice = data.price;
  let winningItems: CaseDrop[] = [];
  let itemsIndb: Item[] = [];
  let soldItems: Item[] = [];
  let loading = false;
  let sellLoading = false;
  let sellSuccess = false;
  let totalAwardPrice: number;
  $: tooPoor = !$userData ? true : $userData.balance < casePrice;
  $: totalAwardPrice = itemsIndb.reduce((n, o) => n + o.skinPrice, 0);

  generateRollItems(rouletteCount);
  function generateRollItems(count: number) {
    rouletteItems = [];
    multipleRoulettesItems = [];
    winningItems = [];
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
      winningItems = [rouletteItems[45]];
    } else {
      for (let i = 0; i < count; i++) {
        const rollItems: CaseDrop[] = [];
        for (let itemI = 0; itemI < 60; itemI++) {
          const rollNumber = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
          const item = data.drops.find(
            (obj) => obj.oddsRange[0] <= rollNumber && obj.oddsRange[1] >= rollNumber
          );
          if (!item) continue;
          rollItems.push(item);
        }
        multipleRoulettesItems.push(rollItems);
      }
      multipleRoulettesItems.forEach((rI) => winningItems.push(rI[45]));
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
    sellSuccess = false;
    [...document.querySelectorAll('.single-sell-btn')].forEach((el) => {
      (el as HTMLButtonElement).disabled = false;
    });
    soldItems = [];
    if (!$userData || $userData.balance < casePrice) {
      createPopup({
        type: 'error',
        header: 'błąd',
        message: 'Niewystarczające saldo'
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
      body: JSON.stringify({ items: winningItems, cost: casePrice, origin: data.websiteName }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      createPopup({
        type: 'error',
        header: 'błąd',
        message: (await res.json()).message
      });
      loading = false;
      return;
    } else {
      await setUserData();
      itemsIndb = (await res.json()).items;
    }
    await playRollAnimation();
    winElmArr.forEach((elm, i) => {
      elm.classList.remove('hidden');
      elm.classList.add('flex');
      elm.querySelector('.award-chance')!.textContent = winningItems[i].displayOdds;
      elm.querySelector('.award-skin')!.textContent = winningItems[i].skinName;
      elm.querySelector('.award-weapon')!.textContent = winningItems[i].weaponName;
      elm.querySelector('.award-wear')!.textContent =
        wearConversions[winningItems[i].skinQuality as keyof typeof wearConversions];
      elm.querySelector('.award-price')!.textContent = winningItems[i].skinPrice.toFixed(2);
      if (elm.querySelector('.award-img')) {
        (elm.querySelector('.award-img') as HTMLImageElement).src = winningItems[i].skinImgSource;
        (elm.querySelector('.award-bg-img') as HTMLImageElement).src =
          colors.itemBg[winningItems[i].skinRarity as keyof typeof colors.itemBg];
      }
    });
    createPopup({
      type: 'success',
      header: `Wygrana: ${winningItems.reduce((n, o) => n + o.skinPrice, 0).toFixed(2)}`,
      message: `Zysk: ${(winningItems.reduce((n, o) => n + o.skinPrice, 0) - casePrice).toFixed(2)}`
    });
    switchMenus();
    loading = false;
    return;
  }

  async function playRollAnimation() {
    const fastOpen = localStorage.getItem('fast-open');
    const duration = fastOpen === 'true' ? 750 : 2500;
    if (rouletteCount === 1) {
      const bounds = document.querySelectorAll('li.case-item')[45].getBoundingClientRect();
      const x = Math.floor(
        Math.random() * (bounds.width * 42.5 - bounds.width * 41.5) + bounds.width * 41.5
      );
      document
        .querySelector('ul.CaseRolls-row')!
        .animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${x}px)` }], {
          iterations: 1,
          duration: duration,
          easing: 'cubic-bezier(.8,0,0,1)',
          fill: 'forwards'
        });
    } else {
      const roulettes = [...document.querySelectorAll('div.CaseRolls-roll')];
      roulettes.forEach((roulette) => {
        const bounds = [
          ...document.querySelectorAll('div.CaseRolls-skin')
        ][45].getBoundingClientRect();
        const y = Math.floor(bounds.height * 45 - bounds.height * 46 + 1) + bounds.height * 46;
        roulette.animate(
          [
            { transform: 'translateY(0)' },
            { transform: `translateY(-${y / 2}px)` },
            { transform: `translateY(-${y}px)` }
          ],
          {
            iterations: 1,
            duration: duration,
            easing: 'cubic-bezier(.8,0,0,1)',
            fill: 'forwards'
          }
        );
      });
    }
    await new Promise((r) => setTimeout(r, duration));
  }

  async function switchMenus() {
    document.querySelector('div.Case-MainUI')?.classList.toggle('is-open');
    document.querySelector('div.Case-AfterOpen')?.classList.toggle('is-open');
  }

  function reOpen() {
    generateRollItems(rouletteCount);
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
    const item = itemsIndb[index];
    const res = await sellItems([item]);
    clickedEl.setAttribute('disabled', '');
    if (res.ok) {
      soldItems.push(item);
      totalAwardPrice -= item.skinPrice;
    }
    sellLoading = false;
  }

  async function handleMassSell(skins: Item[]) {
    sellLoading = true;
    const soldIDs = soldItems.map((i) => i.dropId);
    const itemsToSell = skins.filter((i) => !soldIDs.includes(i.dropId));
    const IDs = itemsToSell.map((i) => i.dropId);
    const res = await sellItems(itemsToSell);
    if (res.ok) {
      itemsIndb = itemsIndb.filter((item) => IDs.includes(item.dropId));
      totalAwardPrice = 0;
      [...document.querySelectorAll('.single-sell-btn')].forEach((el) => {
        (el as HTMLButtonElement).disabled = true;
      });
      sellSuccess = true;
      await setUserData();
    }
    sellLoading = false;
  }
</script>

<section class="mt-1 mb-8 container mx-auto" style="max-width: 1480px;">
  <div class="relative overflow-hidden lg:overflow-visible">
    <svg
      viewBox="0 0 31 31"
      class="point-arrow absolute z-10 w-10 h-10 -mt-5 -ml-5 top-0 left-1/2 rotate-180"
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
      class="point-arrow absolute z-10 w-10 h-10 -mt-5 -ml-5 top-full left-1/2 rotate-0"
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
      class="relative overflow-hidden sm:rounded-lg bg-navy-800"
      style="height: 300px; box-shadow: rgba(66, 66, 84, 0.2) 0px 0px 0px 5px;"
    >
      <div
        class="absolute top-0 left-0 w-full h-full grid grid-stack single-roll"
        style="width: 1480px; left: calc(50% - 740px);"
      >
        <div
          class="z-40 single-roll-winScreen hidden absolute left-1/2 w-full -translate-x-1/2 overflow-hidden sm:rounded-lg bg-navy-800 bg-opacity-50 "
          style="height: 300px; box-shadow: rgba(66, 66, 84, 0.2) 0px 0px 0px 5px;"
        >
          <div
            class="flex transform self-center justify-self-center absolute z-10 top-1/2 left-1/2 h-5/6 -translate-x-1/2 -translate-y-1/2 scale-100 transition-all duration-700"
            style="aspect-ratio: 5/3;"
          >
            <div
              class="z-0 grid items-center justify-center grid-cols-1 grid-rows-1 bg-center bg-cover border border-solid rounded bg-navy-700 glow-gold group justify-items-center ratio border-gold sm:rounded-lg css-dap7rg"
            >
              <div
                class="z-10 flex items-center justify-end w-full col-start-1 row-start-1 p-3 mb-auto font-semibold leading-none text-right uppercase md:p-5 text-navy-200 text-3xs"
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
                class="award-bg-img w-3/5 object-contain col-start-1 mt-6 md:mt-0 row-start-1 duration-300 transform group-hover:scale-110 ease-in-out"
              />
              <!-- img -->
              <img
                alt=""
                class="award-img object-contain w-2/3 col-start-1 row-start-1 mt-6 duration-300 ease-in-out transform pointer-events-none group-hover:scale-75 group-hover:rotate-10"
              />
              <div
                class="z-10 self-end w-full col-start-1 row-start-2 p-3 font-semibold leading-tight uppercase md:p-5 md:row-start-1 justify-self-start"
              >
                <!-- skin, weapon, wear, price -->
                <div class="truncate text-navy-200 award-skin text-2xs"></div>
                <div class="font-bold text-white truncate award-weapon text-xs"></div>
                <div class="truncate text-navy-200 award-wear text-2xs"></div>
                <div class="-mb-1 font-bold truncate text-gold award-price text-xs"></div>
              </div>
            </div>
          </div>
        </div>
        <ul class="flex w-full h-full CaseRolls-row">
          {#each rouletteItems as item}
            <li
              class="flex-shrink-0 flex h-full min-w-0 relative case-item"
              style="width: 14.2857%; background-image: {colors.gradient[item.skinRarity]};"
            >
              <img src="{item.skinImgSource}" alt="" class="object-contain mx-auto w-4/5 h-full" />
              <div
                class="absolute bottom-0 left-0 w-full p-2 -mb-1 font-semibold leading-tight uppercase md:p-5"
              >
                <div class="truncate text-navy-200 css-1vba4yg">{item.skinName}</div>
                <div class="font-bold text-white truncate" title="{item.weaponName} ">
                  {item.weaponName}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="flex absolute top-0 left-0 w-full h-full css-1ubc7bb">
        {#each multipleRoulettesItems as rouletteItemsArray}
          <div
            style="width: {(1 / rouletteCount) * 100}%;"
            class="CaseRolls-wrapper h-full will-change-transform border-r border-dashed border-navy-550"
          >
            <div
              class="CaseRolls-winScreen hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full z-30"
            >
              <div
                class="p-2 mb-auto space-y-1 sm:space-y-0 items-center w-full font-semibold leading-none text-right transform uppercase md:p-5 text-navy-200 opacity-100 translate-y-3 text-2xs"
              >
                <div class="ml-2 text-2xs">
                  Chance
                  <br />
                  <!-- chance -->
                  <span style="font-size: 110%;" class="award-chance"></span>
                </div>
              </div>
              <div
                class="absolute bottom-0 p-2 md:p-5 flex flex-col items-center lg:flex-row w-full font-semibold leading-tight justify-between uppercase min-w-0 opacity-100 md:text-xl"
              >
                <div class="flex-1 md:max-w-1/2">
                  <!-- skin -->
                  <div class="truncate text-navy-200 text-2xs award-skin"></div>
                  <!-- weapon -->
                  <div class="font-bold text-white truncate text-xs award-weapon"></div>
                  <!-- wear -->
                  <div class="truncate text-navy-200 text-2xs award-wear"></div>
                </div>
                <button
                  class="single-sell-btn events px-2 py-1 mt-1 h-3/4 font-bold text-xs uppercase transition duration-200 border border-solid rounded-md sm:px-4 sm:py-2 -ml-2px brightness-75 hover:brightness-100 text-gold truncate disabled:brightness-50"
                  on:click="{(e) => handleSingleSell(e)}"
                >
                  Sprzedaj <br class="md:hidden" />
                  <span class="award-price"></span>
                </button>
              </div>
            </div>
            <div class="CaseRolls-roll flex-shrink-0 h-full w-full">
              {#each rouletteItemsArray as caseItem}
                <div
                  class="CaseRolls-skin w-full h-full css-1hmgmgm flex items-center justify-center relative border-navy-400 border-dotted border"
                >
                  <img
                    alt=""
                    class="object-contain absolute mx-auto"
                    style="width: {(3 + rouletteCount) * 10}%;"
                    src="{colors.itemBg[caseItem.skinRarity]}"
                  />
                  <img
                    src="{caseItem.skinImgSource}"
                    alt=""
                    style="width: {(3 + rouletteCount) * 10}%;"
                    class="block object-contain h-full z-10"
                  />
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="grid w-full px-2 mt-6 sm:mt-8 sm:w-auto">
    <div
      class="Case-AfterOpen col-start-1 row-start-1 transition duration-1000 ease-out -translate-y-5 opacity-0 -z-10 is-open:opacity-100 is-open:z-20 is-open:translate-y-0"
    >
      <div
        class="grid grid-cols-2 gap-2 mx-auto mb-4 sm:gap-4 md:gap-8 sm:mb-6 max-w-5xl"
        style="grid-template-columns: auto 1fr 1fr 1fr;"
      >
        <button
          on:click="{switchMenus}"
          class="flex items-center justify-center h-10 font-extrabold leading-tight text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:rounded-lg text-2xs sm:text-sm md:w-15 sm:h-15 border-navy-400 aspect-square text-navy-400 bg-navy-700 hover:bg-gray hover:bg-opacity-5 active:bg-opacity-15 active:duration-0"
        >
          <svg class="flex-shrink-0 w-3 h-3 mr-2 sm:mr-3 md:mr-0 sm:w-5 sm:h-5">
            <use xlink:href="/icons/icons.svg#arrow-left"></use>
          </svg>
          <span class="md:hidden">Wróć</span>
        </button>
        <button
          class="flex items-center justify-center h-10 px-3 font-bold leading-tight text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 border-red text-red bg-navy-700 hover:bg-red hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 glow-red"
          on:click="{reOpen}"
        >
          <svg class="flex-shrink-0 w-3 h-3 mr-2 sm:mr-3 sm:w-5 sm:h-5">
            <use xlink:href="/icons/icons.svg#try-again"></use>
          </svg>
          Otwórz ponownie
        </button>
        <button
          class="mass-sell-btn flex items-center justify-center h-10 px-3 font-bold text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 bg-navy-700 hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 text-gold hover:bg-gold glow-gold border-gold disabled:brightness-50 disabled:hover:bg-navy-700"
          on:click="{() => handleMassSell(itemsIndb)}"
          disabled="{sellLoading || sellSuccess}"
        >
          {#if sellLoading}
            <Spinner size="1.5em" borderWidth=".25em" />
          {:else if sellSuccess}
            Pomyślnie sprzedano
          {:else}
            <svg class="flex-shrink-0 w-3 h-4 mr-2 sm:mr-3 sm:w-5 sm:h-6">
              <use xlink:href="/icons/icons.svg#sell"></use>
            </svg>
            sprzedaj&nbsp;za&nbsp;
            <span class="total-award-price">{totalAwardPrice.toFixed(2)}</span>
          {/if}
        </button>
        <a
          href="/skins/Upgrader?"
          class="flex items-center justify-center h-10 px-3 font-bold leading-tight text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 border-teal-500 text-teal-500 bg-navy-700 hover:bg-teal-500 hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 glow-teal"
        >
          <svg class="flex-shrink-0 w-3 h-3 mr-2 sm:mr-3 sm:w-5 sm:h-5">
            <use xlink:href="/icons/icons.svg?38#upgrader"></use>
          </svg>
          Ulepsz Wszystko
        </a>
      </div>
    </div>
    <div
      class="Case-MainUI w-full p-1 md:w-auto grid col-start-1 row-start-1 gap-2 sm:gap-4 md:gap-8 mx-auto transition duration-1000 ease-in-out will-change-transform grid-cols-2 opacity-0 -z-10 -translate-y-5 is-open:opacity-100 is-open:z-20 is-open:translate-y-0 is-open"
    >
      <div class="relative flex h-10 sm:h-15">
        <div
          style="left: 0;"
          class="absolute top-0 h-full py-6 z-10 border border-solid transition-transform duration-700 -ml-px will-change-transform border-pastelGreen css-1ti3c59"
        ></div>
        <button
          on:click="{() => changeRouletteCount(1)}"
          disabled="{loading}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 rounded-l text-navy-200 sm:rounded-l-lg ml-0 case-count-selected-btn hover:text-white hover:bg-navy-600"
        >
          1
        </button>
        <button
          on:click="{() => changeRouletteCount(2)}"
          disabled="{loading}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px text-navy-200 hover:text-white hover:bg-navy-600"
        >
          2
        </button>
        <button
          on:click="{() => changeRouletteCount(3)}"
          disabled="{loading}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px text-navy-200 hover:text-white hover:bg-navy-600"
        >
          3
        </button>
        <button
          on:click="{() => changeRouletteCount(4)}"
          disabled="{loading}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px text-navy-200 hover:text-white hover:bg-navy-600"
        >
          4
        </button>
        <button
          on:click="{() => changeRouletteCount(5)}"
          disabled="{loading}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px rounded-r sm:rounded-r-lg text-navy-200 hover:text-white hover:bg-navy-600"
        >
          5
        </button>
      </div>
      <button
        class="grid items-center justify-center py-6 h-10 grid-cols-1 grid-rows-1 text-xs font-bold uppercase transition-colors duration-200 border border-solid rounded justify-items-center sm:px-12 sm:text-sm sm:rounded-lg sm:h-15 bg-navy-700 ga_openButtonLoser hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 css-8f0coi
        {!$userData
          ? 'border-red text-red glow-red hover:bg-red'
          : $userData.balance >= casePrice
          ? 'border-green text-green glow-pastelGreen hover:bg-green'
          : 'border-red text-red glow-red hover:bg-red'}"
        on:click="{handleRoll}"
        disabled="{loading || tooPoor}"
      >
        <span
          class="row-start-1 col-start-1 flex items-center justify-center transition duration-300 transform scale-50 opacity-0"
        >
          <svg
            viewBox="9 0 188.4 140.4"
            fill="none"
            class="block w-6 h-6 transform rotate-180 stroke-current -translate-y-2px sm:w-10 sm:h-10 text-pastelGreen css-9uqyfg"
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
        <span class="flex items-center col-start-1 row-start-1 transition-opacity duration-300">
          {#if loading}
            <Spinner size="1.5em" borderWidth=".25em" />
          {:else}
            {!$userData
              ? 'Zaloguj się aby otworzyć'
              : $userData.balance >= casePrice
              ? `Otwórz za ${casePrice.toFixed(2)}`
              : `Brak wystarczającego salda ${casePrice.toFixed(2)}`}
            <div class="flex items-center ml-2">
              {@html goldenNames.includes(data.websiteName)
                ? '<img src="/icons/gold-coin.png" class="w-3 h-3 ml-1">'
                : 'PLN'}
            </div>
          {/if}
        </span>
      </button>
    </div>
  </div>
</section>
