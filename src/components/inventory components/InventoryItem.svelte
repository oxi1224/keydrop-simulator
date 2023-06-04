<script lang="ts">
  import { page } from '$app/stores';
  import Spinner from '$components/util/Spinner.svelte';
  import { createToast, lazyLoad, localisePrice, sellItems, type ItemWithGlobal } from '$lib';
  import { _ } from 'svelte-i18n';
  export let itemData: ItemWithGlobal;

  async function handleSingleSell(e: MouseEvent, item: ItemWithGlobal) {
    const clickedEl = (e.target as Element).closest('.single-sell-btn') as HTMLButtonElement;
    const sellData = await sellItems([item]);
    createToast({
      type: sellData.res.ok ? 'success' : 'error',
      header: sellData.res.ok ? 'sukces' : 'błąd',
      message: $_(sellData.messageKey)
    });
    clickedEl.disabled = true;
  }
</script>

<li
  class="relative z-0 rounded-lg group transition-transform hover:-translate-y-6 bg-navy-700"
  style="padding-top: 135%; box-shadow: rgb(8, 10, 13) 0px 0px 35px 0px;"
>
  <div
    class="absolute top-0 left-0 hidden w-full h-full transition-transform duration-200 border-t border-solid rounded-lg will-change-transform bg-navy-900 group-hover:rounded-b-none border-{itemData.globalInvItem.skinRarity} css-cwrogv"
    style="display: flex;"
  >
    <div class="absolute top-0 left-0 w-full h-full transition-opacity duration-200"></div>
    <div
      class="absolute top-0 left-0 z-10 flex w-full p-2 mt-10 transition-opacity duration-200 opacity-0 sm:p-4 group-hover:opacity-100"
    >
      <div>
        <div class="font-bold leading-none uppercase text-2xs css-rgj8xp">
          {$_('profile.item.origin')}
        </div>
        <a href="/" class="block mt-1 text-xs font-bold leading-none text-white uppercase">
          {itemData.origin}
        </a>
      </div>
      <div class="ml-auto font-bold leading-snug text-right uppercase whitespace-nowrap text-2xs">
        {new Date(itemData.dropDate).getHours()}:{new Date(
          itemData.dropDate
        ).getMinutes()}:{new Date(itemData.dropDate).getSeconds()}
        <br />
        <span class="sm:ml-2">
          {new Date(itemData.dropDate).getFullYear()}-{new Date(
            itemData.dropDate
          ).getMonth()}-{new Date(itemData.dropDate).getDate()}
        </span>
      </div>
    </div>
    <div class="absolute top-0 left-0 z-10 flex items-center w-full p-2 sm:p-4">
      {#if itemData.sold}
        <div class="flex items-center font-bold text-red leading-none uppercase text-2xs">
          <svg class="w-4 h-4 mr-2 -mt-px">
            <use xlink:href="/icons/icons.svg#sell"></use>
          </svg>
          {$_('profile.item.sold')}
        </div>
      {:else}
        <div class="flex items-center font-bold leading-none uppercase text-2xs text-gold">
          <svg class="w-4 h-4 mr-2 -mt-px" style="transform: scale(0.95);">
            <use xlink:href="/icons/icons.svg#rating-star"></use>
          </svg>
          New
        </div>
      {/if}
      <div
        class="flex items-center p-2 ml-auto text-sm font-bold leading-none rounded-md bg-navy-700 text-gold"
      >
        {localisePrice(page, itemData.globalInvItem.skinPrice)}
        {$page.data.currency.toUpperCase()}
      </div>
    </div>
    <div
      class="absolute flex flex-col items-center justify-end w-full h-full pb-4 transition-opacity duration-200 rounded-t-lg bg-navy-600"
    >
      <img
        src="/images/inventory-item.webp"
        alt=""
        class="absolute top-0 left-0 object-cover w-full h-full rounded-lg"
      />
      <img
        use:lazyLoad="{itemData.globalInvItem.skinImgSource}"
        alt=""
        class="relative flex-1 object-contain w-4/5 mt-8"
      />
      <div class="loader-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
      <div class="flex flex-col items-center transition-opacity duration-200 group-hover:opacity-0">
        <div
          class="relative px-2 overflow-hidden text-sm font-light leading-none text-center text-navy-100 sm:mb-2 line-clamp"
        >
          {itemData.globalInvItem.weaponName}
        </div>
        <div
          class="relative px-2 overflow-hidden text-sm font-semibold leading-none text-center text-white sm:mb-2 line-clamp"
          title="Mainframe "
        >
          {itemData.globalInvItem.skinName}
        </div>
        <div
          class="relative px-2 overflow-hidden font-light leading-none text-center text-navy-100 text-2xs sm:mb-2 line-clamp"
        >
          ({itemData.globalInvItem.skinQuality})
        </div>
      </div>
    </div>
    <ul
      class="absolute bottom-0 left-0 z-10 w-full text-xs font-bold leading-none whitespace-nowrap transition-opacity duration-200 bg-navy-700 text-navy-100 divide-y divide-navy-800 opacity-0 group-hover:opacity-100"
    >
      <li class="border-solid">
        <button
          class="single-sell-btn flex items-center justify-center w-full px-2 py-4 font-semibold uppercase transition-colors duration-150 text-[11px] hover:text-white"
          on:click="{(e) => handleSingleSell(e, itemData)}"
        >
          <svg class="w-4 h-4 mr-2">
            <use xlink:href="/icons/icons.svg?38#sell"></use>
          </svg>
          <span>
            {$_('profile.item.sell')}
            <span class="text-gold">
              {localisePrice(page, itemData.globalInvItem.skinPrice)}
              {$page.data.currency.toUpperCase()}
            </span>
          </span>
        </button>
      </li>
    </ul>
    <div
      class="absolute bottom-0 flex w-full overflow-hidden transition-transform duration-200 rounded-b-lg will-change-transform h-[50px] -translate-y-[1px]"
    >
      <button
        class="hidden hover-none:flex items-center px-3 transition-colors duration-150 border-t-0 border-b-0 border-l border-r-0 border-solid border-gold-800"
      >
        <svg class="w-6 h-6 text-navy-600">
          <use xlink:href="/icons/icons.svg?38#dots-vertical"></use>
        </svg>
      </button>
    </div>
  </div>
</li>
