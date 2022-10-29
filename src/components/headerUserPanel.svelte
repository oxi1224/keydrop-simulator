<script lang="ts">
  import type { UserData } from '$lib';

  function toggleDropdown() {
    document.getElementById('user-dropdown')!.classList.toggle('is-open');
  }
  export let data: UserData;
</script>

<div class="h-16 flex items-center">
  <div class="flex items-center bg-navy-700 rounded-md p-3">
    <div class="flex items-center">
      <div>
        <span class="flex flex-row text-navy-200 text-2xs items-center font-bold space-x-1.5">
          <img src="/icons/wallet.svg" alt="wallet" class="object-contain w-3 h-3 mr-1.5" />
          PORTFEL:
          <span class="text-gold font-semibold text-sm md:text-xs">{data.balance}zł</span>
        </span>
      </div>
    </div>
  </div>
  <div class="flex ml-9 h-16">
    <div class="flex flex-col justify-evenly">
      <span class="font-semibold text-sm text-navy-200 h-min">{data.username}</span>
      <div class="flex flex-row items-center">
        <img src="/icons/gold-coin.png" alt="coin" class="object-contain w-4 h-4 mr-1" />
        <span class="text-gold-600 font-semibold text-xs whitespace-nowrap">
          {data.goldBalance}
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
