<script lang="ts">
  import HeaderUserPanel from './components/HeaderUserPanel.svelte';
  import HeaderMobileUserPanel from './components/HeaderMobileUserPanel.svelte';
  import { _ } from 'svelte-i18n';
  import { page } from '$app/stores';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  } from '@rgossiaux/svelte-headlessui';
  import { createToast } from '$lib';
  import SetBalance from '$components/forms/SetBalance.svelte';

  const languages = [
    { id: 0, shorthand: 'en', language: 'English (English)' },
    { id: 1, shorthand: 'pl', language: 'Polish (Polski)' }
  ];

  let loading = false;
  let selectedLang = languages.find((obj) => obj.shorthand === ($page.data?.lang ?? 'en'));

  function toggleMobileDropdown() {
    [...document.querySelectorAll('.nav')].forEach((e) => e.classList.toggle('is-open'));
    document.querySelector('.announcementBar')!.classList.remove('is-open');
  }

  async function changeLanguage(lang: (typeof languages)[number]['shorthand']) {
    loading = true;
    const res = await fetch('/api/change-lang', {
      method: 'POST',
      body: JSON.stringify({ lang }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    loading = false;
    createToast({
      header: res.ok ? $_('success') : $_('error'),
      message: data.message ?? $_(data.messageKey),
      type: res.ok ? 'success' : 'error'
    });
    if (res.ok) window.location.reload();
  }

  function togglePayment() {
    document.querySelector('.setBalanceForm')!.classList.toggle('is-open');
  }
</script>

<header class="sticky top-0 z-40 select-none bg-navy-600 md:relative">
  <button
    class="announcementBar is-open hidden w-full cursor-pointer bg-navy-800 py-2 text-center text-navy-200 is-open:md:block"
    on:click="{(e) => e.currentTarget.classList.remove('is-open')}"
  >
    <h1>
      <span class="text-red-400">
        <span class="font-bold">
          Case battle usuwają się 20min po ich stworzeniu
          <br />
          Możliwość zmiany profilowego na
          <a href="/panel/profil">/panel/profil</a>
          <br />
          (Porzebny link bezpośrednio do zdjęcia, np. https://i.imgur.com/1b6XRcm.jpeg)
        </span>
        <br />
        <span class="font-bold text-navy-300">
          NOWY SERWER DISCORD: <a
            href="https://discord.gg/whv3c3kWNh"
            class="underline hover:text-navy-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://discord.gg/whv3c3kWNh
          </a>
        </span>
        <br />
        <span class="text-sm text-navy-300">
          Link do donate:
          <a
            href="https://tipply.pl/u/oxi_"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:text-navy-200"
          >
            tipply
          </a>
          |
          <a
            class="underline hover:text-navy-200"
            href="https://ko-fi.com/oxi1224"
            target="_blank"
            rel="noopener noreferrer"
          >
            ko-fi
          </a>
        </span>
      </span>
    </h1>
  </button>
  <div class="container relative mx-auto flex h-20 w-auto md:h-24">
    <div class="navbar-left relative flex h-full items-center">
      <a href="/" class="mb-1 w-24 md:w-40" aria-label="Go to front page">
        <svg
          version="1.1"
          id="Warstwa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 270.9 67.5"
          style="enable-background:new 0 0 270.9 67.5;"
          xml:space="preserve"
        >
          <style>
            .st0 {
              fill: #ffffff;
            }
            .st1 {
              fill: #005bbb;
            }
            .st2 {
              fill: #ffd500;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M73.5,17.4v21.9l9.8-10.8H90v0.3L78.6,40.9l13,13.6v0.4h-6.8L73.5,42.7v12.2h-5.6V17.4H73.5z"
            ></path>
            <path
              class="st0"
              d="M98,43.7c0.5,4,3.8,6.6,8.6,6.6c2.7,0,6.1-1,7.7-2.8l3.6,3.5c-2.7,3-7.3,4.5-11.4,4.5c-8.7,0-14.3-5.5-14.3-14
              c0-8,5.6-13.8,13.9-13.8c8.5,0,14.3,5.2,13.3,16C119.4,43.7,98,43.7,98,43.7z M114.1,39.1c-0.3-4.2-3.4-6.4-7.8-6.4
              c-4,0-7.3,2.2-8.2,6.4H114.1z"
            ></path>
            <path
              class="st0"
              d="M149.5,28.5l-16.7,38.7h-6.1l5.5-12.6l-10.6-26h6.4l4.6,12.5l2.6,7.5l2.8-7.4l5.3-12.6h6.2V28.5z"
            ></path>
            <path
              class="st0"
              d="M179.7,17.4v37.5h-5.2l-0.3-4.2c-2.1,3.4-5.6,4.7-9.2,4.7c-7.7,0-13.5-5-13.5-13.8c0-9,5.7-13.8,13.4-13.8
              c3.2,0,7.6,1.6,9.3,4.7V17.4H179.7z M157,41.7c0,5.3,3.7,8.6,8.4,8.6c4.6,0,8.4-3.4,8.4-8.6c0-5.1-3.8-8.6-8.4-8.6
              C160.7,33.1,157,36.2,157,41.7z"
            ></path>
            <path
              class="st0"
              d="M192.3,28.5l0.4,3.5c1.9-3.4,4.9-4.1,7.8-4.1c2.6,0,5,0.9,6.5,2.3l-2.5,4.8c-1.3-1.1-2.6-1.6-4.7-1.6
              c-3.8,0-7.1,2.4-7.1,7.2v14.3h-5.5V28.5H192.3z"
            ></path>
            <path
              class="st0"
              d="M235.7,41.7c0,7.8-5.4,13.7-13.7,13.7c-8.3,0-13.6-5.9-13.6-13.7s5.4-13.8,13.6-13.8
              C230.1,27.9,235.7,33.9,235.7,41.7z M213.9,41.7c0,4.7,3.1,8.6,8.1,8.6c5.1,0,8.1-3.9,8.1-8.6S226.8,33,222,33
              C216.9,33,213.9,37,213.9,41.7z"
            ></path>
            <path
              class="st0"
              d="M241.5,67.2V28.5h5.2l0.3,4.3c2-3.2,5.8-4.8,9.3-4.8c7.9,0.1,13.3,5.8,13.3,13.8s-5.1,13.8-13.3,13.8
              c-3.2,0-7.3-1.2-9.3-4.4v16.1h-5.5V67.2z M264.2,41.7c0-5-3.3-8.4-8.4-8.4s-8.3,3.7-8.3,8.4c0,4.7,3.5,8.4,8.3,8.4
              C260.7,50.1,264.2,46.6,264.2,41.7z"
            ></path>
          </g>
          <rect x="151.5" y="61.9" class="st0" width="13.6" height="5.3"></rect>
          <rect x="25.4" y="24.4" class="st1" width="6.7" height="9.1"></rect>
          <rect x="25.4" y="38.4" class="st2" width="6.7" height="24.5"></rect>
          <path
            class="st1"
            d="M20.6,33.5H5c-2.5,0-4.6-2-4.6-4.6l0,0c0-2.5,2-4.6,4.6-4.6h15.6V33.5z"
          ></path>
          <path
            class="st2"
            d="M20.6,62.9L20.6,62.9c-8.4,0-15.2-6.8-15.2-15.2v-9.3h15.2V62.9z"
          ></path>
          <path
            class="st1"
            d="M36.9,33.5h15.6c2.5,0,4.6-2,4.6-4.6l0,0c0-2.5-2-4.6-4.6-4.6H36.9V33.5z"
          ></path>
          <path
            class="st2"
            d="M36.9,62.9L36.9,62.9c8.4,0,15.2-6.8,15.2-15.2v-9.3H36.9V62.9z"
          ></path>
          <g>
            <g>
              <path
                class="st1"
                d="M24.8,20L9.6,15.7c-1.1-0.3-1.3-1.9-0.4-2.5l10.4-7.3c0.7-0.5,1.6-0.2,1.9,0.6L26.4,18
                C26.8,19.1,25.9,20.3,24.8,20z"
              ></path>
              <path
                class="st1"
                d="M30.6,18.3l8.9-17.6c0.5-1,1.8-1,2.3-0.1l8.9,14.9c0.5,0.9,0,2-0.9,2.1L32,20.4
                C30.9,20.5,30.1,19.3,30.6,18.3z"
              ></path>
            </g>
          </g>
        </svg>
      </a>
      <div class="relative ml-3 flex items-center justify-start sm:ml-10 sm:mr-2">
        <img
          src="/icons/{$page.data?.lang ?? 'en'}.svg"
          class="mr-2 h-4 w-4 flex-shrink-0 md:h-5 md:w-5"
          alt="{$page.data?.lang ?? 'en'}"
        />
        <Listbox
          value="{selectedLang}"
          on:change="{(e) => (selectedLang = languages[e.detail])}"
          class="relative w-24 rounded-md bg-navy-700 text-center text-3xs text-navy-100 md:w-36 md:text-xs"
        >
          <ListboxButton class="cursor-pointer px-4 py-2">{selectedLang?.language}</ListboxButton>
          <ListboxOptions
            class="absolute top-8 w-24 whitespace-nowrap bg-navy-650 outline outline-1 outline-navy-300 md:w-36"
          >
            {#each languages as lang}
              <ListboxOption
                value="{lang.id}"
                on:click="{() => changeLanguage(lang.shorthand)}"
                disabled="{loading}"
                class="cursor-pointer px-4 py-2"
              >
                {lang?.language}
              </ListboxOption>
            {/each}
          </ListboxOptions>
        </Listbox>
      </div>
      <div class="ml-2 hidden h-10 items-center justify-center sm:ml-10 xl:flex">
        <input
          id="search"
          placeholder="{$_('header.searchboxText')}"
          class="search-input h-full w-36 rounded-md bg-navy-700 pl-4 pr-12 text-xs font-medium text-white placeholder-navy-300 outline-none transition-colors duration-200 focus:bg-navy-800 md:w-56 md:pl-3 md:pr-0 md:text-xs"
        />
        <svg viewBox="0 0 21.28 21.28" class="relative -ml-8 h-4 w-4 fill-navy-200 stroke-navy-200">
          <g
            fill="none"
            stroke-linejoin="round"
            stroke-width="1.5"
            transform="translate(-565.25 -229.25)"
          >
            <circle cx="8.75" cy="8.75" r="8.75" transform="translate(566 230)"></circle>
            <circle
              cx="8.75"
              cy="8.75"
              r="8.75"
              transform="translate(566 230)"
              opacity="0"
              class="js-icon-find-circle fill-current"
            ></circle>
            <path d="M586 250l-5-5"></path>
          </g>
        </svg>
      </div>
    </div>
    <HeaderUserPanel />
    <div class="nav ml-auto flex w-auto items-center justify-center md:hidden">
      <button
        class="nav ml-4 flex items-center md:hidden"
        aria-label="Menu Toggle"
        on:click="{toggleMobileDropdown}"
      >
        <div class="nav-hamburger text-navy-100"></div>
      </button>
    </div>
  </div>
  <HeaderMobileUserPanel />
  <div class="hidden overflow-hidden bg-navy-700 md:block">
    <nav class="container mx-auto h-full">
      <ul class="flex h-full flex-wrap justify-end text-3xs lg:text-2xs xl:-mx-4 xl:flex-nowrap">
        <!-- <li>
          <a
            rel="alternate"
            hreflang="pl"
            href="https://key-drop.com/pl/ProvablyFair"
            class="flex items-center h-full px-2.5 font-semibold leading-none text-white uppercase transition-opacity duration-100 text-10px py-7 lg:px-3  whitespace-nowrap opacity-90 hover:opacity-100"
          >
            <svg class="w-5 h-5 mr-2">
              <use xlink:href="/icons/nav-icons.svg#shield"></use>
            </svg>
            <span class="inline-block mt-0.5">Provably Fair</span>
          </a>
        </li>
        <li>
          <button
            class="flex items-center h-full px-2.5 font-semibold leading-none text-white uppercase transition-opacity duration-100 text-10px py-7 lg:px-3  whitespace-nowrap opacity-90 hover:opacity-100 open-promo-code-modal"
          >
            <svg class="w-5 h-5 mr-2">
              <use xlink:href="/icons/nav-icons.svg#barcode"></use>
            </svg>
            <span class="inline-block mt-0.5">Kod promocyjny</span>
          </button>
        </li>
        <li>
          <a
            rel="alternate"
            hreflang="pl"
            href="https://key-drop.com/pl/panel/profil/free-gold"
            class="flex items-center h-full px-2.5 font-semibold leading-none uppercase transition-colors duration-200 text-10px text-gold py-7 lg:px-3  whitespace-nowrap hover:text-white"
          >
            <svg class="w-5 h-5 mr-2">
              <use xlink:href="/icons/nav-icons.svg#coin-stack"></use>
            </svg>
            <span class="inline-block mt-0.5">Darmowe złoto</span>
          </a>
        </li>
        <li class="mr-auto">
          <a
            rel="alternate"
            hreflang="pl"
            href="https://key-drop.com/pl/Daily_free"
            class="flex items-center h-full px-2.5 font-semibold leading-none text-white uppercase transition-opacity duration-100 text-10px py-7 lg:px-3  opacity-90 hover:opacity-100 whitespace-nowrap"
          >
            <svg class="w-5 h-5 mr-2">
              <use xlink:href="/icons/nav-icons.svg#box"></use>
            </svg>
            <span class="inline-block mt-0.5">Codzienna skrzynia</span>
          </a>
        </li>
        <li>
          <a
          rel="alternate"
          hreflang="pl"
          href="https://key-drop.com/pl/giveaways"
          class="relative flex items-center h-full px-2.5 font-semibold leading-none uppercase transition-colors duration-100 text-gold group text-10px py-7 lg:px-3  whitespace-nowrap hover:text-white"
          >
          <svg class="w-5 h-5 mr-2 fill-current">
              <use xlink:href="/icons/nav-icons.svg#gift"></use>
            </svg>
            <span class="inline-flex items-center mt-0.5 relative">
              <span class="font-bold">GIVEAWAYS</span>
            </span>
          </a>
        </li>
        <li>
          <a
            rel="alternate"
            hreflang="pl"
            href="https://key-drop.com/pl/panel/profil/contracts"
            class="flex items-center h-full px-2.5 font-semibold leading-none uppercase transition-colors duration-200 text-10px py-7 lg:px-3  hover:text-white text-teal-400 whitespace-nowrap"
            >
            <svg class="w-5 h-5 mr-2">
              <use xlink:href="/icons/nav-icons.svg#contracts"></use>
            </svg>
            <span class="inline-block mt-0.5">CONTRACTS</span>
          </a>
        </li> -->
        <li>
          <a
            rel="alternate"
            hreflang="pl"
            href="/case-battle/list"
            class="text-10px group relative flex h-full items-center whitespace-nowrap px-2.5 py-7 font-semibold uppercase leading-none text-pastelGreen transition-colors duration-100 hover:text-white lg:px-3"
          >
            <svg viewBox="0 0 44 43" class="mr-2 h-5 w-5 scale-95 transform fill-current">
              <path
                d="M10.5492 24.3569L18.5585 32.3706L15.3561 35.5752L18.563 38.7821L15.3584 41.9867L9.74922 36.3775L3.33777 42.789L0.133179 39.5844L6.54463 33.1706L0.93546 27.5637L4.14005 24.3591L7.34465 27.5615L10.547 24.3569H10.5492ZM1.3706 0.773438L9.40701 0.780237L36.1882 27.5637L39.3951 24.3591L42.5997 27.5637L36.9928 33.1729L43.402 39.5844L40.1974 42.789L33.7859 36.3775L28.1768 41.9867L24.9722 38.7821L28.1768 35.5752L1.37739 8.77585L1.3706 0.773438ZM34.1349 0.773438L42.1646 0.780237L42.1691 8.76452L32.9837 17.9477L24.9699 9.93622L34.1349 0.773438Z"
              ></path>
            </svg>
            <span class="font-bold">CASE BATTLE</span>
          </a>
        </li>
        <li>
          <a
            rel="alternate"
            hreflang="pl"
            href="/skins/upgrader"
            class="text-10px flex h-full items-center whitespace-nowrap px-2.5 py-7 font-semibold uppercase leading-none text-blue transition-colors duration-200 hover:text-white lg:px-3"
          >
            <svg class="mr-2 h-5 w-5">
              <use xlink:href="/icons/nav-icons.svg#donut-chart"></use>
            </svg>
            <span class="mt-0.5 inline-block">UPGRADER</span>
          </a>
        </li>
        <!-- <li>
          <a
            rel="alternate"
            hreflang="pl"
            href="https://key-drop.com/pl/skin-changer"
            class="flex items-center h-full px-2.5 font-semibold leading-none uppercase transition-colors duration-200 text-10px py-7 lg:px-3  hover:text-white text-violet whitespace-nowrap"
          >
            <svg class="w-5 h-5 mr-1.5">
              <use xlink:href="/icons/nav-icons.svg#lightning"></use>
            </svg>
            <span class="inline-block mt-0.5">Skin Changer</span>
          </a>
        </li>
      </ul> -->
      </ul>
    </nav>
  </div>
</header>

<div
  class="setBalanceForm fixed z-[100] hidden h-full w-full items-center justify-center rounded-lg bg-navy-750 bg-opacity-90 p-7 text-left text-xs is-open:flex md:text-xl"
  style="top: 50%; left: 50%; transform: translate(-50%, -50%); display inherit;"
>
  <button
    on:click="{togglePayment}"
    class="absolute right-3 top-3 rotate-45 text-3xl text-navy-100"
  >
    +
  </button>
  <SetBalance />
</div>
