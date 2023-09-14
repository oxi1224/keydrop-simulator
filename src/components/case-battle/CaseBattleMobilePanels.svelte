<script lang="ts">
  import { page } from '$app/stores';
  import Spinner from '$components/util/Spinner.svelte';
  import { convertPrice, sleep, type ParsedCaseBattle, type CaseBattlePlayers } from '$lib';
  import type { CaseDrop } from '@prisma/client';
  import type { Socket } from 'socket.io-client';
  import { _ } from 'svelte-i18n';
  import { fade, scale } from 'svelte/transition';
  import { register } from 'swiper/element/bundle';

  register();

  export let caseBattleData: ParsedCaseBattle;
  export let socket: Socket;

  export let winnerPos: number | null;
  export let currentRound: number;
  export let visibleItems: number;
  export let countdownContent: number;
  export let winningPositions: number[];
  export let wonItems: { [key: number]: CaseDrop[] };
  export let players: CaseBattlePlayers;
  export let battleOwner: string;
  export let battleMode: 'underdog' | 'classic';

  export let showCountdown: boolean;
  export let battleAnimationOver: boolean;
  export let startBattle: boolean;
  export let rollAnimationOver: boolean;
  export let showAwardInfo: boolean;
  export let showRoulettes: boolean;

  let sliderIndex = 0;

  function leaveBattle(pos: number) {
    socket.emit('caseBattlePlayerLeave', caseBattleData.id, $page.data.user, pos);
  }

  function joinBattle(pos: number) {
    socket.emit('caseBattlePlayerJoin', caseBattleData.id, $page.data.user, pos, false);
  }

  function addBot(pos: number) {
    socket.emit('caseBattlePlayerJoin', caseBattleData.id, null, pos, true);
  }

  async function addAllBots() {
    for (let i = 0; i < caseBattleData.playerCount; i++) {
      if (caseBattleData.players[i]) continue;
      socket.emit('caseBattlePlayerJoin', caseBattleData.id, null, i, true);
      await sleep(250); // Fixes unreliability
    }
  }

  function onSlideChange(e: any) {
    sliderIndex = e.detail[0].activeIndex;
  }
</script>

<!-- <div
        class="absolute z-10 mr-1 flex h-15 w-15 flex-shrink-0 transform items-center justify-center rounded-full border transition duration-300 md:h-24 md:w-24 pointer-events-none scale-75 opacity-0 css-1q5i7zg"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-400 text-center text-xl font-bold text-blue-400 md:h-14 md:w-14 css-1880x07"
        ></div>
      </div> -->
<div
  class="relative grid md:hidden"
  style="grid-template-columns: repeat({caseBattleData.playerCount}, minmax(0px, 1fr));"
>
  {#if showCountdown}
    <div
      class="h-15 w-15 pointer-events-none absolute -top-12 z-10 mr-1 flex h-24 w-24 flex-shrink-0 scale-100 transform items-center justify-center rounded-full border border-gray-800 opacity-100 transition duration-300 md:h-24 md:w-24"
      style="left: calc(50% - 3rem); background: radial-gradient(50% 50%, rgb(19, 19, 22) 60%, rgba(59, 184, 255, 0.11) 100%);"
      transition:scale="{{ duration: 250 }}"
    >
      <div
        class="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-400 text-center text-xl font-bold text-blue-400 md:h-14 md:w-14"
        style="box-shadow: rgba(65, 173, 255, 0.5) 0px 0px 10px, rgba(65, 173, 255, 0.5) 0px 0px 10px inset;"
      >
        {#key countdownContent}
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            transition:scale="{{ duration: 250 }}"
          >
            {countdownContent}
          </div>
        {/key}
      </div>
    </div>
  {/if}

  {#each Array(caseBattleData.playerCount) as dummy, i}
    <div>
      <div
        class="grid-stack relative grid h-[20.625rem] min-w-0 flex-1 overflow-hidden bg-navy-800"
      >
        <div
          class="absolute inset-0 h-[20.625rem]"
          style="background: linear-gradient(transparent, {battleAnimationOver
            ? winnerPos === i
              ? 'rgba(127, 217, 25, 0.07)'
              : 'rgba(255, 68, 93, 0.08)'
            : startBattle
            ? 'rgb(23, 31, 40)'
            : 'rgba(127, 217, 25, 0.07)'});"
        ></div>

        <!-- TODO: READY TO BATTLE -->
        {#if players[i] && !startBattle}
          <div
            class="relative z-10 flex flex-col items-center justify-center opacity-100 transition-opacity duration-500 opacity-{startBattle
              ? '0'
              : '100'}"
          >
            <svg class="h-8 w-8 text-green">
              <use xlink:href="/icons/icons.svg#tick"></use>
            </svg>
          </div>
        {/if}
        <!-- TODO: Waiting for players -->
        {#if (!$page.data.user && !players[i]) || (Object.values(players)
            .map((p) => p.id)
            .includes($page.data.user?.id) && !players[i])}
          <div
            class="relative z-10 flex flex-col items-center justify-center opacity-100 transition-opacity duration-500"
          >
            <Spinner size="2.2rem" />
          </div>
        {/if}

        <div
          class="transition-opacity duration-500"
          style="opacity: {!battleAnimationOver &&
          rollAnimationOver &&
          winningPositions.length > 1
            ? '100'
            : '0'}"
        >
          <div
            class="drawing-winner pointer-events-none absolute inset-0 flex w-full flex-col items-center justify-center {rollAnimationOver
              ? 'animate-scale'
              : ''}"
            style="animation-delay: {(1000 / caseBattleData.playerCount) * i +
              Math.floor(Math.random() * 100)}ms;"
          >
            <img
              src="{players[i]?.pfpUrl}"
              alt=""
              class="h-20 w-20 rounded-full border-2 border-green object-cover"
            />
            <div class="mt-4 text-xs font-bold uppercase text-green">
              {players[i]?.username || ''}
            </div>
          </div>
        </div>
        {#if !players[i] && $page.data.user && !Object.values(players)
            .map((p) => p.id)
            .includes($page.data.user?.id)}
          <div
            class="absolute top-1/2 z-10 flex w-full -translate-y-1/2 flex-col items-center transition-opacity duration-500 opacity-{startBattle
              ? '0'
              : '100'}"
          >
            <p class="mt-2 px-3 text-center uppercase text-white">
              <span class="font-light">{$_('battles.battlePage.ready')}</span>
              <strong class="font-semibold">{$_('battles.battlePage.toBattle')}</strong>
            </p>
          </div>
        {/if}
        <!-- TODO: AFTER ROLL SCREEN -->
        {#if startBattle && battleAnimationOver}
          <div
            class="z-10 flex w-full flex-col items-center justify-center uppercase transition-opacity duration-500 {winnerPos ===
            i
              ? ' text-green'
              : ' text-red'}"
            transition:fade="{{ duration: 500 }}"
          >
            {#if winnerPos === i}
              <div class="flex h-12 items-center text-xs">{$_('battles.battlePage.winner')}</div>
              <div class="flex items-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="text-center text-2xs">
                    <span class="mr-1 text-green">{$_('battles.battlePage.totalPrize')}</span>
                    <!-- prettier-ignore -->
                    <span class="text-white">
                      {convertPrice(
                        $page.data.currency,
                        Object.values(wonItems)
                          .flat()
                          .reduce((t, d) => (t += d.skinPrice), 0)
                      )}
                    </span>
                  </div>
                  <!-- prettier-ignore -->
                  <span class="text-2xs text-navy-200">
                    (<span class="">
                      {convertPrice(
                        'eur',
                        Object.values(wonItems)
                          .flat()
                          .reduce((t, d) => (t += d.skinPrice), 0)
                      )}</span>)
                  </span>
                </div>
              </div>
            {:else}
              <div class="flex h-12 items-center text-xs">{$_('battles.battlePage.loser')}</div>
              <div class="flex items-center">
                <div class="flex flex-col">
                  <div class="text-3xs text-white">L</div>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <div
          class="pointer-events-none z-10 transition-opacity duration-500 opacity-{showRoulettes
            ? '100'
            : '0'}"
        >
          <div
            class="CaseBattleDisplayRoll-rollRatioBox grid h-full w-full justify-self-center overflow-hidden"
            style="perspective: 80px; contain: content; mask-image: linear-gradient(rgba(255, 255, 255, 0.1), black, rgba(255, 255, 255, 0.1)); -webkit-mask-image: linear-gradient(rgba(255, 255, 255, 0.1), black, rgba(255, 255, 255, 0.1));"
          >
            <div
              class="CaseBattleDisplayRoll-wheel col-start-1 row-start-1 h-full w-full will-change-transform"
              style="transform-style: preserve-3d; transform: translate3d(0px, 0px, -1698.91px) rotateX(340deg);"
            >
              {#each caseBattleData.drops[i][currentRound] as caseItem, i}
                <div
                  class="CaseBattleDisplayRoll-skin absolute left-0 top-0 h-full w-full"
                  style="backface-visibility: hidden;  transform: rotateX({i *
                    (360 / 36)}deg) translateZ(1658.91px); opacity: 1;"
                >
                  <img
                    src="{caseItem.skinImgSource}"
                    alt=""
                    class="block h-full w-full object-contain"
                  />
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div
          class="CaseBattleDisplayRoll-wonItemData absolute bottom-0 left-0 z-20 flex w-full min-w-0 flex-row items-center justify-self-start px-6 py-3 text-2xs font-semibold uppercase leading-tight transition duration-300 opacity-{showAwardInfo
            ? '100'
            : '0'}"
        >
          <div class="flex-1">
            <!-- skin name -->
            <div class="truncate text-navy-200">
              {wonItems[i][currentRound].skinName}
            </div>
            <!-- weapon name -->
            <div class="truncate text-xs font-bold text-white">
              {wonItems[i][currentRound].weaponName}
            </div>
            <!-- wear -->
            <div class="truncate text-navy-200">
              {wonItems[i][currentRound].skinQuality}
            </div>

            <div class="flex items-center">
              <!-- price -->
              <span class="mt-1 truncate text-xs font-bold text-white">
                {convertPrice($page.data.currency, wonItems[i][currentRound].skinPrice ?? 0)}
              </span>
            </div>

            <!-- prettier-ignore -->
            <span class="text-xs text-navy-200">
               (<span class="">{convertPrice('eur', wonItems[i][currentRound].skinPrice ?? 0)}</span>)
            </span>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<div class="-top-px z-10 flex max-h-32 w-full">
  {#each new Array(caseBattleData.playerCount) as dummy, i}
    {#if players[i]}
      <div
        class="flex h-32 w-full items-center justify-center rounded-none border-r border-transparent px-2 py-4 opacity-100 transition-colors duration-200 last:border-r-0 {sliderIndex ===
        i
          ? 'bg-navy-550'
          : 'bg-navy-700'}"
        role="button"
        tabindex="0"
      >
        <div class="flex flex-col items-center">
          <img src="{players[i].pfpUrl}" class="h-10 w-10 rounded-lg object-contain" alt="" />
          <div class="mb-1 mt-2 flex items-center gap-0.5 overflow-hidden">
            <p
              class="line-clamp-2 overflow-hidden break-all text-center text-2xs font-bold uppercase text-navy-100"
            >
              {players[i].username}
            </p>
          </div>
          <span class="text-2xs font-semibold text-white">
            {convertPrice(
              $page.data.currency,
              wonItems[i].slice(0, visibleItems).reduce((t, d) => (t += d.skinPrice), 0)
            )}
          </span>
          <!-- prettier-ignore -->
          <span class="text-2xs text-navy-200">
            (<span class="">
              {convertPrice(
                'eur',
                wonItems[i].slice(0, visibleItems).reduce((t, d) => (t += d.skinPrice), 0)
              )}</span>)
          </span>
        </div>
      </div>
    {:else}
      <div
        class="flex h-32 w-full items-center justify-center rounded-none border-r border-navy-500 px-2 py-4 opacity-100 transition-colors duration-200 last:border-r-0 {sliderIndex ===
        i
          ? 'bg-navy-550'
          : 'bg-navy-700'}"
        role="button"
        tabindex="0"
      >
        {#if $page.data.user && !Object.values(players)
            .map((p) => p.id)
            .includes($page.data.user?.id)}
          <button
            class="button mx-auto h-fit whitespace-normal px-3 py-1 text-2xs leading-none {battleMode === 'underdog' ? 'button-pink-dimmed' : 'button-green-dimmed'}"
            on:click="{() => joinBattle(i)}"
          >
            <span>
              <svg class="icon inline-block h-3 w-3" viewBox="0 0 24 24" fill="none">
                <path
                  fill="currentColor"
                  d="M17.833 6.166c-3.216-3.216-8.45-3.216-11.666 0-3.217 3.217-3.217 8.45 0 11.667 3.216 3.216 8.45 3.216 11.666 0 3.217-3.216 3.217-8.45 0-11.667zm-5.008 9.917h-1.65v-3.258H7.917v-1.65h3.258V7.916h1.65v3.259h3.258v1.65h-3.258v3.258z"
                ></path>
              </svg>
              Join
            </span>
          </button>
        {/if}

        {#if $page.data.user?.id === battleOwner}
          <div class="flex flex-col items-center">
            <div class="relative flex flex-col items-center">
              <button
                class="button mx-auto h-9 px-3 text-2xs {battleMode === 'underdog' ? 'button-pink-dimmed' : 'button-green-dimmed'}"
                on:click="{() => addBot(i)}"
              >
                <svg class="icon h-4 w-4 flex-shrink-0 text-white" viewBox="0 0 19 21" fill="none">
                  <path
                    d="M10.5 3.055C15 3.552 18.5 7.367 18.5 12V21H0.5V12C0.5 7.367 4 3.552 8.5 3.055V0H10.5V3.055ZM9.5 17C10.8261 17 12.0979 16.4732 13.0355 15.5355C13.9732 14.5979 14.5 13.3261 14.5 12C14.5 10.6739 13.9732 9.40215 13.0355 8.46447C12.0979 7.52678 10.8261 7 9.5 7C8.17392 7 6.90215 7.52678 5.96447 8.46447C5.02678 9.40215 4.5 10.6739 4.5 12C4.5 13.3261 5.02678 14.5979 5.96447 15.5355C6.90215 16.4732 8.17392 17 9.5 17ZM9.5 15C8.70435 15 7.94129 14.6839 7.37868 14.1213C6.81607 13.5587 6.5 12.7956 6.5 12C6.5 11.2044 6.81607 10.4413 7.37868 9.87868C7.94129 9.31607 8.70435 9 9.5 9C10.2956 9 11.0587 9.31607 11.6213 9.87868C12.1839 10.4413 12.5 11.2044 12.5 12C12.5 12.7956 12.1839 13.5587 11.6213 14.1213C11.0587 14.6839 10.2956 15 9.5 15ZM9.5 13C9.76522 13 10.0196 12.8946 10.2071 12.7071C10.3946 12.5196 10.5 12.2652 10.5 12C10.5 11.7348 10.3946 11.4804 10.2071 11.2929C10.0196 11.1054 9.76522 11 9.5 11C9.23478 11 8.98043 11.1054 8.79289 11.2929C8.60536 11.4804 8.5 11.7348 8.5 12C8.5 12.2652 8.60536 12.5196 8.79289 12.7071C8.98043 12.8946 9.23478 13 9.5 13Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
            <button
              type="button"
              class="mx-auto mt-2.5 block text-xs uppercase {battleMode === 'underdog' ? 'text-purple-500' : 'text-green-200'}"
              on:click="{() => addAllBots()}"
            >
              {$_('battles.battlePage.summonBots')}
            </button>
          </div>
        {/if}
      </div>
    {/if}
  {/each}
</div>

<swiper-container
  class="swiper-container bg-navy-550"
  slides-per-view="{1}"
  space-between="{0}"
  centered-slides="{true}"
  on:slidechange="{onSlideChange}"
>
  {#each new Array(caseBattleData.playerCount) as dummy, i}
    <swiper-slide class="w-full px-5 py-5">
      {#if players[i]?.id === $page.data.user?.id && players[i]}
        <div class="mb-4 w-full rounded-xl bg-navy-900 bg-opacity-20 p-2">
          {#if Object.values(players)
            .map((p) => p.id)
            .includes($page.data.user?.id) && !caseBattleData.finished}
            <button
              class="button button-secondary ml-auto h-8 px-4 text-2xs"
              on:click="{() => leaveBattle(i)}"
            >
              <span>{$_('battles.battlePage.leaveBattle')}</span>
            </button>
          {/if}
        </div>
      {/if}
      <div class="opacity-100 transition-opacity duration-500">
        <div
          class="grid gap-2"
          style="grid-template-columns: repeat(auto-fill,minmax(6.25rem,1fr));"
        >
          {#each new Array(caseBattleData.totalCases) as dummy, roundIndex}
            {#if visibleItems > roundIndex}
              <div class="group relative" transition:fade="{{ duration: 150 }}">
                <div
                  class="group relative flex aspect-[10/13] w-full select-none flex-col items-center justify-between rounded-lg border border-solid border-navy-500 bg-navy-600 bg-cover bg-center"
                  style="background-image: url('/images/browseritembg.webp');"
                >
                  <div
                    class="pointer-events-none absolute -top-px h-5 w-full rounded-lg border-t border-solid border-{wonItems[
                      i
                    ][roundIndex].skinRarity}"
                  ></div>
                  <div class="flex w-full items-center">
                    <div
                      class="my-1.5 ml-2 mr-1 py-1.5 text-2xs font-bold uppercase leading-none text-white"
                    >
                      {wonItems[i][roundIndex].skinQuality}
                    </div>
                    <div
                      class="m-1.5 ml-auto min-w-0 whitespace-nowrap rounded-md bg-navy-900 p-1.5 font-bold leading-none text-gold"
                      style="font-size: 9px;"
                    >
                      <div class="overflow-hidden" style="display: block; white-space: nowrap;">
                        {convertPrice($page.data.currency, wonItems[i][roundIndex].skinPrice ?? 0)}
                      </div>
                    </div>
                  </div>
                  <div class="relative flex-1" style="width: calc(100% - 8px);">
                    <img
                      src="{wonItems[i][roundIndex].skinImgSource}"
                      alt=""
                      class="pointer-events-none absolute left-0 top-0 h-full w-full transform object-contain transition-all duration-500 ease-out"
                    />
                  </div>
                  <p
                    class="w-full flex-shrink-0 truncate px-1 text-center text-xs font-bold uppercase leading-tight text-white"
                    title="{wonItems[i][roundIndex].weaponName}"
                  >
                    {wonItems[i][roundIndex].weaponName}
                  </p>
                  <p
                    class="mb-2 w-full flex-shrink-0 truncate px-0.5 text-center text-2xs uppercase leading-tight text-navy-300"
                    title="{wonItems[i][roundIndex].skinName}"
                  >
                    {wonItems[i][roundIndex].skinName}
                  </p>
                </div>
              </div>
            {:else}
              <div class="grid-stack grid">
                <div
                  class="relative flex aspect-[10/13] w-full flex-col items-center justify-center rounded-lg border border-solid border-navy-500 bg-navy-550 bg-opacity-50 bg-cover text-center opacity-100 transition duration-500"
                >
                  <div class="css-lx1lpo absolute rounded"></div>
                  <div class="css-b6vfff absolute rounded"></div>
                  <div class="css-1cz2m9e absolute rounded"></div>
                  <div class="css-15rqpep absolute rounded"></div>
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>
      <div
        class="mt-4 flex h-11 items-center justify-center rounded-lg bg-navy-750 px-4 text-center"
      >
        <p class="text-[10px] font-medium text-navy-750">PLACEHOLDER</p>
      </div>
    </swiper-slide>
  {/each}
</swiper-container>

<style>
  .css-b6vfff {
    background-image: linear-gradient(
      90deg,
      rgb(49, 48, 62) 0%,
      rgba(52, 54, 68, 0) 120%,
      rgba(31, 30, 39, 0) 120%
    );
    width: 50%;
    height: 8%;
    right: 5%;
    top: 5%;
  }

  .css-lx1lpo {
    background-image: linear-gradient(
      90deg,
      rgb(49, 48, 62) 0%,
      rgba(52, 54, 68, 0) 120%,
      rgba(31, 30, 39, 0) 120%
    );
    width: 25%;
    height: 8%;
    left: 5%;
    top: 5%;
  }

  .css-1cz2m9e {
    background-image: linear-gradient(
      90deg,
      rgb(49, 48, 62) 0%,
      rgba(52, 54, 68, 0) 120%,
      rgba(31, 30, 39, 0) 120%
    );
    width: 80%;
    height: 6%;
    left: 10%;
    bottom: calc(15%);
  }

  .css-15rqpep {
    background-image: linear-gradient(
      90deg,
      rgb(49, 48, 62) 0%,
      rgba(52, 54, 68, 0) 120%,
      rgba(31, 30, 39, 0) 120%
    );
    width: 50%;
    height: 6%;
    left: 25%;
    bottom: 5%;
  }
</style>
