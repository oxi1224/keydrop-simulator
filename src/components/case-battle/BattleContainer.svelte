<script lang="ts">
  import { page } from '$app/stores';
  import { convertPrice, type CaseBattle } from '$lib';
  import { _ } from 'svelte-i18n';
  export let data: CaseBattle;
</script>

<tr class="relative z-0 my-10" style="opacity: 1; transform-origin: 50% 50% 0px;">
  <td class="rounded-bl-full rounded-tl-full bg-navy-750">
    <div
      data-testid="case_battle_list_item_round"
      class="mr-1 flex h-[96px] w-[96px] items-center justify-center rounded-full border border-[#30663F] bg-[#001A07] text-2xl shadow-[inset_0_0_0.8rem_0.4rem_#1A3024] transition"
    >
      <div
        class="flex h-[56%] w-[56%] items-center justify-center rounded-full border-2 border-green-500 text-center font-bold text-green-500 drop-shadow-[0_0_0.4rem_rgba(232,179,33,0.5)] transition"
      >
        {data.totalCases}
      </div>
    </div>
  </td>
  <td class="css-16r72od h-24 bg-navy-750 px-1 py-2">
    <div class="relative h-full max-w-[469px] 2xl:max-w-[659px]">
      <div class="hide-scrollbar flex h-full gap-x-2.5 overflow-x-auto">
        {#each data.caseData as caseData}
          <div
            class="relative flex h-full w-[85px] max-w-[85px] flex-shrink-0 flex-col items-center overflow-hidden rounded-md pb-2 text-xs uppercase"
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
                <p class="text-xs font-semibold leading-none text-white">{caseData.count}</p>
              </div>
            </div>
            <p
              class="relative mt-auto line-clamp-2 max-w-full overflow-hidden break-words px-1 text-center text-[10px] font-semibold leading-none text-white"
            >
              {caseData.websiteName}
            </p>
          </div>
          <div
            class="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-transparent opacity-0 transition-opacity duration-200"
            style="--tw-gradient-to: #17171C;"
          ></div>
          <div
            class="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-r from-transparent opacity-100 transition-opacity duration-200"
            style="--tw-gradient-to: #17171C;"
          ></div>
        {/each}
      </div>
    </div>
  </td>
  <td class="bg-navy-750 p-0">
    <div
      class="css-16r72od flex w-28 items-center justify-center rounded-bl-lg rounded-tl-lg bg-navy-700"
    >
      <span class="text-center text-sm font-bold text-white">
        {convertPrice($page.data.currency, data.totalPrice)}
      </span>
    </div>
  </td>
  <td class="border-l border-navy-600 bg-navy-700">
    <div class="flex w-48 items-center justify-center">
      {#each new Array(data.playerCount) as dummy, i}
        <div class="flex flex-wrap justify-center">
          {#if data.players[i]}
            <img
              src="{data.players[i].pfpUrl}"
              class="css-gokeqi mx-1 h-5 w-5 rounded-full"
              alt=""
            />
          {:else}
            <div class="border-navy-250 mx-1 h-5 w-5 rounded-full border border-dashed"></div>
          {/if}
        </div>
      {/each}
      <p class="ml-4 text-base font-bold text-white">
        <span class="text-green">{Object.keys(data.players).length}</span>
        / {data.playerCount}
      </p>
    </div>
  </td>
  <td class="p-0">
    <div class="relative w-80 rounded-br-lg rounded-tr-lg border-l border-navy-600 bg-navy-700">
      <div class="css-16r72od relative z-10 flex h-24 w-full items-center px-2">
        {#if !data.finished}
          <a
            class="button button-green-dimmed ml-1 mr-5 w-auto flex-1 px-1 transition-all hover:brightness-110"
            href="/case-battle/{data.id}"
          >
            <span>
              <div class="flex items-center gap-2">
                <svg class="icon h-5 w-5" viewBox="0 0 44 43" fill="currentColor">
                  <path
                    d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
                  ></path>
                </svg>
                {$_('battles.joinClassic')}
              </div>
            </span>
          </a>
        {:else}
          <a
            class="button button-secondary ml-1 mr-5 h-12 w-auto flex-1 px-1"
            href="/case-battle/{data.id}"
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
  </td>
</tr>
