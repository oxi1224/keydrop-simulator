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
        class="h-15 w-15 mr-1 flex h-[52.5px] w-[52.5px] flex-shrink-0 items-center justify-center rounded-full border text-lg transition {data.mode ===
        'underdog'
          ? 'border-purple-400 bg-[#110515] shadow-[inset_0_0_0.8rem_0.4rem_#4D2858]'
          : 'border-green-500 bg-[#001A07] shadow-[inset_0_0_0.8rem_0.4rem_#1A3024]'}"
      >
        <div
          class="flex h-[70%] w-[70%] items-center justify-center rounded-full border-2 border-green-500 text-center font-bold drop-shadow-[0_0_0.4rem_rgba(232,179,33,0.5)] transition {data.mode ===
          'underdog'
            ? 'border-purple-400 text-purple-400 drop-shadow-[0_0_0.4rem_purple-400/50]'
            : 'border-green-500 text-green-500 drop-shadow-[0_0_0.4rem_rgba(232,179,33,0.5)]'}"
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
          class="button {data.mode === 'underdog'
            ? 'button-pink-dimmed'
            : 'button-green-dimmed'} mr-5 h-12 w-auto flex-1 px-1 transition-all hover:brightness-110"
          href="/case-battle/battle/{data.id}"
        >
          <span>
            <div class="flex items-center gap-2 text-[0.65rem] md:text-xs">
              {#if data.mode === 'classic'}
                <svg class="icon h-5 w-5" viewBox="0 0 44 43" fill="currentColor">
                  <path
                    d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
                  ></path>
                </svg>
              {:else}
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
              {/if}
              {$_(data.mode == 'underdog' ? 'battles.joinUnderdog' : 'battles.joinClassic')}
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
