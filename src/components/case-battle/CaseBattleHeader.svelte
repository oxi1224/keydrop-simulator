<script lang="ts">
  import { _ } from 'svelte-i18n';

  export let title: string;
  export let activeTab: number;
</script>

<div class="mx-auto max-w-screen-2xl overflow-hidden lg:px-5">
  <div
    class="order-2 my-5 flex w-full flex-col items-center justify-between border-b border-gray-700 lg:order-none lg:mb-0 lg:mt-8 lg:flex-row"
  >
    <div
      class="-mb-px hidden self-end border-b border-navy-100 pb-6 pr-10 font-semibold uppercase text-white lg:flex"
    >
      {title}
    </div>
    <div class="relative">
      <div
        class="hide-scrollbar flex items-start overflow-x-auto whitespace-nowrap px-5 pb-1 sm:-mr-4 sm:ml-auto sm:items-end lg:px-0 lg:pb-3"
      >
        <a
          class="-ml-4 flex flex-shrink-0 cursor-pointer items-center px-4 py-3 text-xs uppercase leading-none transition-colors duration-200 hover:text-gold lg:ml-0 {activeTab ===
          0
            ? 'text-gold-400'
            : 'text-navy-100'}"
          href="/case-battle/list"
        >
          <div class="grid-stack mr-2 grid flex-shrink-0 place-items-center">
            <svg
              class="icon h-4 w-4 scale-95 transform opacity-100"
              viewBox="0 0 44 43"
              fill="currentColor"
            >
              <path
                d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
              ></path>
            </svg>
          </div>
          {$_('battles.header.activeBattles')}
        </a>
        <a
          class="flex flex-shrink-0 cursor-pointer items-center px-4 py-3 text-xs uppercase leading-none transition-colors duration-200 hover:text-gold {activeTab ===
          1
            ? 'text-gold-400'
            : 'text-navy-100'}"
          href="/case-battle/list/finished"
        >
          <div class="grid-stack mr-2 grid flex-shrink-0 place-items-center">
            <svg class="icon w-6 opacity-100" viewBox="0 0 69.02 41.04" fill="currentColor">
              <path
                d="M41.02,0V7.85S14.87,34,14.87,34l3.13,3.13-3.13,3.13-5.48-5.47-6.26,6.26-3.13-3.13,6.26-6.26L.78,26.17l3.13-3.13,3.13,3.13L33.21,0h7.81Z"
              ></path>
              <path
                d="M69.02,0V7.85s-26.16,26.15-26.16,26.15l3.13,3.13-3.13,3.13-5.48-5.47-6.26,6.26-3.13-3.13,6.26-6.26-5.48-5.48,3.13-3.13,3.13,3.13L61.21,0h7.81Z"
              ></path>
            </svg>
          </div>
          {$_('battles.header.finishedBattles')}
        </a>
        <a
          class="flex flex-shrink-0 cursor-pointer items-center px-4 py-3 text-xs uppercase leading-none transition-colors duration-200 hover:text-gold {activeTab ===
          2
            ? 'text-gold-400'
            : 'text-navy-100'}"
          href="/case-battle/list/my"
        >
          <div class="grid-stack mr-2 grid flex-shrink-0 place-items-center">
            <svg class="icon h-4 w-4 opacity-100" viewBox="0 0 13 14" fill="currentColor">
              <path
                d="M12.9268 0.620117L12.9248 3.00118L4.98926 10.936L5.93873 11.8862L4.98926 12.8356L3.32735 11.1744L1.42774 13.0733L0.478268 12.1239L2.37788 10.2243L0.715972 8.56236L1.66544 7.61289L2.61558 8.56236L10.5558 0.622132L12.9268 0.620117Z"
              ></path>
            </svg>
          </div>
          {$_('battles.header.myBattles')}
        </a>
        <div
          class="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-transparent opacity-0 transition-opacity duration-200"
          style="--tw-gradient-to: #201e27;"
        ></div>
        <div
          class="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-r from-transparent opacity-100 transition-opacity duration-200"
          style="--tw-gradient-to: #201e27;"
        ></div>
      </div>
    </div>
  </div>
  <div class="order-1 mb-3 flex flex-col lg:order-none lg:my-8 lg:flex-row">
    <div class="relative flex-auto">
      <div
        class="hide-scrollbar flex items-center gap-7 overflow-x-auto whitespace-nowrap px-5 lg:justify-start lg:gap-0 lg:px-0"
      >
        <div class="order-2 flex flex-shrink-0 lg:order-none lg:mr-6 xl:mr-10">
          <svg
            class="icon mr-2.5 h-7 w-7 flex-shrink-0 self-center text-gold-400 sm:mr-3 lg:h-10 lg:w-10"
            viewBox="0 0 44 43"
            fill="currentColor"
          >
            <path
              d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
            ></path>
          </svg>
          <div class="flex flex-col justify-center sm:items-start">
            <h4
              class="my-1 text-base font-bold tabular-nums leading-none text-gold-400 lg:my-1.5 lg:text-xl"
            >
              9999
            </h4>
            <p class="text-10px -mt-1 font-semibold uppercase text-navy-100 sm:text-2xs">
              {$_('battles.active')}
            </p>
          </div>
        </div>
        <div class="order-3 flex flex-shrink-0 lg:order-none lg:mr-6 xl:mr-10">
          <svg
            class="icon mr-2.5 h-7 w-7 flex-shrink-0 self-center text-gold-400 sm:mr-3 lg:h-10 lg:w-10"
            viewBox="0 0 25 25"
            fill="currentColor"
          >
            <path
              d="M2.69922 22.7344C2.69922 20.6126 3.54207 18.5778 5.04236 17.0775C6.54266 15.5772 8.57749 14.7344 10.6992 14.7344C12.821 14.7344 14.8558 15.5772 16.3561 17.0775C17.8564 18.5778 18.6992 20.6126 18.6992 22.7344H2.69922ZM10.6992 13.7344C7.38422 13.7344 4.69922 11.0494 4.69922 7.73438C4.69922 4.41937 7.38422 1.73438 10.6992 1.73438C14.0142 1.73438 16.6992 4.41937 16.6992 7.73438C16.6992 11.0494 14.0142 13.7344 10.6992 13.7344ZM18.0622 15.9674C19.5919 16.3605 20.9585 17.2262 21.9675 18.4412C22.9766 19.6562 23.5766 21.1585 23.6822 22.7344H20.6992C20.6992 20.1244 19.6992 17.7484 18.0622 15.9674ZM16.0392 13.6914C16.8772 12.9418 17.5474 12.0237 18.0058 10.9971C18.4642 9.97053 18.7005 8.85866 18.6992 7.73438C18.7013 6.36784 18.3518 5.02375 17.6842 3.83137C18.8169 4.05896 19.8357 4.67175 20.5677 5.56557C21.2996 6.45939 21.6994 7.5791 21.6992 8.73438C21.6995 9.44684 21.5475 10.1511 21.2533 10.8C20.9592 11.449 20.5298 12.0275 19.9938 12.4969C19.4578 12.9663 18.8277 13.3157 18.1457 13.5217C17.4636 13.7277 16.7454 13.7856 16.0392 13.6914Z"
            ></path>
          </svg>
          <div class="flex flex-col justify-center sm:items-start">
            <h4
              class="my-1 text-base font-bold tabular-nums leading-none text-gold-400 lg:my-1.5 lg:text-xl"
            >
              9999
            </h4>
            <p class="text-10px -mt-1 font-semibold uppercase text-navy-100 sm:text-2xs">
              {$_('battles.online')}
            </p>
          </div>
        </div>
        <div class="order-4 flex flex-shrink-0 lg:order-none">
          <svg
            class="icon lg:w-13 mr-2.5 h-7 w-10 flex-shrink-0 self-center text-gold-400 sm:mr-3 lg:h-10"
            viewBox="0 0 69.02 41.04"
            fill="currentColor"
          >
            <path
              d="M41.02,0V7.85S14.87,34,14.87,34l3.13,3.13-3.13,3.13-5.48-5.47-6.26,6.26-3.13-3.13,6.26-6.26L.78,26.17l3.13-3.13,3.13,3.13L33.21,0h7.81Z"
            ></path>
            <path
              d="M69.02,0V7.85s-26.16,26.15-26.16,26.15l3.13,3.13-3.13,3.13-5.48-5.47-6.26,6.26-3.13-3.13,6.26-6.26-5.48-5.48,3.13-3.13,3.13,3.13L61.21,0h7.81Z"
            ></path>
          </svg>
          <div class="flex flex-col justify-center sm:items-start">
            <h4
              class="my-1 text-base font-bold tabular-nums leading-none text-gold-400 lg:my-1.5 lg:text-xl"
            >
              9999
            </h4>
            <p class="text-10px -mt-1 font-semibold uppercase text-navy-100 sm:text-2xs">
              {$_('battles.battlesPlayed')}
            </p>
          </div>
        </div>
        <div class="hidden h-12 w-px bg-navy-500 lg:mx-6 lg:block xl:mx-10"></div>
        <div
          class="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-transparent opacity-0 transition-opacity duration-200"
          style="--tw-gradient-to: #201e27;"
        ></div>
        <div
          class="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-r from-transparent opacity-100 transition-opacity duration-200"
          style="--tw-gradient-to: #201e27;"
        ></div>
      </div>
    </div>
    <div class="ml-auto mr-6 mt-5 w-full px-5 lg:mb-0 lg:mt-0 lg:w-auto lg:px-0">
      <slot />
    </div>
    <div class="mt-3 hidden w-full px-5 sm:flex lg:mt-0 lg:w-64 lg:px-0">
      <a
        class="button button-primary h-15 mr-auto w-full lg:mr-0 lg:mt-0 lg:h-12"
        href="/case-battle/create"
      >
        <svg class="icon mr-2 h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="none">
          <path
            fill="currentColor"
            d="M17.833 6.166c-3.216-3.216-8.45-3.216-11.666 0-3.217 3.217-3.217 8.45 0 11.667 3.216 3.216 8.45 3.216 11.666 0 3.217-3.216 3.217-8.45 0-11.667zm-5.008 9.917h-1.65v-3.258H7.917v-1.65h3.258V7.916h1.65v3.259h3.258v1.65h-3.258v3.258z"
          ></path>
        </svg>
        <span>{$_('battles.header.createBattle')}</span>
      </a>
    </div>
  </div>
  <div class="order-3 mb-4 ml-auto mt-2 flex w-full px-5 sm:hidden lg:px-0">
    <a
      class="button button-primary h-15 mr-auto w-full lg:mr-0 lg:mt-0 lg:h-12"
      href="/case-battle/create"
    >
      <svg class="icon mr-2 h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="none">
        <path
          fill="currentColor"
          d="M17.833 6.166c-3.216-3.216-8.45-3.216-11.666 0-3.217 3.217-3.217 8.45 0 11.667 3.216 3.216 8.45 3.216 11.666 0 3.217-3.216 3.217-8.45 0-11.667zm-5.008 9.917h-1.65v-3.258H7.917v-1.65h3.258V7.916h1.65v3.259h3.258v1.65h-3.258v3.258z"
        ></path>
      </svg>
      <span>{$_('battles.header.createBattle')}</span>
    </a>
  </div>
</div>
