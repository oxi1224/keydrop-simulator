<script lang="ts">
  import HeaderUserPanel from './components/HeaderUserPanel.svelte';
  import { _ } from 'svelte-i18n';
  import { page } from '$app/stores';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition
  } from '@rgossiaux/svelte-headlessui';
  import { createToast, type CaseSection } from '$lib';
  import SetBalance from '$components/forms/SetBalance.svelte';
  import type { Case } from '@prisma/client';
  import { fade } from 'svelte/transition';

  const languages = [
    { id: 0, shorthand: 'en', language: 'English (English)' },
    { id: 1, shorthand: 'pl', language: 'Polish (Polski)' }
  ];

  let loading = false;
  let selectedLang = languages.find((obj) => obj.shorthand === ($page.data?.lang ?? 'en'));
  let searchValue = '';
  let searchResults: Case[] = [];

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

  /* eslint-disable indent */
  $: searchResults = !searchValue
    ? []
    : $page.data?.sections
        ?.map((s: CaseSection) => s.cases)
        .flat()
        .filter((c: Case) => c.websiteName.toLowerCase().includes(searchValue)) || [];
  /* eslint-disable indent */
</script>

<header class="bg-navy-800">
  <button
    class="announcementBar is-open hidden w-full cursor-pointer bg-navy-800 py-2 text-center text-navy-200 is-open:md:block"
    on:click="{(e) => e.currentTarget.classList.remove('is-open')}"
  >
    <h1>
      <span class="text-red-400">
        <span class="font-bold">Case battle usuwają się 20min po ich stworzeniu!</span>
        <br />
        <span class="text-sm font-bold text-navy-300">Boty nie mają zwiększonego dropu (XD)</span>
        <br />
        <span class="text-sm font-bold text-navy-300">
          DISCORD: <a
            href="https://discord.gg/whv3c3kWNh"
            class="underline hover:text-navy-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://discord.gg/whv3c3kWNh
          </a>
        </span>
        <br />
        <span class="text-sm font-bold text-navy-300">
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

  <div class="flex h-[4.125rem] items-center bg-navy-700 md:mb-3 md:h-[5.625rem]">
    <a href="/" class="w-26 xs:w-32 mb-1 ml-3 flex-shrink-0 sm:w-40 md:ml-5">
      <img src="/images/kd-logo.svg" alt="KeyDrop" class="block" />
    </a>
    {#if $page.url.pathname === '/'}
      <div
        class="order-2 ml-auto mr-0 hidden md:order-1 md:ml-5 md:block xl:relative xl:ml-9 xl:w-64 xl:min-w-[150px]"
      >
        <label class="hidden xl:flex">
          <input
            type="text"
            class="input -mr-11 h-12 w-full rounded-lg border-navy-550 bg-navy-550 pl-5 pr-11 text-xs font-semibold uppercase text-navy-200 placeholder-navy-200 placeholder:font-normal focus:border-gold-400"
            placeholder="{$_('header.searchboxText')}"
            bind:value="{searchValue}"
          />
          <div class="my-auto flex h-9 w-9 items-center justify-center p-2">
            <svg class="block h-5 w-5 text-navy-200">
              <use xlink:href="/icons/icons.svg#search"></use>
            </svg>
          </div>
        </label>

        {#if searchResults?.length > 0}
          <div
            class="custom-scrollbar fixed left-0 top-0 z-50 w-full origin-top overflow-y-auto rounded-b-lg bg-navy-550 xl:absolute xl:top-[4.625rem] xl:max-h-[350px] xl:bg-navy-700"
            transition:fade="{{ duration: 250 }}"
          >
            <div class="bg-navy-700 px-3 py-4 xl:hidden">
              <button class="button mb-8 ml-auto aspect-square h-9 w-9 rounded bg-navy-400 p-1">
                <svg class="icon block h-6 w-6 text-white" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                  ></path>
                </svg>
              </button>
              <input
                type="text"
                class="input -mr-11 h-12 w-full rounded-lg border-navy-550 bg-navy-550 pl-5 pr-11 text-xs font-semibold uppercase placeholder-navy-200 focus:border-gold-400"
                placeholder="Search"
                value="rollo"
              />
            </div>
            <p class="p-4 text-[10px] text-navy-200 lg:border-b lg:border-navy-400">
              Znaleziono ({searchResults.length})
            </p>
            <ul>
              {#each searchResults as caseData}
                <li>
                  <a
                    href="/skins/category/{caseData.urlName}"
                    class="flex px-1 py-2.5 transition-colors duration-200 hover:bg-navy-500"
                  >
                    <img
                      src="{caseData.imgName}"
                      class="mr-2 h-14 w-20 flex-shrink-0 object-contain"
                      alt="Case"
                    />
                    <div class="flex w-full flex-col justify-center">
                      <p class="flex h-7 items-center text-xs text-white">{caseData.websiteName}</p>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {/if}

    <Listbox
      let:open
      value="{selectedLang}"
      on:change="{(e) => (selectedLang = languages[e.detail])}"
      class="relative order-1 ml-3 rounded-md bg-navy-700 text-center text-3xs text-navy-100 md:text-xs"
    >
      <ListboxButton class="dropdown bg-navy-600 px-4 py-2">
        <div class="flex flex-row">
          <img
            src="/icons/{$page.data?.lang ?? 'en'}.svg"
            class="h-4 w-4 flex-shrink-0 md:h-5 md:w-5 lg:mr-2"
            alt="{$page.data?.lang ?? 'en'}"
          />
          <span class="hidden whitespace-nowrap lg:inline">{selectedLang?.language}</span>
        </div>
        <div class="dropdown-arrow ml-2 hidden lg:block">
          <svg
            class="icon block h-2.5 w-2.5 flex-shrink-0 transition-transform duration-200"
            viewBox="0 0 10 6"
            fill="none"
            style="transform: rotateX({open ? '180' : '0'}deg);"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor"></path>
          </svg>
        </div>
      </ListboxButton>
      <Transition
        show="{open}"
        enter="transition-all duration-200"
        enterFrom="scale-90 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition-all duration-200"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-90 opacity-0"
      >
        <ListboxOptions class="absolute z-50 w-fit origin-top lg:w-full">
          <div
            class="max-h-64 overflow-y-auto overflow-x-hidden rounded-lg border border-navy-200 border-opacity-30 bg-navy-700 bg-opacity-90 text-navy-200 shadow-lg outline-none md:max-h-80"
          >
            {#each languages as lang}
              <ListboxOption
                value="{lang.id}"
                on:click="{() => changeLanguage(lang.shorthand)}"
                disabled="{loading}"
                class="flex w-full cursor-pointer items-center justify-center whitespace-nowrap px-3 py-2 text-xs font-light outline-none transition-colors duration-200 hover:bg-navy-400 lg:text-sm"
              >
                {lang?.language}
              </ListboxOption>
            {/each}
          </div>
        </ListboxOptions>
      </Transition>
    </Listbox>

    {#if $page.data.user}
      <HeaderUserPanel />
    {:else}
      <div class="order-5 ml-auto flex self-stretch rounded-l-2xl md:bg-navy-800/80">
        <div
          class="flex items-center self-stretch rounded-l-2xl pl-4 pr-3 md:gap-3 md:bg-navy-550 md:pl-3 lg:gap-4 lg:px-5"
        >
          <a class="button h-13 flex bg-gold-400 text-[#23232d] hover:bg-gold-600" href="/login">
            LOGIN
          </a>
        </div>
      </div>
    {/if}
  </div>
  <div class="hidden bg-navy-800 py-3 md:block">
    <div class="container mx-auto">
      <nav aria-label="Primary" class="flex h-16 rounded-xl bg-navy-700/60">
        <!-- <div class="relative" data-headlessui-state="">
          <div
            class="from-gold-300/20 flex h-full items-center justify-start rounded-l-xl bg-gradient-to-r to-transparent p-1"
          >
            <button
              class="button group relative h-full overflow-hidden p-0 outline-none ring-0 focus:outline-none focus:ring-0"
              id="headlessui-disclosure-button-1"
              type="button"
              aria-expanded="false"
              data-headlessui-state=""
            >
              <div
                class="circle h-19 w-19 css-1dyftzc absolute -left-2 hidden items-center justify-center rounded-full bg-gold-400/10 lg:flex"
              ></div>
              <svg
                class="duration-250 text-gold-300 ml-5 mr-4 hidden h-5 w-5 transition ease-out lg:block"
              >
                <use
                  xlink:href="/icons/icons.svg#hand-with-cash"
                ></use>
              </svg>
              <span
                class="duration-250 text-gold-300 ml-4 mr-2 text-2xs uppercase transition ease-out lg:ml-0 lg:text-[11px]"
              >
                Darmowe
              </span>
              <div
                class="duration-250 h-auto w-auto rounded-md bg-gold-900 p-2 transition ease-out group-hover:bg-gold-850"
              >
                <svg
                  class="duration-250 css-30myhr hidden h-2.5 w-2.5 text-gold-400 transition ease-out md:block"
                >
                  <use
                    xlink:href="/icons/icons.svg#arrow-down"
                  ></use>
                </svg>
              </div>
            </button>
          </div>
        </div> -->
        <!-- <button
          class="group mx-2 ml-auto hidden cursor-pointer items-center whitespace-nowrap px-2 py-5 text-2xs font-semibold uppercase text-white transition-colors duration-200 md:flex lg:mr-3 lg:px-3"
        >
          <svg class="mr-2 h-5 w-5 text-gold-400 transition duration-300">
            <use xlink:href="/icons/icons.svg#present-filled"></use>
          </svg>
          <div class="mr-2 flex flex-col items-start">
            <span class="text-2xs lg:text-[11px]">Giveaways</span>
            <span class="hidden leading-none text-gold-400 transition duration-300 lg:block">
              <span>Keydrop</span>
            </span>
          </div>
          <div class="h-auto w-auto rounded-md bg-navy-400 p-2 transition group-hover:bg-navy-300">
            <svg class="css-4t5p8d hidden h-2.5 w-2.5 text-white transition duration-300 md:block">
              <use xlink:href="/icons/icons.svg#arrow-down"></use>
            </svg>
          </div>
        </button> -->
        <!-- <div
          class="ml-auto flex items-center rounded-xl bg-gradient-to-r from-[#372C1F] to-transparent px-2 lg:px-3"
        >
          <a
            href="/vikings-event"
            class="hidden items-center whitespace-nowrap px-2 py-5 text-2xs font-semibold uppercase text-gold-400 transition-colors duration-200 hover:text-white md:flex lg:px-3 lg:pl-3 lg:pr-6 lg:text-[11px]"
          >
            <svg class="mr-1.5 h-5 w-5 lg:mr-2">
              <use xlink:href="/icons/icons.svg#vikings-event"></use>
            </svg>
            Wikingowie
          </a>
        </div> -->
        <div class="ml-auto flex items-center rounded-xl bg-[#23232D] px-2 lg:px-3">
          <a
            href="/case-battle"
            class="ml-auto hidden items-center whitespace-nowrap px-2 py-5 text-2xs font-semibold uppercase text-lightgreen-200 transition-colors duration-200 hover:text-white md:flex lg:px-3 lg:text-[11px]"
          >
            <svg class="mr-1.5 h-5 w-5 lg:mr-2">
              <use xlink:href="/icons/icons.svg#case-battle-swords"></use>
            </svg>
            Case Battle
          </a>
          <!-- <a
            href="/panel/profil/contracts"
            class="hidden items-center whitespace-nowrap px-2 py-5 text-2xs font-semibold uppercase text-teal-200 transition-colors duration-200 hover:text-white md:flex lg:px-3 lg:text-[11px]"
          >
            <svg class="mr-1.5 h-5 w-5 lg:mr-2">
              <use
                xlink:href="/icons/icons.svg#contracts-note"
              ></use>
            </svg>
            Contracts
          </a> -->
          <a
            href="/skins/upgrader"
            class="hidden items-center whitespace-nowrap px-2 py-5 text-2xs font-semibold uppercase text-[#6680FF] transition-colors duration-200 hover:text-white md:flex lg:px-3 lg:text-[11px]"
          >
            <svg class="mr-1.5 h-5 w-5 lg:mr-2">
              <use xlink:href="/icons/icons.svg#upgrader-new"></use>
            </svg>
            Upgrader
          </a>
          <!-- <a
            href="/skin-changer"
            class="hidden items-center whitespace-nowrap px-2 py-5 text-2xs font-semibold uppercase text-[#CE82E3] transition-colors duration-200 hover:text-white md:flex lg:px-3 lg:text-[11px]"
          >
            <svg class="mr-1.5 h-5 w-5 lg:mr-2">
              <use
                xlink:href="/icons/icons.svg#new-skin-changer"
              ></use>
            </svg>
            Skin Changer
          </a> -->
        </div>
      </nav>
    </div>
  </div>
  <!-- <div class="hidden overflow-hidden bg-navy-700 md:block">
    <nav class="container mx-auto h-full">
      <ul class="flex h-full flex-wrap justify-end text-3xs lg:text-2xs xl:-mx-4 xl:flex-nowrap">
        <li>
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
        </li>
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
        <li>
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
      </ul>
    </nav>
  </div> -->
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
