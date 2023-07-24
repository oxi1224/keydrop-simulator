<style>
  .upgrader-pointer-arrow {
    margin-top: -1px;
    width: 0px;
    height: 0px;
    border-color: currentcolor transparent transparent;
    border-style: solid;
    border-width: 18px 8px 8px;
    border-image: none 100% / 1 / 0 stretch;
    filter: drop-shadow(rgba(220, 174, 100, 0.8) 0px 0px 4px);
    transform-origin: 50% 480%;
  }
  .t-h2 {
    font-weight: 600;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .upgrader-mode-container {
    text-transform: lowercase;
  }

  .upgrader-mode-container::first-letter {
    text-transform: uppercase;
  }

  .upgraderResult {
    grid-area: center;
  }

  @media (min-width: 768px) {
    .upgraderResult {
      grid-area: initial;
    }
  }

  .upgraderGridTemplate {
    grid-template: 'center center' 'upgradeBtn upgradeBtn' 'userSkins userSkins' 'upgradeSkins upgradeSkins' 'options options' / 1fr 1fr;
  }

  @media (min-width: 768px) {
    .upgraderGridTemplate {
      grid-template: 'userSkins center upgradeSkins' 1fr 'options center upgradeBtn' / 1fr 1fr 1fr;
    }
  }
</style>

<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { createToast, convertPrice, type ItemWithGlobal, settings } from '$lib';
  import type { GlobalInventoryItem } from '@prisma/client';
  import { _ } from 'svelte-i18n';
  import UpgradeItemSelect from './components/UpgradeItemSelect.svelte';
  import UserItemSelect from './components/UserItemSelect.svelte';

  // Base Values
  export let availableItems: GlobalInventoryItem[];
  let selectedUpgradeItems: ItemWithGlobal[] = [];
  let selectedGoalItems: GlobalInventoryItem[] = [];
  let totalGoalValue = 0;
  let totalSelectedItemValue = 0;
  let addedBalance = 0;
  let totalSelectedValue = 0;

  // Upgrader function values
  let successChance = 0;
  let displaySuccessChance = 0;
  let upgraderMultiplier = 0;
  let balanceAddedChance = 0;
  let balanceInputMax = 0;
  let selectedMultiplier = 2;
  let minPrice = 0;

  // Upgrader animation values
  let selectedUpgraderMode: 'TRIANGLE' | 'CIRCLE' = 'TRIANGLE';
  let selectedUpgraderPosition: 'TOP' | 'BOT' = 'TOP';
  let upgraderRotation = 270;
  let upgraderArrowRotation = 0;
  const upgraderSvgColors = {
    base: '#dcae64',
    baseRGB: '220, 174, 100',
    loss: '#ff445d',
    lossRGB: '255, 68, 93',
    win: '#7fd919',
    winRGB: '127, 217, 25'
  };
  let upgraderSvgStroke = upgraderSvgColors.base;
  let upgraderSvgRGBcolor = upgraderSvgColors.baseRGB;

  // Misc
  let loading = false;
  let upgradeFinished = false;
  let upgraderWinPlayer: HTMLAudioElement;
  let upgraderLoosePlayer: HTMLAudioElement;
  let upgraderTickPlayer: HTMLAudioElement;

  function selectMultiplier(number: number, e: EventTarget & HTMLButtonElement) {
    selectedMultiplier = number;
    [...document.querySelectorAll('.multiplier-btn')].forEach((el) =>
      el.classList.remove('is-open')
    );
    e.classList.add('is-open');
  }

  function resetUpgrader() {
    if (upgradeFinished) {
      selectedGoalItems = [];
      selectedUpgradeItems = [];
      totalGoalValue = 0;
      totalSelectedItemValue = 0;
      addedBalance = 0;
      totalSelectedValue = 0;
      upgradeFinished = false;

      upgraderSvgStroke = upgraderSvgColors['base'];
      upgraderSvgRGBcolor = upgraderSvgColors['baseRGB'];
      document.getElementById('success-chance-display-wrapper')!.style.transform = 'rotateY(0deg)';
      document.getElementById('status-display-wrapper')!.style.transform = 'rotateY(180deg)';
      upgraderRotation = selectedUpgraderPosition === 'TOP' ? 270 : 90;
      upgraderArrowRotation = 0;
    }
  }
  function deselectUpgradeItem(...items: ItemWithGlobal[]) {
    resetUpgrader();
    for (const item of items) {
      const selectedIndex = selectedUpgradeItems.findIndex((i) => i.dropId == item.dropId);
      selectedUpgradeItems.splice(selectedIndex, 1);
      selectedUpgradeItems = selectedUpgradeItems;
      totalSelectedValue -= item.globalInvItem.skinPrice;
    }
  }

  function deselectGoalItem(...items: GlobalInventoryItem[]) {
    resetUpgrader();
    for (const item of items) {
      const selectedIndex = selectedGoalItems.findIndex((i) => i.id == item.id);
      selectedGoalItems.splice(selectedIndex, 1);
      selectedGoalItems = selectedGoalItems;
      availableItems = availableItems;
      totalGoalValue -= item.skinPrice;
    }
  }

  async function upgrade() {
    upgraderLoosePlayer.currentTime = 0;
    upgraderLoosePlayer.pause();
    upgraderWinPlayer.currentTime = 0;
    upgraderWinPlayer.pause();

    if (selectedUpgradeItems.length === 0 || selectedGoalItems.length === 0)
      return createToast({
        type: 'error',
        header: $_('error'),
        message: $_('toasts.error.messages.upgraderInvalidValues')
      });

    if (successChance > 81 || successChance < 0)
      return createToast({
        type: 'error',
        header: $_('error'),
        message: $_('toasts.error.messages.upgraderInvalidChance')
      });
    loading = true;
    const res = await fetch('/api/skins/upgrade', {
      method: 'POST',
      body: JSON.stringify({
        selectedItems: selectedUpgradeItems,
        goalItems: selectedGoalItems,
        addedBalance: addedBalance,
        position: selectedUpgraderPosition,
        mode: selectedUpgraderMode
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
    if (selectedUpgraderMode === 'TRIANGLE') upgraderArrowRotation = resBody.rotation;
    else upgraderRotation = resBody.rotation;
  
    await new Promise((r) => setTimeout(r, $settings.fastOpen ? 1500 : 3500));
    
    if (resBody.success) upgraderWinPlayer.play();
    else upgraderLoosePlayer.play();

    upgraderSvgStroke = upgraderSvgColors[resBody.success ? 'win' : 'loss'];
    upgraderSvgRGBcolor = upgraderSvgColors[resBody.success ? 'winRGB' : 'lossRGB'];

    document.querySelector('.status-display')!.textContent = resBody.success ? 'WIN' : 'LOSS';
    document.getElementById('success-chance-display-wrapper')!.style.transform = 'rotateY(180deg)';
    document.getElementById('status-display-wrapper')!.style.transform = 'rotateY(0deg)';

    deselectUpgradeItem(...selectedUpgradeItems);
    if (!resBody.success) deselectGoalItem(...selectedGoalItems);
    upgradeFinished = true;
    await invalidateAll();
    loading = false;
  }

  function setFastOpen(e: MouseEvent) {
    settings.update((o) => {
      const checked = (e.target as HTMLInputElement).checked;
      o.fastOpen = checked;
      return o;
    });
  }

  function setAudioMute() {
    settings.update((o) => {
      o.muteAudio = !o.muteAudio;
      console.log(o.muteAudio);
      return o;
    });
  }

  // Upgrader functionality
  $: totalSelectedValue = totalSelectedItemValue + addedBalance;
  $: upgraderMultiplier = roundToTwoDecimal(totalGoalValue / totalSelectedValue);
  $: successChance = roundToTwoDecimal((100 / (totalGoalValue / totalSelectedValue)) * 0.9);
  $: balanceAddedChance = roundToTwoDecimal((100 / (totalGoalValue / addedBalance)) * 0.9);
  $: skinAddedChance = roundToTwoDecimal(
    (100 / (totalGoalValue / (totalSelectedValue - addedBalance))) * 0.9
  );
  $: balanceInputMax =
    Math.min($page.data.user?.balance ?? 0, totalGoalValue * 0.9 - totalSelectedItemValue) || 0;
  $: displaySuccessChance = successChance;
  $: successChance > 80 && isFinite(successChance) && successChance
    ? (displaySuccessChance = 80)
    : null;
  $: upgraderRotation = selectedUpgraderPosition === 'TOP' ? 270 : 90;
  $: totalGoalValue < 0 ? (totalGoalValue = 0) : null;

  // Misc
  $: minPrice = (totalSelectedValue - addedBalance) * selectedMultiplier;
  $: totalSelectedItemValue = selectedUpgradeItems.reduce(
    (total, i) => (total += i.globalInvItem.skinPrice),
    0
  );

  function roundToTwoDecimal(number: number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }
</script>

<div
  id="upgrader-root"
  style="background: url(/images/upgrader-bg.webp) center top / 100% auto no-repeat"
>
  <audio bind:this="{upgraderWinPlayer}" src="/audio/upgrader-win.mp3"></audio>
  <audio bind:this="{upgraderLoosePlayer}" src="/audio/upgrader-loose.mp3"></audio>
  <audio bind:this="{upgraderTickPlayer}" src="/audio/upgrader-tick.mp3"></audio>
  <div class="container pb-10 md:pb-16 mx-auto">
    <main>
      <header class="grid items-center grid-cols-3 py-12">
        <a
          href="/"
          class="flex items-center transition-colors duration-200 hover:text-white uppercase font-semibold text-gray-500"
        >
          <svg class="w-3 h-3 mr-2 md:w-4 md:h-4 md:mr-3">
            <use xlink:href="/icons/icons.svg#arrow-left"></use>
          </svg>
          <span class="pt-px leading-none">
            <span class="md:hidden">{$_('upgrader.return')}</span>
            <span class="hidden md:inline">{$_('upgrader.goToHomePage')}</span>
          </span>
        </a>
        <h2 class="text-center text-white t-h2">UPGRADER</h2>
        <div class="flex items-center justify-end">
          <button
            class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg font-bold text-white border-navy-100 bg-navy-550 js-sound-btn {$settings.muteAudio
              ? 'brightness-75'
              : ''}"
            aria-label="Wyłącz dźwięk"
            on:click="{() => setAudioMute()}"
          >
            <svg viewBox="-10 0 130 120" class="block w-4 h-4 fill-current">
              <path
                fill="currentColor"
                stroke="currentColor"
                stroke-width="10"
                d="M9.6 34.1c-2.5 0-4.6 0.9-6.4 2.7 -1.7 1.7-2.6 3.8-2.6 6.3v33.8c0 2.5 0.9 4.7 2.6 6.5C5 85 7.1 85.8 9.6 85.8h17.9l39.8 30.4V3.7L27.5 34.1H9.6"
                class="css-qeu6t3"
              ></path>
              <path
                class="vol"
                d="M84.9 29.3l-7.8 8.2c6.5 6.5 9.8 14 9.8 22.5s-3.3 16-9.8 22.5l7.8 8.3C93.7 82 98 71.8 98 60S93.7 38 84.9 29.3"
                style="transform-origin: 0px 0px 0px; opacity: 1;"
                data-svg-origin="77.0999984741211 29.299999237060547"
                transform="matrix(1,0,0,1,0,0)"
              ></path>
              <path
                class="vol"
                d="M99.5 15L92 22.8c10.5 10.5 15.8 22.9 15.8 37.2 0 14.7-5.3 27.1-15.8 37.1l7.5 8.3C112.5 92.9 119 77.8 119 60 119 42.2 112.5 27.2 99.5 15z"
                style="transform-origin: 0px 0px 0px; opacity: 1;"
                data-svg-origin="92 15"
                transform="matrix(1,0,0,1,0,0)"
              ></path>
            </svg>
          </button>
          <label
            class="flex w-fit ml-2 cursor-pointer relative justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg font-bold text-white border-navy-100 bg-navy-550 {$settings.fastOpen
              ? ''
              : 'brightness-75'}"
          >
            <input
              type="checkbox"
              id="fast-open"
              name="fast-open"
              class="absolute opacity-0 cursor-pointer h-0 w-0"
              checked="{$settings.fastOpen}"
              on:click="{(e) => setFastOpen(e)}"
            />
            <svg class="block w-4 h-4"><use xlink:href="/icons/icons.svg#lightning"></use></svg>
          </label>
        </div>
      </header>
      <div class="grid gap-3 sm:gap-5 lg:gap-0 upgraderGridTemplate">
        <div
          class="flex flex-col rounded-l-lg rounded-r-lg lg:mt-10 lg:rounded-r-none bg-navy-800 relative"
          style="grid-area: userSkins; background-image: radial-gradient(rgba(255, 255, 255, 0.08) 3%, transparent)"
        >
          <div
            class="absolute flex w-11/12 flex-wrap justify-center items-center gap-2 h-fit z-20 inset-0 m-auto mt-8 md:mt-auto"
          >
            {#each selectedUpgradeItems as item}
              <img
                on:click="{() => deselectUpgradeItem(item)}"
                on:keydown="{null}"
                class="w-1/6 md:w-1/5 cursor-pointer"
                src="{item.globalInvItem.skinImgSource}"
                alt=""
              />
            {/each}
          </div>
          <div class="p-3 pb-0 my-auto sm:p-6 sm:pb-0 h-[220px]">
            <img
              src="/images/item-placeholder.webp"
              alt=""
              class="block object-contain w-3/5 h-full mx-auto mt-6 pointer-events-none"
              style="filter: brightness(1.2);"
            />
          </div>
          <div
            class="flex flex-col items-center pb-3 text-center md:flex-row md:pb-6 md:pl-6 md:text-left"
          >
            <div class="pr-1">
              <div class="flex">
                <p class="font-bold text-sm md:text-base lg:text-lg leading-tight text-gold">
                  {$_('upgrader.chooseItem')}
                </p>
              </div>
              <p class="text-xs leading-tight sm:text-sm text-navy-300">
                {$_('upgrader.upgradeItem')}
              </p>
            </div>
            <div
              class="px-5 py-3 mt-3 text-center rounded-lg md:mt-0 md:rounded-r-none md:ml-auto bg-navy-900 md:text-right"
            >
              <div class="text-lg font-bold leading-none text-white whitespace-nowrap">
                <span>{convertPrice($page.data.currency, totalSelectedValue - addedBalance)}</span>
              </div>
              <div class="text-xs font-bold leading-none text-gold">
                <span>
                  +{!skinAddedChance || !isFinite(skinAddedChance)
                    ? 0
                    : skinAddedChance.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col rounded-l-lg rounded-r-lg lg:mt-10 lg:rounded-l-none bg-navy-800 relative"
          style="grid-area: upgradeSkins; background-image: radial-gradient(rgba(255, 255, 255, 0.08) 3%, transparent);"
        >
          <div
            class="absolute flex w-11/12 flex-wrap justify-center items-center gap-2 h-fit z-20 inset-0 m-auto mt-8 md:mt-auto"
          >
            {#each selectedGoalItems as item}
              <img
                on:click="{() => deselectGoalItem(item)}"
                on:keydown="{null}"
                class="w-1/6 md:w-1/5 cursor-pointer"
                src="{item.skinImgSource}"
                alt=""
              />
            {/each}
          </div>
          <div class="p-3 pb-0 my-auto sm:p-6 sm:pb-0 h-[220px]">
            <img
              src="/images/item-placeholder.webp"
              alt=""
              class="block object-contain w-3/5 h-full mx-auto mt-6 pointer-events-none"
              style="filter: brightness(1.2);"
            />
          </div>
          <div
            class="flex flex-col items-center pb-3 text-center md:flex-row md:pb-6 md:pr-6 md:text-right"
          >
            <div
              class="order-2 px-5 py-3 mt-3 text-center rounded-lg md:mt-0 md:rounded-l-none md:mr-auto bg-navy-900 md:text-left md:order-1"
            >
              <div class="text-lg font-bold leading-none text-white whitespace-nowrap">
                <span>{convertPrice($page.data.currency, totalGoalValue)}</span>
              </div>
              <div class="text-xs font-bold leading-none text-gold">
                <span>
                  {!upgraderMultiplier || !isFinite(upgraderMultiplier) ? 0 : upgraderMultiplier}x
                </span>
              </div>
            </div>
            <div class="order-1 pl-1 md:order-2">
              <p class="font-bold text-sm md:text-base lg:text-lg leading-tight text-gold">
                {$_('upgrader.chooseItem')}
              </p>
              <p class="text-xs leading-tight sm:text-sm text-navy-300">
                {$_('upgrader.receiveItem')}
              </p>
            </div>
          </div>
        </div>
        <div
          id="upgraderResult"
          class="z-10 flex flex-col items-center w-full justify-center rounded-lg select-none bg-navy-800 upgraderResult"
          style="box-shadow: rgba(0, 0, 0, 0.46) 0px 5px 20px;"
        >
          <div
            class="relative flex-1 mt-12 mb-8 border-2 border-current border-solid rounded-full"
            style="color: rgb({upgraderSvgRGBcolor}); width: 40%; min-width: 250px; box-shadow: rgba({upgraderSvgRGBcolor}, 0.7) 0px 0px 5px, rgba{upgraderSvgRGBcolor}, 0.7) 0px 0px 7px inset;"
          >
            <div class="pt-[100%]"></div>
            <div
              class="absolute border border-solid rounded-full border-navy-500 w-[94%] h-[94%] top-[3%] left-[3%]"
            ></div>
            <div
              class="absolute bg-current w-[1px] h-[10px] top-[-6px] left-[50%]"
              style="box-shadow: rgba({upgraderSvgRGBcolor}, 0.7) 0px 0px 6px 1px"
            ></div>
            <div
              class="absolute bg-current w-[10px] h-[1px] top-[50%] right-[-6px]"
              style="box-shadow: rgba{upgraderSvgRGBcolor}, 0.7) 0px 0px 6px 1px"
            ></div>
            <div
              class="absolute bg-current w-[1px] h-[10px] bottom-[-6px] left-[50%]"
              style="box-shadow: rgba({upgraderSvgRGBcolor}, 0.7) 0px 0px 6px 1px"
            ></div>
            <div
              class="absolute bg-current w-[10px] h-[1px] top-[50%] left-[-6px]"
              style="box-shadow: rgba({upgraderSvgRGBcolor}, 0.7) 0px 0px 6px 1px"
            ></div>
            <div class="absolute top-0 left-0 z-10 flex justify-center w-full h-full">
              <div
                class="upgrader-spin-triangle upgrader-pointer-arrow"
                style="transition: transform {$settings.fastOpen
                  ? '1500ms'
                  : '3500ms'}; transform: rotate({upgraderArrowRotation}deg);"
              ></div>
            </div>
            <div class="absolute top-0 left-0 z-10 w-full h-full p-5">
              <div
                class="relative flex items-center justify-center w-full h-full text-center border border-current border-solid rounded-full upgrader-spin-circle"
                style="perspective: 400px; box-shadow: rgba({upgraderSvgRGBcolor}, 0.7) 0px 0px 5px, rgba({upgraderSvgRGBcolor}, 0.7) 0px 0px 7px inset;"
              >
                <svg
                  viewBox="0 0 100 100"
                  class="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none"
                  style="transition: transform {$settings.fastOpen
                    ? '1500ms'
                    : '3500ms'}; transform: rotate({upgraderRotation}deg);"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="50"
                    fill="none"
                    stroke-width="100"
                    stroke-dasharray="313.7 313.7"
                    stroke-dashoffset="{isNaN(displaySuccessChance) ||
                    !isFinite(displaySuccessChance)
                      ? 313.7
                      : 313.7 - 313.7 * (displaySuccessChance / 100)}"
                    stroke="{upgraderSvgStroke}"
                    opacity="0.15"
                    style="transition: stroke-dashoffset 0.5s ease-out 0s;"
                  ></circle>
                </svg>
                <!-- <svg
                  viewBox="0 0 100 100"
                  class="pointer-events-none absolute left-0 top-0 h-full w-full rounded-full transition-transform duration-700"
                  style="transform: rotate(-450deg);"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="50"
                    fill="none"
                    stroke-width="100"
                    stroke-dasharray="313.7 313.7"
                    stroke-dashoffset="313.7"
                    stroke="#ff445d"
                    opacity="0.15"
                    class="css-4x9phn"
                  ></circle>
                </svg> -->
                <div style="height: 80%; width: 80%; transform-style: preserve-3d;">
                  <div
                    id="success-chance-display-wrapper"
                    class="absolute flex flex-col items-center justify-center w-full h-full rounded-full transition-transform duration-150"
                    style="transform: rotateX(0deg); backface-visibility: hidden; background-image: radial-gradient(rgb(17, 17, 20), rgba(17, 17, 20, 0.5));"
                  >
                    <div class="text-4xl font-bold leading-none text-white">
                      <span>
                        {isNaN(displaySuccessChance) || !isFinite(displaySuccessChance)
                          ? 0
                          : displaySuccessChance}%
                      </span>
                    </div>
                    <div class="mt-1 text-sm leading-none text-navy-300">Upgrade chance</div>
                  </div>
                  <div
                    id="status-display-wrapper"
                    class="absolute z-10 flex flex-col items-center justify-center w-full h-full border-4 border-current border-solid rounded-full transition-transform duration-150"
                    style="transform: rotateY(180deg); backface-visibility: hidden; background-image: radial-gradient(rgb(17, 17, 20), rgba(17, 17, 20, 0.5));"
                  >
                    <div class="text-3xl font-bold leading-none status-display"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-8">
            <div class="relative">
              <svg viewBox="0 0 234.5066 50.7309" class="block mx-auto" style="width: 230px;">
                <path
                  fill="none"
                  stroke="#31303e"
                  stroke-width="1"
                  stroke-miterlimit="10"
                  d="M76.7533,38.7536c-34.9199-2.3026-59.2692-7.4914-59.2692-13.5234c0-8.1699,44.6682-14.7929,99.7693-14.7929c55.101,0,99.7692,6.623,99.7692,14.7929c0,6.032-24.3493,11.2208-59.2692,13.5234"
                ></path>
                <path
                  fill="none"
                  stroke="#dcae64"
                  stroke-width="1"
                  stroke-miterlimit="10"
                  d="M76.7533,48.2309C32.3526,44.7684,0.7087,35.7769,0.7087,25.2303c0-13.5428,52.1788-24.5216,116.5446-24.5216S233.798,11.6875,233.798,25.2303c0,10.5466-31.6439,19.5381-76.0446,23.0006"
                ></path>
                <g fill="#dcae64">
                  <path
                    d="M157.7534,45.7309c1.3806,0,2.5,1.1193,2.5,2.5001c0,1.3807-1.1194,2.4999-2.5,2.4999c-1.3808,0-2.5-1.1192-2.5-2.4999C155.2534,46.8502,156.3726,45.7309,157.7534,45.7309z"
                  ></path>
                  <path
                    d="M76.7533,45.7309c1.3808,0,2.5,1.1193,2.5,2.5001c0,1.3807-1.1192,2.4999-2.5,2.4999c-1.3807,0-2.5-1.1192-2.5-2.4999C74.2533,46.8502,75.3726,45.7309,76.7533,45.7309z"
                  ></path>
                </g>
              </svg>
              <div
                class="absolute text-base font-semibold text-center text-white"
                style="width: 120px; top: 28%; left: calc(50% - 60px);"
              >
                <span>{convertPrice($page.data.currency, totalSelectedValue)}</span>
              </div>
              <div
                class="absolute text-sm text-center text-navy-300"
                style="width: 120px; top: 73%; left: calc(50% - 60px);"
              >
                Balance
              </div>
            </div>
          </div>
          <div
            class="flex flex-col justify-center p-5 mt-auto tracking-wider rounded-lg sm:px-6 bg-navy-900 transition-opacity duration-300 self-stretch sm:h-[85px]"
          >
            <div class="flex items-baseline -mt-1">
              <span class="text-xs leading-none text-white uppercase">Use balance</span>
              <div class="ml-auto">
                <span class="text-xs font-bold leading-none text-gold">
                  {!balanceAddedChance || !isFinite(balanceAddedChance) ? 0 : balanceAddedChance}%
                </span>
                <span class="ml-1 font-bold leading-none text-white">
                  / {convertPrice($page.data.currency, addedBalance)}
                </span>
              </div>
            </div>
            <div style="position: relative;" class="flex items-center h-8 mt-1 sm:h-5">
              <input
                class="w-full"
                type="range"
                min="{0}"
                step="{parseFloat((balanceInputMax / 10000).toFixed(2))}"
                max="{parseFloat(balanceInputMax.toFixed(2))}"
                disabled="{!$page.data.user?.balance}"
                bind:value="{addedBalance}"
              />
            </div>
          </div>
        </div>
        <div
          id="upgraderOptions"
          class="grid grid-cols-4 row-start-2 gap-3 lg:pt-10 lg:px-10"
          style="grid-area: options;"
        >
          <button
            on:click="{(e) => selectMultiplier(1.5, e.currentTarget)}"
            disabled="{!successChance || successChance <= 0 || loading}"
            class="multiplier-btn text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent is-open:font-bold is-open:text-white is-open:border-navy-100 is-open:bg-navy-550"
          >
            1.5x
          </button>
          <button
            on:click="{(e) => selectMultiplier(2, e.currentTarget)}"
            disabled="{!successChance || successChance <= 0 || loading}"
            class="multiplier-btn is-open text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent is-open:font-bold is-open:text-white is-open:border-navy-100 is-open:bg-navy-550"
          >
            2x
          </button>
          <button
            on:click="{(e) => selectMultiplier(5, e.currentTarget)}"
            disabled="{!successChance || successChance <= 0 || loading}"
            class="multiplier-btn text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent is-open:font-bold is-open:text-white is-open:border-navy-100 is-open:bg-navy-550"
          >
            5x
          </button>
          <button
            on:click="{(e) => selectMultiplier(10, e.currentTarget)}"
            disabled="{!successChance || successChance <= 0 || loading}"
            class="multiplier-btn text-navy-200 flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg hover:text-white border-navy-500 hover:border-navy-300 bg-transparent is-open:font-bold is-open:text-white is-open:border-navy-100 is-open:bg-navy-550"
          >
            10x
          </button>
          <button
            class="col-span-2 h-10 text-navy-200 focus:outline-none disabled:pointer-events-none disabled:opacity-25"
            disabled="{true}"
            on:click="{() =>
              (selectedUpgraderMode = selectedUpgraderMode === 'TRIANGLE' ? 'CIRCLE' : 'TRIANGLE')}"
          >
            <div class="h-full w-full">
              <div
                class="flex h-full w-full items-center justify-center rounded-lg border border-solid border-navy-500 bg-navy-800 px-4 text-center text-sm transition-all duration-300"
              >
                <svg
                  viewBox="0 0 50 50"
                  fill="none"
                  stroke-width="3"
                  class="mr-1 h-5 w-5 stroke-current {selectedUpgraderMode === 'TRIANGLE'
                    ? 'hidden'
                    : ''}"
                >
                  <circle cx="25" cy="25" r="14"></circle>
                </svg>
                <svg
                  viewBox="0 0 50 50"
                  fill="none"
                  stroke-width="3"
                  class="mr-1 h-5 w-5 stroke-current {selectedUpgraderMode === 'TRIANGLE'
                    ? ''
                    : 'hidden'}"
                >
                  <polygon points="10,14 40,14 25,39"></polygon>
                </svg>
                <span class="upgrader-mode-container">{selectedUpgraderMode}</span>
                mode
              </div>
            </div>
          </button>
          <button
            class="col-span-2 h-10 text-navy-200 focus:outline-none disabled:pointer-events-none disabled:opacity-25"
            disabled="{!successChance || successChance <= 0 || loading}"
            on:click="{() =>
              (selectedUpgraderPosition = selectedUpgraderPosition === 'TOP' ? 'BOT' : 'TOP')}"
          >
            <div class="h-full w-full">
              <div
                class="flex h-full w-full items-center justify-center rounded-lg border border-solid border-navy-500 bg-navy-800 px-4 text-center text-sm transition-all duration-300"
              >
                <svg
                  class="mr-2 h-1/4 aspect-square transition-transform duration-500 {selectedUpgraderPosition ===
                  'TOP'
                    ? ''
                    : 'rotate-180'}"
                >
                  <use xlink:href="/icons/icons.svg#full-arrow-down"></use>
                </svg>
                Roll
              </div>
            </div>
          </button>
        </div>
        <div class="col-start-3 row-start-2 lg:pt-10 lg:px-10" style="grid-area: upgradeBtn;">
          <button
            class="h-full text-lg font-semibold rounded-lg bg-gold w-full px-[2.5em] pt-8 pb-7 uppercase hover:bg-gold-600 hover:shadow-lg disabled:bg-white disabled:bg-opacity-10 disabled:!shadow-none"
            style="box-shadow: rgba(220, 174, 100, 0.5) 0px 0px 10px;"
            disabled="{!successChance || successChance > 81 || successChance <= 0 || loading}"
            on:click="{upgrade}"
          >
            Upgrade
          </button>
        </div>
      </div>
      <div class="grid gap-5 mt-3 sm:mt-5 lg:mt-10 lg:grid-cols-2">
        <UserItemSelect
          bind:selectedUpgradeItems="{selectedUpgradeItems}"
          on:upgrade-item-select="{resetUpgrader}"
        />
        <UpgradeItemSelect
          availableItems="{availableItems}"
          minPrice="{minPrice}"
          bind:selectedGoalItems="{selectedGoalItems}"
          bind:totalGoalValue="{totalGoalValue}"
          on:goal-item-select="{resetUpgrader}"
        />
      </div>
    </main>
  </div>
</div>
