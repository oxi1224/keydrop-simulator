<script lang="ts">
  import { colors, goldenNames, type CaseData, type CaseDrop } from '$lib';
  export let caseItems: CaseDrop[] = [];
  export let multipleCaseItems: CaseDrop[][] = [];
  export let data: CaseData;
  export let caseCount = 1;
  export let casePrice = data.price;

  generateRollItems(caseCount);
  function generateRollItems(rouletteCount: number) {
    caseItems = [];
    multipleCaseItems = [];
    if (rouletteCount === 1) {
      for (let i = 0; i < 60; i++) {
        const roll = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
        const item = data.drops.find(
          (obj) => obj.dropDetails.range[0] <= roll && obj.dropDetails.range[1] >= roll
        );
        if (!item) continue;
        caseItems.push(item);
      }
    } else {
      for (let i = 0; i < rouletteCount; i++) {
        const rollItems: CaseDrop[] = [];
        for (let itemI = 0; itemI < 60; itemI++) {
          const roll = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
          const item = data.drops.find(
            (obj) => obj.dropDetails.range[0] <= roll && obj.dropDetails.range[1] >= roll
          );
          if (!item) continue;
          rollItems.push(item);
        }
        multipleCaseItems.push(rollItems);
      }
    }
  }

  export function changeRouletteCount(rollCount: number) {
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
    caseCount = rollCount;
    btnOverlay!.style.left = `${20 * (caseCount - 1)}%`;
    casePrice = Math.round(data.price * caseCount * 100) / 100;
    generateRollItems(caseCount);
  }
</script>

<section class="mt-1 mb-8 container mx-auto" style="max-width: 1480px;">
  <div class="relative">
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
        <ul class="flex w-full h-full CaseRolls-row">
          {#each caseItems as item}
            <li
              class="flex-shrink-0 flex h-full min-w-0 relative case-item"
              style="width: 14.2857%; background-image: {colors.gradient[item.skinRarity]};"
            >
              <img src="{item.skinImgSource}" alt="" class="object-contain mx-auto w-4/5 h-full" />
              <div
                class="absolute bottom-0 left-0 w-full p-2 -mb-1 font-semibold leading-tight uppercase md:p-5"
              >
                <div class="truncate text-navy-200 css-1vba4yg">{item.skinName}</div>
                <div class="font-bold text-white truncate" title="{item.skinWeapon} ">
                  {item.skinWeapon}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="flex absolute top-0 left-0 w-full h-full css-1ubc7bb">
        {#each multipleCaseItems as caseItemsArray}
          <div
            style="width: {(1 / caseCount) * 100}%;"
            class="CaseRolls-roll flex-shrink-0 h-full will-change-transform border-r border-dashed border-navy-550"
          >
            {#each caseItemsArray as caseItem}
              <div
                class="CaseRolls-skin w-full h-auto my-5 lg:h-full lg:my-0 css-1hmgmgm flex items-center justify-center relative"
              >
                <img
                  alt=""
                  class="object-contain absolute mx-auto w-1/2"
                  src="{colors.itemBg[caseItem.skinRarity]}"
                />
                <img
                  src="{caseItem.skinImgSource}"
                  alt=""
                  class="block object-contain w-1/2 h-full z-10"
                />
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="grid w-full px-2 mt-6 sm:mt-8 sm:w-auto">
    <div
      class="col-start-1 row-start-1 transition duration-1000 ease-out transform opacity-0 pointer-events-none translate-y-5"
    >
      <div
        class="grid gap-2 mx-auto mb-4 sm:gap-4 md:gap-8 sm:mb-6 grid-cols-2 max-w-5xl css-15mnzd9"
      >
        <button
          class="flex items-center justify-center h-10 font-bold leading-tight text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:rounded-lg text-2xs sm:text-sm md:w-15 sm:h-15 border-gray text-gray bg-navy-700 hover:bg-gray hover:bg-opacity-5 active:bg-opacity-15 active:duration-0"
        >
          <svg class="flex-shrink-0 w-3 h-3 mr-2 sm:mr-3 md:mr-0 sm:w-5 sm:h-5">
            <use xlink:href="/icons/icons.svg#arrow-left"></use>
          </svg>
          <span class="md:hidden">Wróć</span>
        </button>
        <button
          class="flex items-center justify-center h-10 px-3 font-bold leading-tight text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 border-red text-red bg-navy-700 hover:bg-red hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 glow-red"
        >
          <svg class="flex-shrink-0 w-3 h-3 mr-2 sm:mr-3 sm:w-5 sm:h-5 css-rvhfxd">
            <use xlink:href="/icons/icons.svg#try-again"></use>
          </svg>
          Otwórz ponownie
        </button>
        <button
          class="flex items-center justify-center h-10 px-3 font-bold text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 bg-navy-700 hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 ga_sellButtonLoser text-gold hover:bg-gold glow-gold border-gold pointer-events-none"
        >
          <svg class="flex-shrink-0 w-3 h-4 mr-2 sm:mr-3 sm:w-5 sm:h-6 css-rvhfxd">
            <use xlink:href="/icons/icons.svg#sell"></use>
          </svg>
        </button>
        <a
          href="/skins/Upgrader?"
          class="flex items-center justify-center h-10 px-3 font-bold leading-tight text-center uppercase transition-colors duration-200 border border-solid rounded-md sm:px-8 sm:rounded-lg text-2xs sm:text-sm md:px-12 sm:h-15 border-teal text-teal bg-navy-700 hover:bg-teal hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 glow-teal ga_upgradeButtonLoser"
        >
          <svg class="flex-shrink-0 w-3 h-3 mr-2 sm:mr-3 sm:w-5 sm:h-5 css-vhe3yc">
            <use xlink:href="/icons/icons.svg?38#upgrader"></use>
          </svg>
          Ulepszenia
        </a>
      </div>
      <p class="text-xs text-center text-navy-200">
        Możesz wycofać te skiny w zakładce <a
          class="text-red underline hover:text-white transition-colors duration-200"
          href="/panel/profil?p=my_winner"
        >
          Moje Konto
        </a>
      </p>
    </div>
    <div
      class="w-full md:w-auto grid col-start-1 row-start-1 gap-2 sm:gap-4 md:gap-8 transition duration-1000 ease-out transform mx-auto grid-cols-2"
    >
      <div class="relative flex h-10 sm:h-15">
        <div
          style="left: 0;"
          class="absolute top-0 h-full py-6 z-10 border border-solid transition-all duration-700 -ml-px will-change-transform border-pastelGreen css-1ti3c59"
        ></div>
        <button
          on:click="{() => changeRouletteCount(1)}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 rounded-l text-navy-200 sm:rounded-l-lg ml-0 case-count-selected-btn hover:text-white hover:bg-navy-600"
        >
          1
        </button>
        <button
          on:click="{() => changeRouletteCount(2)}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px text-navy-200 hover:text-white hover:bg-navy-600"
        >
          2
        </button>
        <button
          on:click="{() => changeRouletteCount(3)}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px text-navy-200 hover:text-white hover:bg-navy-600"
        >
          3
        </button>
        <button
          on:click="{() => changeRouletteCount(4)}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px text-navy-200 hover:text-white hover:bg-navy-600"
        >
          4
        </button>
        <button
          on:click="{() => changeRouletteCount(5)}"
          class="case-count-btn flex-1 flex sm:px-6 py-6 justify-center items-center h-full w-full text-center font-bold text-xs sm:text-sm leading-tight bg-navy-700 border border-solid border-navy-500 transition-colors duration-200 -ml-px rounded-r sm:rounded-r-lg text-navy-200 hover:text-white hover:bg-navy-600"
        >
          5
        </button>
      </div>
      <a
        href="https://key-drop.com/pl/panel/profil/deposit-money"
        target="_blank"
        class="grid items-center justify-center py-6 h-10 grid-cols-1 grid-rows-1 text-xs font-bold uppercase transition-colors duration-200 border border-solid rounded justify-items-center sm:px-12 sm:text-sm sm:rounded-lg sm:h-15 bg-navy-700 ga_openButtonLoser border-red-500 text-red-500 glow-red hover:bg-red hover:bg-opacity-5 active:bg-opacity-15 active:duration-0 css-8f0coi"
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
          Dodaj środki aby otworzyć <div class="flex items-center ml-2">
            {casePrice}
            {@html goldenNames.includes(data.websiteName)
              ? '<img src="https://key-drop.com/web/KD/static/images/gold-coin.png?v48" class="w-3 h-3 ml-1">'
              : 'PLN'}
          </div>
        </span>
      </a>
    </div>
  </div>
</section>
