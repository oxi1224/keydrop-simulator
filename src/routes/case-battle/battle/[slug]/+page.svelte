<script lang="ts">
  import { page } from '$app/stores';
  import CaseBattleHeader from '$components/case-battle/CaseBattleHeader.svelte';
  import { convertPrice, type ParsedCaseBattle, settings, sleep, createToast } from '$lib';
  import { io } from 'socket.io-client';
  import type { PageData } from './$types';
  import { beforeNavigate, goto } from '$app/navigation';
  import type { CaseDrop } from '@prisma/client';
  import { browser } from '$app/environment';
  import CaseBattlePanels from '$components/case-battle/CaseBattlePanels.svelte';
  import CaseBattleMobilePanels from '$components/case-battle/CaseBattleMobilePanels.svelte';
  import { _ } from 'svelte-i18n';
  import Spinner from '$components/util/Spinner.svelte';

  const WINNING_ITEM = 35;
  const ROLL_DURATION = 3500;

  export let data: PageData;
  let caseBattleData: ParsedCaseBattle = data.battleData as any;
  let players = caseBattleData.players;
  let startBattle = caseBattleData.finished;
  let currentRound = 0;
  let visibleRound = 0;
  let visibleItems = 0;
  let countdownContent = 3;
  let winningPositions: number[] = [];
  let winnerPos = caseBattleData.winner;
  let battleOwner = caseBattleData.owner;
  let screenSize: number;
  const battleMode = caseBattleData.mode as 'underdog' | 'classic';
  const wonItems: { [key: number]: CaseDrop[] } = Object.fromEntries(
    Object.entries(caseBattleData.drops).map(([key, drops]) => [
      parseInt(key),
      drops.map((d: CaseDrop[]) => d[WINNING_ITEM])
    ])
  );

  let checkPlayer: HTMLAudioElement;
  let countdownPlayer: HTMLAudioElement;
  let battleStartPlayer: HTMLAudioElement;
  let battleFinalePlayer: HTMLAudioElement;

  $: {
    if (browser) {
      checkPlayer = new Audio('/audio/caseBattleCheck.mp3');
      countdownPlayer = new Audio('/audio/caseBattleCountdown.webm');
      battleStartPlayer = new Audio('/audio/caseBattleStart.mp3');
      battleFinalePlayer = new Audio('/audio/caseBattleFinale.webm');
    }
  }

  const socket = io({ query: { battleID: caseBattleData.id } });

  socket.on('caseBattlePlayerUpdate', (newPlayers) => {
    players = newPlayers;
    caseBattleData = caseBattleData;
  });

  socket.on('redirect', (url) => {
    goto('/' + url); // Make sure the url is within domain
  });

  socket.on('caseBattleStateChange', (state, pos) => {
    startBattle = state;
    winnerPos = pos;
  });

  socket.on('caseBattleOwnerUpdate', (id) => {
    battleOwner = id;
  });

  socket.on('error', (header, messageKey, type) => {
    createToast({
      header: $_(header),
      message: $_(messageKey),
      type: type
    });
  });

  let showAwardInfo = false;
  let showRoulettes = false;
  let showCountdown = false;
  let battleAnimationOver = false;
  let rollAnimationOver = false;
  let stopRolling = false;

  async function startBattleAnimation() {
    battleAnimationOver = false;
    rollAnimationOver = false;
    if (!$settings.muteAudio) countdownPlayer.play();

    const interval = setInterval(() => (countdownContent -= 1), 1000);
    await sleep(3000);

    if (!$settings.muteAudio) {
      countdownPlayer.pause();
      countdownPlayer.currentTime = 0;
    }
    clearInterval(interval);
    showCountdown = false;

    while (startBattle && visibleRound < caseBattleData.totalCases) {
      if (stopRolling) return;
      [...document.querySelectorAll('.display-case')].forEach((elm, i) => {
        elm.classList.remove('inactive-case-display');
        if (i !== currentRound) elm.classList.add('inactive-case-display');
      });

      showRoulettes = true;
      [...document.querySelectorAll('div.CaseRolls-roll')!].forEach((elm) => {
        elm.getAnimations().forEach((anim) => anim.cancel());
      });
      visibleRound += 1;
      await playRollAnimation();
      visibleItems += 1;
      showAwardInfo = true;
      await sleep(1000);
      showAwardInfo = false;
      showRoulettes = false;
      await sleep(200);
      if (currentRound + 1 !== caseBattleData.totalCases) currentRound += 1;
    }
    rollAnimationOver = true;
    [...document.querySelectorAll('.display-case')].forEach((elm) =>
      elm.classList.remove('inactive-case-display')
    );
    if (winningPositions.length !== 1) await sleep(2500);
    if (!$settings.muteAudio && !stopRolling) {
      checkPlayer.load();
      battleFinalePlayer.play();
    }
    battleAnimationOver = true;
  }

  export async function playRollAnimation() {
    if (!$settings.muteAudio) {
      battleStartPlayer.load();
      battleStartPlayer.play();
    }

    const easing = 'cubic-bezier(.1,.8,.01,1)';
    let interval;
    const roulettes = [...document.querySelectorAll('.CaseBattleDisplayRoll-wheel')!];
    roulettes.forEach((roulette) => {
      roulette.animate(
        [
          { transform: 'translate3d(0px, 0px, -1698.91px) rotateX(0deg)' },
          { transform: `translate3d(0px, 0px, -1698.91px) rotateX(175deg)` },
          { transform: `translate3d(0px, 0px, -1698.91px) rotateX(370deg)` }
        ],
        {
          iterations: 1,
          duration: ROLL_DURATION,
          easing: easing,
          fill: 'forwards'
        }
      );
    });
    await sleep(ROLL_DURATION);
    clearInterval(interval);
    if (!$settings.muteAudio) {
      checkPlayer.load();
      checkPlayer.play();
    }
  }

  let loading = false;
  async function createSameBattle() {
    loading = true;
    console.log(caseBattleData.public ? 'public' : 'private');
    const res = await fetch('/api/case-battle/create', {
      method: 'POST',
      body: JSON.stringify({
        cases: caseBattleData.caseData.map((c) => ({ caseName: c.urlName, count: c.count })),
        playerCount: caseBattleData.playerCount,
        publicMode: caseBattleData.public ? 'public' : 'private',
        mode: caseBattleData.mode
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

  function resetAudio() {
    stopRolling = true;
    checkPlayer.pause();
    countdownPlayer.pause();
    battleStartPlayer.pause();
    battleFinalePlayer.pause();
  }

  beforeNavigate(() => resetAudio());

  function setAudioMute() {
    settings.update((o) => {
      o.muteAudio = !o.muteAudio;
      console.log(o.muteAudio);
      return o;
    });
  }

  $: startBattle && browser ? startBattleAnimation() : null;
  $: startBattle ? socket.disconnect() : null;
  $: {
    const playerStats: { [key: number]: number } = {};

    for (const [pos, drops] of Object.entries(wonItems)) {
      playerStats[parseInt(pos)] = drops.reduce((t, d, i) => {
        if (i < visibleItems) t += d.skinPrice;
        return t;
      }, 0);
    }
    const keys = Object.keys(playerStats).map((str) => parseInt(str));
    const maxValue = Math.max(...keys.map((k) => playerStats[k]));
    const minValue = Math.min(...keys.map((k) => playerStats[k]));
    const compareVal = battleMode === 'underdog' ? minValue : maxValue;
    winningPositions = keys.filter((k) => playerStats[k] === compareVal);
  }
</script>

<svelte:window
  on:beforeunload="{() => resetAudio}"
  on:load="{() => resetAudio}"
  bind:innerWidth="{screenSize}"
/>
<div class="min-h-screen pb-16 pt-4">
  <CaseBattleHeader title="{$_('battles.header.battle')}" activeTab="{4}">
    <button
      on:click="{createSameBattle}"
      class="button relative h-12 w-full hover:brightness-110 lg:w-min lg:min-w-[16rem] {loading
        ? 'pointer-events-none brightness-75'
        : ''} {battleMode === 'underdog' ? 'button-pink-dimmed' : 'button-green-dimmed'}"
    >
      <span>
        <p>
          {$_('battles.battlePage.createSame')}
          <span class="">
            {convertPrice($page.data.currency, caseBattleData.totalPrice)}
          </span>
        </p>
      </span>
      {#if loading}
        <div class="absolute inset-auto h-fit w-fit brightness-125">
          <Spinner />
        </div>
      {/if}
    </button>
  </CaseBattleHeader>

  <!-- Cases, sound, copy -->
  <div class="container mx-auto px-5 md:px-0">
    <div
      class="relative flex flex-col rounded-[4rem_0.75rem_0.75rem] bg-navy-700 md:flex-row md:items-center md:rounded-[5rem_0.75rem_0.75rem_5rem]"
    >
      <div class="flex rounded-bl-full rounded-br-lg rounded-tl-full rounded-tr-lg bg-navy-800">
        <div
          data-testid="case_battle_list_item_round"
          class="mr-1 flex h-[96px] w-[96px] min-w-[96px] items-center justify-center rounded-full border text-2xl transition {battleMode === 'underdog' ? 'border-purple-500 bg-[#110515] shadow-[inset_0_0_0.8rem_0.4rem_#4D2858]' : 'border-[#665130] bg-[#1E180E] shadow-[inset_0_0_0.8rem_0.4rem_rgba(232,179,33,0.1)]'}"
        >
          <div
            class="flex h-[56%] w-[56%] items-center justify-center rounded-full border-2 text-center font-bold transition {battleMode === 'underdog' ? 'border-purple-400 text-purple-400 drop-shadow-[0_0_0.4rem_purple-400/50]' : 'border-gold-400 text-gold-400 drop-shadow-[0_0_0.1rem_rgba(232,179,33,0.5)]'}"
          >
            {visibleRound}
          </div>
        </div>
        <div
          class="mx-2 flex w-full flex-row items-center justify-between sm:mx-6 md:w-auto md:flex-col md:items-start md:justify-center"
        >
          <p class="text-xs font-bold text-white sm:whitespace-nowrap">
            {$_('battles.battlePage.battleRounds')}
          </p>
          <p class="mr-2 text-xs font-medium text-navy-100 md:mr-0 md:text-2xs">
            {visibleRound} / {caseBattleData.totalCases}
          </p>
        </div>
      </div>
      <div
        class="relative my-1 flex h-24 w-full items-center overflow-hidden px-3 md:my-0 md:pl-2 md:pr-0"
        style="mask-image: linear-gradient(to right, transparent, black 0rem, black, black calc(100% - 80px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 0rem, black, black calc(100% - 80px), transparent);"
      >
        <!-- 82 = 72 constant size + 10 margin -->
        <!-- prettier-ignore -->
        <ul class="will-change flex items-center h-[72px] transition-transform duration-700 ease-in-out {startBattle ? '' : 'no-scrollbar overflow-x-scroll'}" style="transform: translateX(-{visibleRound * 82 - 82}px);">
          {#each caseBattleData.caseData as caseData}
            {#each new Array(caseData.count) as i}
              <li
                class="display-case relative mr-[10px] flex h-full flex-col items-center justify-between overflow-hidden rounded-md pb-2 text-xs uppercase w-[72px] min-w-[72px] snap-center transition-all duration-700 ease-in-out"
              >
                <img
                  src="{caseData.imgName}"
                  class="absolute inset-0 h-full w-full object-cover"
                  alt=""
                />
                <div class="absolute inset-0" style="background-image: linear-gradient(transparent 45%, rgba(0, 0, 0, 0.6));"></div>
                <p
                  class="relative mt-auto line-clamp-2 max-w-full overflow-hidden break-words px-1 text-center text-2xs font-semibold leading-none text-white"
                >
                  {caseData.websiteName}
                </p>
              </li>
            {/each}
          {/each}
        </ul>
      </div>
    </div>
    <div
      class="relative my-2.5 flex w-min flex-col items-start md:ml-auto md:flex-row md:items-center md:space-x-6"
    >
      <button
        class="button group pointer-events-none h-7 p-0 text-[10px] font-normal text-navy-300 opacity-0 transition-opacity duration-200 hover:text-white md:h-9"
      >
        <svg class="icon mr-1 block h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="m19 12-7-5v10zM5 7v10l7-5z"></path>
        </svg>
        {$_('battles.battlePage.results')}
      </button>
      <button
        class="button group h-7 p-0 text-[10px] font-normal text-navy-300 transition-opacity duration-200 hover:text-white md:h-9"
        aria-label="on"
        on:click="{setAudioMute}"
      >
        <svg viewBox="-10 0 130 120" class="mr-2 block h-3 w-3 fill-current">
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
            style="transform-origin: 0px 0px 0px; opacity: {$settings.muteAudio ? 0 : 1};"
            data-svg-origin="77.0999984741211 29.299999237060547"
            transform="matrix(1,0,0,1,0,0)"
          ></path>
          <path
            class="vol"
            d="M99.5 15L92 22.8c10.5 10.5 15.8 22.9 15.8 37.2 0 14.7-5.3 27.1-15.8 37.1l7.5 8.3C112.5 92.9 119 77.8 119 60 119 42.2 112.5 27.2 99.5 15z"
            style="transform-origin: 0px 0px 0px; opacity: {$settings.muteAudio ? 0 : 1};"
            data-svg-origin="92 15"
            transform="matrix(1,0,0,1,0,0)"
          ></path>
        </svg>
        {$settings.muteAudio
          ? $_('battles.battlePage.enableSound')
          : $_('battles.battlePage.disableSound')}
      </button>
      <div>
        <button
          class="button group h-7 max-w-full overflow-hidden p-0 text-[10px] font-normal lowercase text-navy-300 transition-opacity duration-200 hover:text-white md:h-9"
          on:click="{() => navigator.clipboard.writeText($page.url.toString())}"
        >
          <svg class="icon mr-2 block h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M4.24805 3.91016V0.910156C4.24805 0.711244 4.32706 0.520478 4.46772 0.379826C4.60837 0.239174 4.79913 0.160156 4.99805 0.160156H14.748C14.947 0.160156 15.1377 0.239174 15.2784 0.379826C15.419 0.520478 15.498 0.711244 15.498 0.910156V10.6602C15.498 10.8591 15.419 11.0498 15.2784 11.1905C15.1377 11.3311 14.947 11.4102 14.748 11.4102H11.748V14.4049C11.748 14.8219 11.4113 15.1602 10.9928 15.1602H1.2533C1.15409 15.1603 1.05583 15.1408 0.964159 15.1029C0.872483 15.0649 0.789186 15.0093 0.719035 14.9392C0.648884 14.869 0.593256 14.7857 0.555336 14.694C0.517416 14.6024 0.497949 14.5041 0.498047 14.4049L0.500297 4.66541C0.500297 4.24841 0.837047 3.91016 1.25555 3.91016H4.24805ZM5.74805 3.91016H10.9928C11.4098 3.91016 11.748 4.24691 11.748 4.66541V9.91016H13.998V1.66016H5.74805V3.91016Z"
            ></path>
          </svg>
          {$page.url}
        </button>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-0">
    <!-- md from tailwind -->
    {#if screenSize >= 768}
      <CaseBattlePanels
        {caseBattleData}
        {socket}
        {winnerPos}
        {currentRound}
        {visibleItems}
        {countdownContent}
        {winningPositions}
        {wonItems}
        {players}
        {battleOwner}
        {battleMode}
        {startBattle}
        {showAwardInfo}
        {showRoulettes}
        {showCountdown}
        {battleAnimationOver}
        {rollAnimationOver}
      />
    {:else}
      <CaseBattleMobilePanels
        {caseBattleData}
        {socket}
        {winnerPos}
        {currentRound}
        {visibleItems}
        {countdownContent}
        {winningPositions}
        {wonItems}
        {players}
        {battleOwner}
        {battleMode}
        {startBattle}
        {showAwardInfo}
        {showRoulettes}
        {showCountdown}
        {battleAnimationOver}
        {rollAnimationOver}
      />
    {/if}
  </div>
</div>

<div
  class="pointer-events-none fixed left-4 top-0 z-50 opacity-0 transition-opacity duration-100"
  style="transform: translate(648px, 487px);"
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
<div class="container mx-auto"></div>
<div class="container mx-auto">
  <div
    class="mt-10 flex flex-col items-center space-y-4 rounded-xl bg-navy-750 p-6 pr-0 md:flex-row md:space-y-0"
  >
    <p class="text-[10px] font-medium text-navy-200 md:mr-8">
      {$_('battles.battlePage.battleStart')}:
      <span class="text-white">{new Date(caseBattleData.createdAt)}</span>
    </p>
  </div>
</div>
