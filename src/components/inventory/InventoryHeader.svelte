<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { createToast, convertPrice } from '$lib';
  import { _ } from 'svelte-i18n';

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

<header class="container mx-auto mt-6">
  <div class="flex justify-between">
    <a
      class="button h-10 w-36 justify-center rounded-lg bg-navy-800 px-5 font-medium text-navy-100 hover:text-white md:w-48"
      href="/"
    >
      <svg class="icon mr-2 h-2 w-2 flex-shrink-0" viewBox="0 0 6.177 9.525" fill="none">
        <path
          d="M1985.484,56.559l4.055,4.055,4.055-4.055"
          transform="translate(62.029 -1984.777) rotate(90)"
          stroke="currentColor"
          stroke-width="2"
        ></path>
      </svg>
      <span class="text-2xs">{$_('profile.mainPage')}</span>
    </a>
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
        class="button h-10 w-36 items-center rounded-md bg-navy-800 px-5 text-2xs font-medium text-navy-100 hover:text-white md:w-48"
      >
        <svg class="icon mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 6H20V18H18zM10 18L10 13 16 13 16 11 10 11 10 6 4 12z"></path>
        </svg>
        <span class="text-2xs">{$_('profile.logout')}</span>
      </button>
    </form>
  </div>
  <div class="flex flex-col items-center justify-between">
    <div class="order-1 mx-6 mb-2 mt-4 flex flex-col items-center lg:order-2 lg:w-1/3">
      <div class="mb-2 h-36 w-36 overflow-hidden rounded-3xl border-2 border-solid border-gold">
        <img
          src="{$page.data.user.pfpUrl}"
          class="h-full w-full object-contain"
          referrerpolicy="no-referrer"
          alt="pfp"
        />
      </div>
      <div class="flex items-center">
        <span
          class="inline-block max-w-xs overflow-hidden truncate text-center text-xl font-semibold leading-none"
        >
          {$page.data.user?.username}
        </span>
      </div>
      <!-- <a
        /// TODO add this
        class="mt-1 font-medium underline transition-colors duration-200 text-2xs text-navy-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold hover:text-white css-1ug5voh"
        href="/pl/user/profile/76561199066122856"
      >
        PROFIL KEY-DROP
      </a> -->
    </div>
    <div class="order-2 w-full lg:order-3 lg:w-1/3">
      <div>
        <p
          class="mb-1 flex items-center justify-center text-xs font-semibold uppercase text-navy-100"
        >
          {$_('profile.balance')}
        </p>
        <div class="mb-4 flex flex-col md:flex-row">
          <div
            class="mx-auto flex h-11 w-1/2 min-w-fit items-center justify-center rounded-lg border border-solid border-navy-500 bg-navy-700 px-4 text-xs"
          >
            <div class="flex items-center text-xs font-semibold text-white">
              <span class="text-gold">
                {convertPrice($page.data.currency, $page.data.user.balance)}
              </span>
            </div>
            <div class="ml-4 flex items-center text-xs font-semibold text-gold">
              <img src="/icons/gold-coin.webp" alt="" class="mr-1 h-4 w-4 object-contain" />
              <span>{$page.data.user?.goldBalance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
