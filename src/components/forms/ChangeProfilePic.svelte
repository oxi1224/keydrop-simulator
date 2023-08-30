<script lang="ts">
  import Spinner from '$components/util/Spinner.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { applyAction, enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { invalidateAll } from '$app/navigation';
  import { createToast } from '$lib';
  import { _ } from 'svelte-i18n';

  let loading = false;

  const setProfilePic: SubmitFunction = () => {
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
  action="/panel/profil?/setProfilePic"
  method="POST"
  use:enhance="{setProfilePic}"
  on:submit|preventDefault="{handleSubmit}"
>
  <div class="-space-y-px rounded-md shadow-sm">
    <div>
      <label for="url" class="sr-only">
        {$_('profilePicForm.urlPlaceholder')}
      </label>
      <input
        id="url"
        name="url"
        required="{true}"
        class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder="{$_('profilePicForm.urlPlaceholder')}"
      />
    </div>
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
      {$_('profilePicForm.setProfilePic')}
    </button>
  </div>
</form>
