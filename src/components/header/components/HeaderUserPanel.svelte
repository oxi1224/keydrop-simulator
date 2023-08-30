<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { createToast, convertPrice } from '$lib';
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

  function togglePayment() {
    document.querySelector('.setBalanceForm')!.classList.toggle('is-open');
  }
</script>

<div class="ml-auto hidden h-full items-center md:flex">
  {#if $page.data.user}
    <div class="flex h-16 items-center">
      <div class="flex items-center rounded-md bg-navy-700 p-3">
        <div class="flex items-center">
          <div>
            <span class="flex flex-row items-center space-x-1.5 text-2xs font-bold text-navy-200">
              <img src="/icons/wallet.svg" alt="wallet" class="mr-1.5 h-3 w-3 object-contain" />
              {$_('header.wallet')}:
              <span class="text-sm font-semibold text-gold md:text-xs">
                {convertPrice($page.data.currency, $page.data.user?.balance)}
              </span>
            </span>
          </div>
          <div class="ml-6 flex items-center">
            <button
              class="hotjaropen group flex h-8 flex-shrink-0 items-center rounded-md border border-gold-500 bg-gold-900 text-gold-500 transition-colors duration-200 hover:bg-gold-850"
              on:click="{togglePayment}"
            >
              <div
                class="hotjaropen my-1.5 ml-1.5 flex items-center justify-center rounded bg-navy-800 text-white outline-none focus:outline-none"
                style="height: 18px; width: 18px;"
              >
                <svg viewBox="0 0 6 6" class="h-1.5 w-1.5 stroke-current">
                  <path d="M3 0V6"></path>
                  <path d="M6 3L-1.19125e-07 3"></path>
                </svg>
              </div>
              <div class="text-10px mx-2 text-2xs font-semibold uppercase">
                {$_('header.addBalance')}
              </div>
              <div class="w-0.5"></div>
            </button>
          </div>
        </div>
      </div>
      <div class="ml-9 flex h-16">
        <div class="flex flex-col justify-evenly">
          <span class="h-min text-sm font-semibold text-navy-200">{$page.data.user.username}</span>
          <div class="flex flex-row items-center">
            <img src="/icons/gold-coin.webp" alt="coin" class="mr-1 h-4 w-4 object-contain" />
            <span class="whitespace-nowrap text-xs font-semibold text-gold-600">
              {$page.data.user.goldBalance}
            </span>
          </div>
        </div>
      </div>
      <div class="ml-6 flex items-center">
        <a href="/panel/profil">
          <img
            src="{$page.data.user?.pfpUrl}"
            alt="Avatar"
            class="h-14 w-14 rounded-md object-cover transition-all duration-200 hover:rounded-xl"
            referrerpolicy="no-referrer"
          />
        </a>
        <button class="group flex items-center self-stretch px-4" on:click="{toggleDropdown}">
          <div
            class="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-navy-300 bg-navy-800 transition-all duration-200 group-hover:border-navy-100"
          >
            <svg class="mt-px text-white" style="width: 10px; height: 10px">
              <use xlink:href="/icons/icons.svg#arrow-down"></use>
            </svg>
          </div>
        </button>
      </div>
    </div>
  {:else}
    <a class="button button-primary h-13 ml-5 hidden uppercase md:flex" href="/login">
      {$_('header.login')}
    </a>
  {/if}
</div>
<div
  id="user-dropdown"
  class="invisible absolute right-5 top-full z-40 transition-all duration-300 is-open:visible"
>
  <div
    class="fixed inset-0 z-0 bg-navy-600 opacity-0 outline-none transition-opacity duration-300 in-open:opacity-70"
    on:click="{toggleDropdown}"
    on:keypress="{() => null}"
  ></div>
  <div
    class="absolute right-0 top-0 z-10 min-w-max origin-top-right scale-90 overflow-hidden rounded-bl-2xl rounded-br-2xl border border-solid border-navy-400 bg-navy-900 opacity-0 transition duration-300 in-open:scale-100 in-open:opacity-100"
  >
    <div class="bg-navy-600 pb-3 pt-6">
      <div class="flex flex-col px-5">
        <div class="flex flex-row items-center">
          <a href="/panel/profil">
            <img
              src="{$page.data.user?.pfpUrl}"
              alt="Avatar"
              class="h-14 w-14 rounded-md object-cover transition-all duration-200 hover:rounded-xl"
              referrerpolicy="no-referrer"
            />
          </a>
          <div class="ml-5">
            <span class="h-min text-sm font-semibold text-white">{$page.data.user?.username}</span>
            <span class="flex flex-row items-center text-3xs font-light text-navy-200">
              {$_('header.wallet')}:
            </span>
            <span class="text-xs font-semibold text-gold">
              {convertPrice($page.data.currency, $page.data.user?.balance)}
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
              class="flex items-center whitespace-nowrap px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 hover:text-white"
            >
              <svg class="mr-3 h-6 w-6">
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
                class="flex items-center whitespace-nowrap px-5 py-2.5 text-xs font-semibold uppercase transition-colors duration-200 hover:text-white"
              >
                <svg class="mr-3 h-6 w-6">
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
