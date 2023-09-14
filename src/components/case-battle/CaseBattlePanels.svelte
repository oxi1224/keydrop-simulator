<script lang="ts">
  import { page } from '$app/stores';
  import { convertPrice, sleep, type ParsedCaseBattle, type CaseBattlePlayers } from '$lib';
  import type { CaseDrop } from '@prisma/client';
  import type { Socket } from 'socket.io-client';
  import { _ } from 'svelte-i18n';
  import { fade, scale } from 'svelte/transition';

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
</script>

<!-- <div
        class="absolute z-10 mr-1 flex h-15 w-15 flex-shrink-0 transform items-center justify-center rounded-full border transition duration-300 md:h-24 md:w-24 pointer-events-none scale-75 opacity-0 css-1q5i7zg"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-400 text-center text-xl font-bold text-blue-400 md:h-14 md:w-14 css-1880x07"
        ></div>
      </div> -->

<div
  class="relative hidden gap-x-5 md:grid"
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
        class="grid-stack relative grid h-[20.625rem] min-w-0 flex-1 place-content-center place-items-center overflow-hidden rounded-t-2xl bg-navy-800"
      >
        <div
          class="absolute inset-0 h-[20.625rem]"
          style="background: linear-gradient(transparent, {startBattle
            ? 'rgb(23, 31, 40)'
            : 'rgba(127, 217, 25, 0.07)'});"
        ></div>
        <div
          class="pointer-events-none absolute inset-0 -top-1/2 h-[20.625rem] bg-cover bg-center opacity-100 transition-opacity duration-500"
          style="background-image: url('https://key-drop.com/web/KD/static/images/case-battle/winner-slot-bg.png?v70');"
        ></div>

        <!-- TODO: READY TO BATTLE -->
        {#if players[i] && !startBattle}
          <div
            class="relative z-10 flex flex-col items-center transition-opacity duration-500 opacity-{startBattle
              ? '0'
              : '100'}"
          >
            <svg class="h-8 w-8 {battleMode === 'underdog' ? 'text-purple-500' : 'text-green'}">
              <use xlink:href="/icons/icons.svg?39#tick"></use>
            </svg>
            <p class="mt-2 text-xl text-center font-semibold uppercase text-white">
              {$_('battles.battlePage.readyToBattle')}
            </p>
            {#if $page.data.user?.id === players[i]?.id}
              <div>
                <button
                  class="button button-secondary mt-4 h-8 px-4 text-2xs"
                  on:click="{() => leaveBattle(i)}"
                >
                  <span>{$_('battles.battlePage.leaveBattle')}</span>
                </button>
              </div>
            {/if}
          </div>
        {/if}
        <!-- TODO: Waiting for players -->
        {#if (!$page.data.user && !players[i]) || (Object.values(players)
            .map((p) => p.id)
            .includes($page.data.user?.id) && !players[i])}
          <div
            class="relative z-10 flex flex-col items-center transition-opacity duration-500 opacity-{startBattle
              ? '0'
              : '100'}"
          >
            <div
              class="h-8 w-8 transform transition duration-200 opacity-{startBattle ? '0' : '100'}"
            >
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
            <p class="mb-4 mt-2 text-center text-xl font-light uppercase text-white">
              {$_('battles.battlePage.waitingForPlayers')}
            </p>
            {#if $page.data.user?.id === battleOwner}
              <div class="relative">
                <button
                  class="button mx-auto h-8 px-4 text-2xs hover:brightness-110 {battleMode === 'underdog' ? 'button-pink-dimmed' : 'button-green-dimmed'}"
                  on:click="{() => addBot(i)}"
                >
                  <svg
                    class="icon -mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-white"
                    viewBox="0 0 19 21"
                    fill="none"
                  >
                    <path
                      d="M10.5 3.055C15 3.552 18.5 7.367 18.5 12V21H0.5V12C0.5 7.367 4 3.552 8.5 3.055V0H10.5V3.055ZM9.5 17C10.8261 17 12.0979 16.4732 13.0355 15.5355C13.9732 14.5979 14.5 13.3261 14.5 12C14.5 10.6739 13.9732 9.40215 13.0355 8.46447C12.0979 7.52678 10.8261 7 9.5 7C8.17392 7 6.90215 7.52678 5.96447 8.46447C5.02678 9.40215 4.5 10.6739 4.5 12C4.5 13.3261 5.02678 14.5979 5.96447 15.5355C6.90215 16.4732 8.17392 17 9.5 17ZM9.5 15C8.70435 15 7.94129 14.6839 7.37868 14.1213C6.81607 13.5587 6.5 12.7956 6.5 12C6.5 11.2044 6.81607 10.4413 7.37868 9.87868C7.94129 9.31607 8.70435 9 9.5 9C10.2956 9 11.0587 9.31607 11.6213 9.87868C12.1839 10.4413 12.5 11.2044 12.5 12C12.5 12.7956 12.1839 13.5587 11.6213 14.1213C11.0587 14.6839 10.2956 15 9.5 15ZM9.5 13C9.76522 13 10.0196 12.8946 10.2071 12.7071C10.3946 12.5196 10.5 12.2652 10.5 12C10.5 11.7348 10.3946 11.4804 10.2071 11.2929C10.0196 11.1054 9.76522 11 9.5 11C9.23478 11 8.98043 11.1054 8.79289 11.2929C8.60536 11.4804 8.5 11.7348 8.5 12C8.5 12.2652 8.60536 12.5196 8.79289 12.7071C8.98043 12.8946 9.23478 13 9.5 13Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>{$_('battles.battlePage.playWithBot')}</span>
                </button>
                <button
                  type="button"
                  class="mx-auto mt-5 block text-sm uppercase {battleMode === 'underdog' ? 'text-purple-500' : 'text-neonGreen'}"
                  on:click="{() => addAllBots()}"
                >
                  {$_('battles.battlePage.summonBots')}
                </button>
              </div>
            {/if}
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
            class="drawing-winner pointer-events-none relative flex w-full flex-col items-center justify-center {rollAnimationOver
              ? 'animate-scale'
              : ''}"
            style="animation-delay: {(1000 / caseBattleData.playerCount) * i +
              Math.floor(Math.random() * 100)}ms;"
          >
            <img
              src="{players[i]?.pfpUrl}"
              alt=""
              class="h-36 w-36 rounded-full border-2 border-green object-cover"
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
            class="relative z-10 flex w-full flex-col items-center transition-opacity duration-500 opacity-{startBattle
              ? '0'
              : '100'}"
          >
            <p class="mt-2 text-center text-xl uppercase text-white">
              <span class="font-light">{$_('battles.battlePage.ready')}</span>
              <strong class="font-semibold">{$_('battles.battlePage.toBattle')}</strong>
            </p>
            <button
              class="button mt-4 max-w-full {battleMode === 'underdog' ? 'button-pink-dimmed' : 'button-green-dimmed'}"
              on:click="{() => joinBattle(i)}"
            >
              {$_(battleMode == 'underdog' ? 'battles.joinUnderdog' : 'battles.joinClassic')}
            </button>
          </div>
        {/if}
        <!-- TODO: AFTER ROLL SCREEN -->
        {#if startBattle && battleAnimationOver}
          <div
            class="relative z-10 flex w-full flex-col items-center px-5 text-xl uppercase transition-opacity duration-500 {winnerPos ===
            i
              ? ' text-green'
              : ' text-red'}"
            transition:fade="{{ duration: 500 }}"
          >
            {#if winnerPos === i}
              <div class="flex h-12 items-center">{$_('battles.battlePage.winner')}</div>
              <div class="relative w-full border-t border-dashed border-current">
                <div class="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-current"></div>
                <div class="absolute -top-[5px] right-0 h-2.5 w-2.5 rounded-full bg-current"></div>
              </div>
              <div class="flex h-12 items-center">
                <div class="flex items-center justify-center text-sm">
                  <span class="mr-1 text-green">{$_('battles.battlePage.totalPrize')}</span>
                  <span class="text-white">
                    {convertPrice(
                      $page.data.currency,
                      Object.values(wonItems)
                        .flat()
                        .reduce((t, d) => (t += d.skinPrice), 0)
                    )}
                  </span>
                  <!-- prettier-ignore -->
                  <span class="ml-1 text-sm text-navy-200">
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
              <div class="flex h-12 items-center">{$_('battles.battlePage.loser')}</div>
              <div class="relative w-full border-t border-dashed border-current">
                <div class="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-current"></div>
                <div class="absolute -top-[5px] right-0 h-2.5 w-2.5 rounded-full bg-current"></div>
              </div>
              <div class="flex h-12 items-center">
                <div class="flex items-center justify-center text-sm">
                  <span class="mr-1 text-red">L</span>
                </div>
              </div>
            {/if}
          </div>
        {/if}
        <div
          class="absolute h-[20.625rem] min-w-full transition-opacity duration-200 opacity-{showRoulettes
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
          class="CaseBattleDisplayRoll-wonItemData absolute -bottom-1/2 left-0 z-10 flex w-full min-w-0 flex-row items-center justify-self-start px-6 py-3 pb-5 text-2xs font-semibold uppercase leading-tight transition duration-300 opacity-{showAwardInfo
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
          </div>
          <!-- price -->
          <span class="truncate text-xs font-bold text-white">
            {convertPrice($page.data.currency, wonItems[i][currentRound].skinPrice ?? 0)}
          </span>
          <!-- usd price -->
          <!-- prettier-ignore -->
          <span class="ml-1 text-xs font-bold text-navy-200">
                (<span class="">{convertPrice('eur', wonItems[i][currentRound].skinPrice ?? 0)}</span>)
              </span>
        </div>
        <div class="absolute bottom-24 left-5 right-5 z-30"><div class=""></div></div>
      </div>
      <div class="sticky -top-px z-10 flex items-center rounded-b-2xl bg-navy-800 px-6 py-4">
        <!-- TODO: USER DATA -->
        <div class="flex">
          {#if players[i]}
            <img src="{players[i]?.pfpUrl}" alt="" class="h-10 w-10 rounded-lg object-contain" />
          {:else}
            <div class="h-10 w-10 rounded-lg bg-navy-700"></div>
          {/if}
          <p class="ml-4 flex items-center gap-1">
            <span
              class="line-clamp-2 overflow-hidden break-all text-2xs font-bold uppercase text-white md:hidden lg:inline"
            >
              {players[i]?.username || ''}
            </span>
          </p>
        </div>

        <!-- TODO: TOTAL WINNINGS DATA -->
        <div class="ml-auto flex items-center text-xs font-semibold text-white overflow-scroll no-scrollbar">
          {#if winningPositions.includes(i)}
            <svg
              class="icon mr-2 h-4 w-4 text-green transition-opacity duration-1000 {battleMode === 'underdog' ? 'rotate-180' : ''}"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              transition:fade="{{ duration: 250 }}"
            >
              <path d="M1 16L9 11L17 16" stroke-width="3"></path>
              <path d="M1 7L9 2L17 7" stroke-width="3"></path>
            </svg>
          {/if}
          {#key visibleItems}
            <span>
              {convertPrice(
                $page.data.currency,
                wonItems[i].slice(0, visibleItems).reduce((t, d) => (t += d.skinPrice), 0)
              )}
            </span>
            <span class="ml-1 text-navy-200">
              ({convertPrice(
                'eur',
                wonItems[i].slice(0, visibleItems).reduce((t, d) => (t += d.skinPrice), 0)
              )})
            </span>
          {/key}
        </div>
      </div>

      <div class="-my-8 h-16 rounded-b-2xl bg-navy-800"></div>
      <div class="mx-6 opacity-100 transition-opacity duration-500">
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
    </div>
  {/each}
</div>

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
