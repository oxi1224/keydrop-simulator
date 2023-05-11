<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { createToast, localisePrice } from '$lib';
  import { _ } from 'svelte-i18n';

  function toggleDropdown() {
    document.getElementById('user-dropdown')!.classList.toggle('is-open');
  }

  $: $page.form
    ? /* eslint-disable indent */
      createToast({
        header: $page.form.success ? $_('success') : $_('error'),
        message: $_($page.form?.messageKey),
        type: $page.form.success ? 'success' : 'error'
      })
    : null;
  /* eslint-disable indent */
</script>

<div class="h-full hidden items-center ml-auto md:flex">
  {#if $page.data.user}
    <div class="h-16 flex items-center">
      <div class="flex items-center bg-navy-700 rounded-md p-3">
        <div class="flex items-center">
          <div>
            <span class="flex flex-row text-navy-200 text-2xs items-center font-bold space-x-1.5">
              <img src="/icons/wallet.svg" alt="wallet" class="object-contain w-3 h-3 mr-1.5" />
              {$_('header.wallet')}:
              <span class="text-gold font-semibold text-sm md:text-xs">
                {localisePrice(
                  page,
                  $page.data.user?.balance
                )}&nbsp;{$page.data.currency.toUpperCase()}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex ml-9 h-16">
        <div class="flex flex-col justify-evenly">
          <span class="font-semibold text-sm text-navy-200 h-min">{$page.data.user.username}</span>
          <div class="flex flex-row items-center">
            <img src="/icons/gold-coin.webp" alt="coin" class="object-contain w-4 h-4 mr-1" />
            <span class="text-gold-600 font-semibold text-xs whitespace-nowrap">
              {$page.data.user.goldBalance}
            </span>
          </div>
        </div>
      </div>
      <div class="ml-6 flex items-center">
        <a href="/panel/profil">
          <img
            src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/eb/ebd92149e5950221fcb87ca8475493b8e77833f3_full.jpg"
            alt="Avatar"
            class="object-cover transition-all duration-200 rounded-md w-14 h-14 hover:rounded-xl"
            referrerpolicy="no-referrer"
          />
        </a>
        <button class="flex items-center px-4 self-stretch group" on:click="{toggleDropdown}">
          <div
            class="flex items-center justify-center w-5 h-5 transition-all duration-200 border border-solid rounded-md border-navy-300 bg-navy-800 group-hover:border-navy-100"
          >
            <svg class="mt-px text-white" style="width: 10px; height: 10px">
              <use xlink:href="/icons/icons.svg#arrow-down"></use>
            </svg>
          </div>
        </button>
      </div>
    </div>
  {:else}
    <a class="hidden ml-5 md:flex button button-primary h-13 uppercase" href="/login">
      {$_('header.login')}
    </a>
  {/if}
</div>
<div
  id="user-dropdown"
  class="absolute z-40 invisible transition-all duration-300 right-5 top-full is-open:visible"
>
  <div
    class="fixed inset-0 z-0 transition-opacity duration-300 outline-none opacity-0 bg-navy-600 in-open:opacity-70"
    on:click="{toggleDropdown}"
    on:keypress="{() => null}"
  ></div>
  <div
    class="z-10 min-w-max bg-navy-900 overflow-hidden border border-solid border-navy-400 rounded-bl-2xl rounded-br-2xl absolute top-0 right-0 opacity-0 transition duration-300 scale-90 origin-top-right in-open:opacity-100 in-open:scale-100"
  >
    <div class="pt-6 pb-3 bg-navy-600">
      <div class="flex flex-col px-5">
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
            <span class="font-semibold text-sm text-white h-min">{$page.data.user?.username}</span>
            <span class="flex flex-row text-navy-200 text-3xs items-center font-light">
              {$_('header.wallet')}:
            </span>
            <span class="text-gold font-semibold text-xs">
              {localisePrice(page, $page.data.user?.balance)}
              {$page.data.currency.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <nav class="mt-5">
        <ul class="text-navy-100">
          <li>
            <a
              rel="alternate"
              hreflang="pl"
              href="/panel/profil"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
                <use xlink:href="/icons/nav-icons.svg#person"></use>
              </svg>
              {$_('header.nav.myAccount')}
            </a>
            <!-- </li>
          <li>
            <a
              href="d"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
                <use xlink:href="/icons/nav-icons.svg#barcode"></use>
              </svg>
              Kod promocyjny
            </a>
          </li>
          <li>
            <a
              rel="alternate"
              hreflang="pl"
              href="https://key-drop.com/pl/skin-changer"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
                <use xlink:href="/icons/nav-icons.svg#lightning"></use>
              </svg>
              Skin Changer
            </a>
          </li>
          <li>
            <a
              rel="alternate"
              hreflang="pl"
              href="https://key-drop.com/pl/panel/profil/contracts"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
                <use xlink:href="/icons/nav-icons.svg#contracts"></use>
              </svg>
              Kontrakty
            </a>
          </li>
          <li>
            <a
              rel="alternate"
              hreflang="pl"
              href="https://key-drop.com/pl/panel/profil/affiliate-system"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
                <use xlink:href="/icons/nav-icons.svg#wallet"></use>
              </svg>
              Program partnerski
            </a>
          </li>
          <li>
            <a
              rel="alternate"
              hreflang="pl"
              href="https://key-drop.com/pl/panel/profil/support-chat"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
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
          <li>
            <a
              rel="alternate"
              hreflang="pl"
              href="https://key-drop.com/pl/ProvablyFair"
              class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
            >
              <svg class="w-6 h-6 mr-3">
                <use xlink:href="/icons/nav-icons.svg#shield"></use>
              </svg>
              Provably Fair
            </a>
          </li>
          <li> -->
            <form
              action="/login?/logout"
              method="POST"
              use:enhance="{() => {
                return async ({ result }) => {
                  invalidateAll();
                  await applyAction(result);
                  window.location.reload();
                };
              }}"
            >
              <button
                type="submit"
                class="flex items-center px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap hover:text-white"
              >
                <svg class="w-6 h-6 mr-3">
                  <use xlink:href="/icons/nav-icons.svg#logout"></use>
                </svg>
                {$_('header.nav.logout')}
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</div>
