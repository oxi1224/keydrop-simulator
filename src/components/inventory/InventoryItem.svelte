<script lang="ts">
  import { page } from '$app/stores';
  import { createToast, convertPrice, sellItems, type ItemWithGlobal } from '$lib';
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
  class="group relative z-0 rounded-lg bg-navy-700 transition-transform hover:-translate-y-6"
  style="padding-top: 135%; box-shadow: rgb(8, 10, 13) 0px 0px 35px 0px;"
>
  <div
    class="absolute left-0 top-0 hidden h-full w-full rounded-lg border-t border-solid bg-navy-900 transition-transform duration-200 will-change-transform group-hover:rounded-b-none border-{itemData
      .globalInvItem.skinRarity} css-cwrogv"
    style="display: flex;"
  >
    <div class="absolute left-0 top-0 h-full w-full transition-opacity duration-200"></div>
    <div
      class="absolute left-0 top-0 z-10 mt-10 flex w-full p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:p-4"
    >
      <div>
        <div class="css-rgj8xp text-2xs font-bold uppercase leading-none">
          {$_('profile.item.origin')}
        </div>
        <a href="/" class="mt-1 block text-xs font-bold uppercase leading-none text-white">
          {itemData.origin}
        </a>
      </div>
      <div class="ml-auto whitespace-nowrap text-right text-2xs font-bold uppercase leading-snug">
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
    <div class="absolute left-0 top-0 z-10 flex w-full items-center p-2 sm:p-4">
      {#if itemData.sold}
        <div class="flex items-center text-2xs font-bold uppercase leading-none text-red">
          <svg class="-mt-px mr-2 h-4 w-4">
            <use xlink:href="/icons/icons.svg#sell"></use>
          </svg>
          {$_('profile.item.sold')}
        </div>
      {:else}
        <div class="flex items-center text-2xs font-bold uppercase leading-none text-gold">
          <svg class="-mt-px mr-2 h-4 w-4" style="transform: scale(0.95);">
            <use xlink:href="/icons/icons.svg#rating-star"></use>
          </svg>
          New
        </div>
      {/if}
      <div
        class="ml-auto flex items-center rounded-md bg-navy-700 p-2 text-sm font-bold leading-none text-gold"
      >
        {convertPrice($page.data.currency, itemData.globalInvItem.skinPrice)}
      </div>
    </div>
    <div
      class="absolute flex h-full w-full flex-col items-center justify-end rounded-t-lg bg-navy-600 pb-4 transition-opacity duration-200"
    >
      <img
        src="/images/inventory-item.webp"
        alt=""
        class="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
      />
      <img
        src="{itemData.globalInvItem.skinImgSource}"
        alt=""
        class="relative mt-8 w-4/5 flex-1 object-contain"
      />
      <div class="flex flex-col items-center transition-opacity duration-200 group-hover:opacity-0">
        <div
          class="line-clamp relative overflow-hidden px-2 text-center text-sm font-light leading-none text-navy-100 sm:mb-2"
        >
          {itemData.globalInvItem.weaponName}
        </div>
        <div
          class="line-clamp relative overflow-hidden px-2 text-center text-sm font-semibold leading-none text-white sm:mb-2"
          title="Mainframe "
        >
          {itemData.globalInvItem.skinName}
        </div>
        <div
          class="line-clamp relative overflow-hidden px-2 text-center text-2xs font-light leading-none text-navy-100 sm:mb-2"
        >
          ({itemData.globalInvItem.skinQuality})
        </div>
      </div>
    </div>
    <ul
      class="absolute bottom-0 left-0 z-10 w-full divide-y divide-navy-800 whitespace-nowrap bg-navy-700 text-xs font-bold leading-none text-navy-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <li class="border-solid">
        <button
          class="single-sell-btn flex w-full items-center justify-center px-2 py-4 text-[11px] font-semibold uppercase transition-colors duration-150 hover:text-white"
          on:click="{(e) => handleSingleSell(e, itemData)}"
        >
          <svg class="mr-2 h-4 w-4">
            <use xlink:href="/icons/icons.svg?38#sell"></use>
          </svg>
          <span>
            {$_('profile.item.sell')}
            <span class="text-gold">
              {convertPrice($page.data.currency, itemData.globalInvItem.skinPrice)}
            </span>
          </span>
        </button>
      </li>
    </ul>
    <div
      class="absolute bottom-0 flex h-[50px] w-full -translate-y-[1px] overflow-hidden rounded-b-lg transition-transform duration-200 will-change-transform"
    >
      <button
        class="hover-none:flex border-gold-800 hidden items-center border-b-0 border-l border-r-0 border-t-0 border-solid px-3 transition-colors duration-150"
      >
        <svg class="h-6 w-6 text-navy-600">
          <use xlink:href="/icons/icons.svg?38#dots-vertical"></use>
        </svg>
      </button>
    </div>
  </div>
</li>
