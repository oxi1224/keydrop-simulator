<script>
  import { userData } from '$lib';
</script>

<div
  class="nav mobile-nav transition-all ease-in-out duration-200 absolute top-0 right-0 z-20 w-screen h-screen pb-20 mt-20 "
>
  <nav class="bg-navy-900 py-5">
    <ul class="flex flex-wrap text-navy-100">
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="/panel/profil"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#person"></use>
          </svg>
          Moje konto
        </a>
      </li>
      <li class="w-1/2">
        <button
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white open-promo-code-modal"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#barcode"></use>
          </svg>
          Kod promocyjny
        </button>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/skin-changer"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#lightning"></use>
          </svg>
          Skin Changer
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/case-battle"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg viewBox="0 0 44 43" class="w-6 h-6 mr-3 fill-current">
            <path
              d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
            ></path>
          </svg>
          CASE BATTLE
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/panel/profil/contracts"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="w-6 h-6 mr-2 icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3,5v14c0,1.104,0.896,2,2,2h14c1.104,0,2-0.896,2-2V5c0-1.104-0.896-2-2-2H5C3.896,3,3,3.896,3,5z M10,7h8v2h-8V7z M10,11 h8v2h-8V11z M10,15h8v2h-8V15z M6,7h2v2H6V7z M6,11h2v2H6V11z M6,15h2v2H6V15z"
            ></path>
          </svg>
          Kontrakty
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/panel/profil/affiliate-system"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#wallet"></use>
          </svg>
          Program partnerski
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/panel/profil/support-chat"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#buoy"></use>
          </svg>
          Pomoc
          <div
            id="new_message"
            class="flex items-center justify-center w-6 h-6 ml-2 -mt-px text-xs font-bold leading-none text-center text-white rounded-full bg-gold"
            style="font-size: 9px;width: 15px; height: 15px;display:none;"
          >
            1
          </div>
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/ProvablyFair"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#shield"></use>
          </svg>
          Provably Fair
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/Daily_free"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#box"></use>
          </svg>
          Codzienna skrzynia
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="/skins/upgrader"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#donut-chart"></use>
          </svg>
          UPGRADER
        </a>
      </li>
      <li class="w-1/2">
        <a
          rel="alternate"
          hreflang="pl"
          href="/logout"
          class="flex items-center px-5 py-4 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
        >
          <svg class="flex-shrink-0 w-6 h-6 mr-3">
            <use xlink:href="/icons/nav-icons.svg#logout"></use>
          </svg>
          Wyloguj się
        </a>
      </li>
    </ul>
  </nav>
  <div class="bg-navy-700 px-3 py-5 flex flex-row">
    {#if $userData}
      <div class="flex flex-col items-center w-fit">
        <div class="flex flex-row items-center">
          <a href="/panel/profil">
            <img
              src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/eb/ebd92149e5950221fcb87ca8475493b8e77833f3_full.jpg"
              alt="Avatar"
              class="object-cover transition-all duration-200 rounded-md w-14 h-14 hover:rounded-xl"
              referrerpolicy="no-referrer"
            />
          </a>
          <div class="ml-5">
            <span class="font-semibold text-sm text-white h-min">{$userData.username}</span>
            <span class="flex flex-row text-navy-200 text-3xs items-center font-light">
              PORTFEL:
            </span>
            <span class="text-gold font-semibold text-xs">
              {$userData.balance.toFixed(2)} PLN
            </span>
          </div>
        </div>
      </div>
      <div class="flex flex-row items-center ml-auto">
        <img src="/icons/gold-coin.png" alt="coin" class="object-contain w-4 h-4 mr-1" />
        <span class="text-gold-600 font-semibold text-xs whitespace-nowrap">
          {$userData.goldBalance}
        </span>
      </div>
    {:else}
      <a class="hidden ml-5 md:flex button button-primary h-13 uppercase w-full" href="/login">
        zaloguj się
      </a>
    {/if}
  </div>
</div>
