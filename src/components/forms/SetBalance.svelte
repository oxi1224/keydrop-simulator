<script lang="ts">
  import Spinner from '$components/util/Spinner.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { applyAction, enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { invalidateAll } from '$app/navigation';
  import { createToast } from '$lib';
  import { _ } from 'svelte-i18n';

  let loading = false;

  const setBalance: SubmitFunction = () => {
    return async ({ result }) => {
      if (result) loading = false;
      invalidateAll();
      await applyAction(result);
    };
  };

  $: $page.form && !$page.form?.success
    ? /* eslint-disable indent */
      createToast({
        header: $_('error'),
        message: $_($page.form?.messageKey),
        type: 'error'
      })
    : null;
  /* eslint-disable indent */

  function handleSubmit() {
    loading = true;
  }
</script>

<form
  class="space-y-0"
  action="/panel/profil?/setBalance"
  method="POST"
  use:enhance="{setBalance}"
  on:submit|preventDefault="{handleSubmit}"
>
  <div class="-space-y-px rounded-md shadow-sm">
    <div>
      <label for="balanceAmount" class="sr-only">
        {$_('balanceForm.balancePlaceholder')}
      </label>
      <input
        id="balanceAmount"
        name="balanceAmount"
        required="{true}"
        type="number"
        min="0"
        max="999999999"
        step="0.01"
        class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder="{$_('balanceForm.balancePlaceholder')}"
      />
    </div>
  </div>
  <div class="border border-gray-300 bg-white px-3 py-2 text-navy-300 sm:text-sm">
    <p>{$_('balanceForm.selectBalanceType')}</p>
    <input type="radio" id="balanceType-money" name="balanceType" value="money" checked />
    <label for="balanceType-money">{$_('money')}</label>
    <br />
    <input type="radio" id="balanceType-gold" name="balanceType" value="gold" />
    <label for="balanceType-gold">{$_('gold')}</label>
    <br />
  </div>
  <div class="relative overflow-hidden">
    <div
      class="z-50 min-h-full min-w-full rounded-md bg-navy-500 bg-opacity-95 {loading
        ? 'flex'
        : 'hidden'} pointer-events-none absolute items-center justify-center"
    >
      <Spinner size="2em" borderWidth=".3em" />
    </div>
    <button
      type="submit"
      disabled="{loading}"
      class="group relative flex w-full justify-center rounded-b-md border border-transparent bg-navy-500 px-4 py-2 text-sm font-medium text-white hover:bg-navy-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {$_('balanceForm.setBalance')}
    </button>
  </div>
</form>
