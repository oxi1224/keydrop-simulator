<script lang="ts">
  import { page } from '$app/stores';
  import { convertPrice, type CaseBattle } from '$lib';
  import { _ } from 'svelte-i18n';
  export let data: CaseBattle;
</script>

<div
  class="relative mb-5 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-navy-750"
  style="border-top-left-radius: 2rem;"
>
  <div class="relative z-10 flex flex-col">
    <div class="flex items-center pb-5 pr-5">
      <div
        class="h-15 w-15 mr-1 flex h-[52.5px] w-[52.5px] flex-shrink-0 items-center justify-center rounded-full border border-green-500 bg-[#001A07] text-lg shadow-[inset_0_0_0.8rem_0.4rem_#1A3024] transition"
      >
        <div
          class="flex h-[70%] w-[70%] items-center justify-center rounded-full border-2 border-green-500 text-center font-bold text-green-500 drop-shadow-[0_0_0.4rem_rgba(232,179,33,0.5)] transition"
          style="filter: drop-shadow(rgba(232, 179, 33, 0.5) 0px 0px 5.6px);"
        >
          {data.totalCases}
        </div>
      </div>
      <div class="flex w-full self-start pt-5">
        <span class="ml-4 text-center text-lg font-bold leading-4 text-white md:text-base">
          {convertPrice($page.data.currency, data.totalPrice)}
        </span>
        <div class="ml-auto flex flex-wrap justify-center">
          {#each new Array(data.playerCount) as dummy, i}
            {#if data.players[i]}
              <img
                src="{data.players[i].pfpUrl}"
                class="mx-1 h-4 w-4 rounded-full md:h-5 md:w-5"
                alt=""
              />
            {:else}
              <div
                class="border-navy-250 mx-1 h-4 w-4 rounded-full border border-dashed md:h-5 md:w-5"
              ></div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
    <div
      class="flex max-w-full space-x-2.5 overflow-hidden px-5"
      style="mask-image: linear-gradient(to right, transparent, black 0rem, black, black calc(100% - 80px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 0rem, black, black calc(100% - 80px), transparent);"
    >
      {#each data.caseData as caseData}
        <div
          class="relative flex h-[72px] min-h-[72px] w-[72px] min-w-[72px] flex-col items-center overflow-hidden rounded-md pb-2 text-xs uppercase"
        >
          <img
            src="{caseData.imgName}"
            class="absolute inset-0 h-full w-full object-cover"
            alt=""
          />
          <div class="css-1hbq3z7 absolute inset-0"></div>
          <div class="relative flex w-full justify-start">
            <div
              class="flex h-5 w-5 items-center justify-center rounded-br-md rounded-tl-md bg-navy-600"
            >
              <p class="text-[10px] font-semibold leading-none text-white">{caseData.count}</p>
            </div>
          </div>
          <p
            class="relative mt-auto line-clamp-2 max-w-full overflow-hidden break-words px-1 text-center text-[10px] font-semibold leading-none text-white"
          >
            STACK
          </p>
        </div>
      {/each}
      {#each new Array(9 - data.caseData.length < 0 ? 0 : 9 - data.caseData.length) as dummy}
        <div class="h-[72px] w-[72px] min-w-[72px] max-w-[72px] rounded-md bg-navy-600"></div>
      {/each}
    </div>
    <div class="relative flex p-5">
      {#if !data.finished}
        <a
          class="button button-green-dimmed mr-5 h-12 w-auto flex-1 px-1 transition-all hover:brightness-110"
          href="/case-battle/battle/{data.id}"
        >
          <span>
            <div class="flex items-center gap-2 text-[0.65rem] md:text-xs">
              <svg class="icon h-4 w-4 md:h-5 md:w-5" viewBox="0 0 44 43" fill="currentColor">
                <path
                  d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
                ></path>
              </svg>
              {$_('battles.joinClassic')}
            </div>
          </span>
        </a>
        <a class="button button-secondary !h-12 !w-12 !p-0" href="/case-battle/battle/{data.id}">
          <svg class="icon h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 20 20" fill="none">
            <path
              fill="currentColor"
              d="M10 4.167c-6.36 0-8.272 5.514-8.29 5.57L1.622 10l.088.263c.018.056 1.93 5.57 8.29 5.57 6.361 0 8.273-5.514 8.29-5.57L18.38 10l-.088-.263c-.018-.056-1.93-5.57-8.29-5.57zm0 9.166A3.337 3.337 0 016.667 10 3.337 3.337 0 0110 6.667 3.337 3.337 0 0113.334 10 3.337 3.337 0 0110 13.333z"
            ></path>
            <path
              fill="currentColor"
              d="M10 8.333A1.69 1.69 0 008.333 10 1.69 1.69 0 0010 11.667 1.69 1.69 0 0011.666 10 1.69 1.69 0 0010 8.333z"
            ></path>
          </svg>
        </a>
      {:else}
        <a
          class="button button-secondary h-12 w-auto flex-1 px-1"
          href="/case-battle/battle/{data.id}"
        >
          <svg class="icon mr-2 h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 20 20" fill="none">
            <path
              fill="currentColor"
              d="M10 4.167c-6.36 0-8.272 5.514-8.29 5.57L1.622 10l.088.263c.018.056 1.93 5.57 8.29 5.57 6.361 0 8.273-5.514 8.29-5.57L18.38 10l-.088-.263c-.018-.056-1.93-5.57-8.29-5.57zm0 9.166A3.337 3.337 0 016.667 10 3.337 3.337 0 0110 6.667 3.337 3.337 0 0113.334 10 3.337 3.337 0 0110 13.333z"
            ></path>
            <path
              fill="currentColor"
              d="M10 8.333A1.69 1.69 0 008.333 10 1.69 1.69 0 0010 11.667 1.69 1.69 0 0011.666 10 1.69 1.69 0 0010 8.333z"
            ></path>
          </svg>
          <span>{$_('battles.viewBattle')}</span>
        </a>
      {/if}
    </div>
  </div>
</div>
