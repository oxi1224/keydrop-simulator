<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { createToast, convertPrice } from '$lib';
  import { _ } from 'svelte-i18n';
  import { Menu, MenuButton, MenuItems, Transition, MenuItem } from '@rgossiaux/svelte-headlessui';

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

<div class="order-5 ml-auto flex self-stretch rounded-l-2xl md:bg-navy-800/80">
  <div class="hidden items-center gap-x-3 pl-3 lg:flex lg:pl-5">
    <div class="flex h-full items-center gap-x-5">
      <div class="flex items-center gap-x-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#000902] lg:h-9 lg:w-9">
          <svg
            class="icon h-4 w-4 flex-shrink-0 text-lightgreen lg:h-5 lg:w-5"
            viewBox="0 0 22 19"
            fill="currentColor"
          >
            <path
              d="M20.825 3.5h-7a6 6 0 0 0 0 12h7v2a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2Zm-7 2h8v8h-8a4 4 0 1 1 0-8Zm0 3v2h3v-2h-3Z"
            ></path>
          </svg>
        </div>
        <div class="text-gray-300">
          <p class="text-xs font-bold tabular-nums text-lightgreen lg:text-sm">
            <span>{convertPrice($page.data.currency, $page.data.user?.balance)}</span>
          </p>
          <p class="whitespace-nowrap text-2xs font-semibold uppercase leading-none tracking-wider">
            {$_('header.balance')}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div
    class="flex items-center justify-center rounded-l-2xl md:bg-[#121216] md:px-3 lg:px-5"
    style="opacity: 1;"
  >
    <button
      on:click="{togglePayment}"
      class="group relative flex h-9 items-center gap-x-3 overflow-hidden whitespace-nowrap rounded-[0.25rem] border border-lightgreen-200 bg-gradient-to-l from-lightgreen-100/25 to-transparent bg-[length:100%_100%] px-2 py-2 transition-[background-size] duration-200 after:absolute after:right-0 after:top-0 after:rotate-12 hover:bg-[length:150%_150%] sm:gap-x-2 sm:bg-gradient-to-r md:h-auto md:rounded-lg lg:px-4 lg:py-3"
    >
      <svg
        class="icon h-4 w-4 flex-shrink-0 text-lightgreen lg:h-5 lg:w-5"
        viewBox="0 0 22 19"
        fill="currentColor"
      >
        <path
          d="M20.825 3.5h-7a6 6 0 0 0 0 12h7v2a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2Zm-7 2h8v8h-8a4 4 0 1 1 0-8Zm0 3v2h3v-2h-3Z"
        ></path>
      </svg>
      <div class="flex gap-1.5">
        <span class="hidden text-xs font-bold uppercase text-white sm:inline">
          {$_('header.deposit')}
        </span>
        <svg viewBox="0 0 12 11" class="h-3 w-3 fill-lightgreen sm:hidden">
          <path
            d="M11.1019 7.10003H7.32186V10.98H4.68186V7.10003H0.901855V4.66003H4.68186V0.780029H7.32186V4.66003H11.1019V7.10003Z"
          ></path>
        </svg>
      </div>
      <div
        class="absolute right-0 hidden rotate-[30deg] text-6xl font-bold leading-none text-lightgreen-200 opacity-5 transition-transform duration-200 group-hover:-translate-x-6 group-hover:translate-y-3 group-hover:rotate-[30deg] group-hover:scale-125 group-hover:duration-[400ms] group-hover:ease-[cubic-bezier(0.03,0.69,0.15,0.86)] sm:block"
      >
        $
      </div>
    </button>
  </div>

  <div
    class="flex items-center self-stretch rounded-l-2xl pl-4 pr-3 md:gap-3 md:bg-navy-550 md:pl-3 lg:gap-4 lg:px-5"
  >
    <div class="hidden flex-col gap-3 md:flex" style="opacity: 1;">
      <a href="/panel/profil" class="min-w-[10rem] text-sm font-bold text-white md:min-w-[9rem]">
        {$page.data.user?.username}
      </a>
      <div class="flex items-center gap-2">
        <a href="/#gold-area" class="cursor-pointer">
          <span class="flex items-center gap-1 text-xs font-bold tabular-nums text-gold">
            <img src="/images/gold-coin.svg" alt="" class="h-4 w-4 object-contain" />
            <span>{$page.data.user?.goldBalance}</span>
          </span>
        </a>
      </div>
    </div>
    <div>
      <a
        href="/panel/profil"
        aria-label="Profil"
        class="hidden h-16 w-16 overflow-hidden rounded-full md:block"
      >
        <img class="w-auto" src="{$page.data.user?.pfpUrl}" alt="" />
      </a>
    </div>
    <Menu let:open>
      <MenuButton
        class="h-9 w-9 cursor-pointer rounded bg-navy-400 p-2 transition md:h-auto md:w-auto md:rounded-md md:hover:bg-navy-300"
      >
        <svg
          class="duration-250 css-30myhr hidden h-2.5 w-2.5 text-white transition ease-out md:block"
          style="transform: rotateX({open ? '180' : ''}deg)"
        >
          <use xlink:href="/icons/icons.svg#arrow-down"></use>
        </svg>
        <svg class="h-5 w-5 text-white md:hidden">
          <use xlink:href="/icons/icons.svg#mobile-hamburger"></use>
        </svg>
      </MenuButton>
      <div
        class="fixed left-0 top-[4.125rem] z-50 md:absolute md:left-auto md:right-6 md:top-[5.625rem]"
      >
        <Transition
          show="{open}"
          enter="transition-all duration-200"
          enterFrom="scale-90 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition-all duration-200"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-90 opacity-0"
        >
          <div
            class="flex h-screen w-screen origin-top transform flex-col overflow-scroll bg-navy-550 opacity-100 focus:outline-none md:h-auto md:w-60 md:origin-top-right md:overflow-hidden md:rounded-b-xl"
          >
            <MenuItems class="flex flex-col">
              <MenuItem>
                <div
                  class="flex items-center rounded-b-xl rounded-t-xl bg-navy-750 px-2.5 py-6 md:rounded-t-none md:p-5"
                  role="none"
                >
                  <a class="flex-shrink-0" href="/panel/profil">
                    <img
                      src="{$page.data.user?.pfpUrl}"
                      alt=""
                      class="md:h-13 md:w-13 mr-5 h-16 w-16 rounded-lg object-cover md:mr-4"
                    />
                  </a>
                  <div class="w-full md:w-auto">
                    <a
                      href="/panel/profil"
                      class="block text-base font-semibold uppercase text-navy-100 md:mb-1 md:text-sm"
                    >
                      {$page.data.user?.username}
                    </a>
                    <div class="flex items-center">
                      <svg
                        class="icon mr-2 h-4 w-4 text-white md:h-3.5 md:w-3.5"
                        viewBox="0 0 22 19"
                        fill="currentColor"
                        role="none"
                      >
                        <path
                          d="M20.825 3.5h-7a6 6 0 0 0 0 12h7v2a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2Zm-7 2h8v8h-8a4 4 0 1 1 0-8Zm0 3v2h3v-2h-3Z"
                          role="none"
                        ></path>
                      </svg>
                      <span
                        class="saldo_punkty text-base font-bold uppercase tabular-nums text-white md:text-sm md:font-semibold"
                        role="none"
                      >
                        {convertPrice($page.data.currency, $page.data.user?.balance ?? 0)}
                      </span>
                    </div>
                    <div
                      class="mt-1 flex w-full items-center gap-2.5 border-t border-navy-400 pt-2 md:hidden"
                      role="none"
                    >
                      <span class="cursor-pointer">
                        <span
                          class="flex items-center gap-1 text-xs font-bold tabular-nums text-gold"
                        >
                          <img
                            src="/images/gold-coin.svg?v85"
                            alt=""
                            class="h-4 w-4 object-contain"
                          />
                          {$page.data.user?.goldBalance}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <a
                  href="/panel/profil"
                  class="flex items-center py-2.5 text-white hover:bg-gold hover:text-navy-750"
                >
                  <svg class="mx-10 h-6 w-6 md:mx-6 md:h-4 md:w-4">
                    <use xlink:href="/icons/icons.svg#new-account"></use>
                  </svg>
                  <span class="text-base capitalize md:text-sm">{$_('header.nav.myAccount')}</span>
                </a>
              </MenuItem>
              <MenuItem disabled>
                <p class="my-2 ml-10 text-xs text-navy-100 md:ml-6" role="none">
                  {$_('header.nav.games')}
                </p>
              </MenuItem>
              <MenuItem>
                <a
                  href="/case-battle/list"
                  class="flex items-center py-2.5 text-white hover:bg-gold hover:text-navy-750"
                >
                  <svg class="mx-10 h-6 w-6 md:mx-6 md:h-4 md:w-4">
                    <use xlink:href="/icons/icons.svg#case-battle-swords"></use>
                  </svg>
                  <span class="text-base capitalize md:text-sm">Case Battle</span>
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="/skins/upgrader"
                  class="flex items-center py-2.5 text-white hover:bg-gold hover:text-navy-750"
                >
                  <svg class="mx-10 h-6 w-6 md:mx-6 md:h-4 md:w-4">
                    <use xlink:href="/icons/icons.svg#upgrader"></use>
                  </svg>
                  <span class="text-base capitalize md:text-sm">Upgrader</span>
                </a>
              </MenuItem>
              <MenuItem>
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
                    class="mt-3 flex w-full items-center border-t border-t-navy-400 py-3 text-white hover:bg-gold hover:text-navy-750 md:rounded-b-xl"
                    type="submit"
                  >
                    <svg class="mx-10 h-6 w-6 md:mx-6 md:h-4 md:w-4">
                      <use xlink:href="/icons/icons.svg#new-logout"></use>
                    </svg>
                    <span class="text-base capitalize md:text-sm">{$_('header.logout')}</span>
                  </button>
                </form>
              </MenuItem>
            </MenuItems>
          </div>
        </Transition>
      </div>
    </Menu>
  </div>
</div>
