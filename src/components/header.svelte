<script lang="ts">
  import HeaderUserPanel from './header components/HeaderUserPanel.svelte';
  import HeaderMobileUserPanel from './header components/HeaderMobileUserPanel.svelte';
  import HeaderNav from './header components/HeaderNav.svelte';

  function toggleMobileDropdown() {
    [...document.querySelectorAll('.nav')].forEach((e) => e.classList.toggle('is-open'));
  }
</script>

<header class="sticky top-0 z-40 md:relative bg-navy-600">
  <div class="container relative flex w-auto h-20 mx-auto md:h-24">
    <div class="relative flex items-center h-full navbar-left">
      <a href="/" class="w-32 mb-1 md:w-40">
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
      <div class="relative sm:mr-2 ml-5 sm:ml-10">
        <button
          class="flex items-center justify-center font-light transition-colors duration-200 text-2xs text-navy-100 hover:text-white"
        >
          <img
            src="/icons/pl.svg"
            class="flex-shrink-0 w-4 h-4 mr-3 sm:mr-2 md:w-5 md:h-5"
            alt="pl"
          />
          <span class="font-light whitespace-nowrap md:text-3xs">
            Polish (Polski) <span class="font-bold">| PLN</span>
          </span>
        </button>
      </div>
      <div class="xl:flex justify-center items-center h-10 ml-2 sm:ml-10 hidden">
        <input
          id="search"
          placeholder="Wyszukaj"
          class="h-full pl-4 pr-12 text-xs font-medium text-white transition-colors duration-200 rounded-md outline-none w-36 md:w-56 bg-navy-700 focus:bg-navy-800 search-input placeholder-navy-300 md:text-xs md:pl-3 md:pr-0"
        />
        <svg viewBox="0 0 21.28 21.28" class="relative w-4 h-4 -ml-8 stroke-navy-200 fill-navy-200">
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
    <div class="flex items-center justify-center w-auto md:hidden ml-auto nav">
      <button class="flex items-center ml-4 md:hidden nav" on:click="{toggleMobileDropdown}">
        <div class="nav-hamburger text-navy-100" aria-label="Menu icon"></div>
      </button>
    </div>
  </div>
  <HeaderMobileUserPanel />
  <HeaderNav />
</header>
