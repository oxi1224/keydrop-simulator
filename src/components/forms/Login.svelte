<script lang="ts">
  import { createToast } from '$lib';
  import Spinner from '$components/util/Spinner.svelte';
  import { invalidateAll } from '$app/navigation';
  import { applyAction, enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import type { SubmitFunction } from '@sveltejs/kit';

  let loading = false;

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

  const login: SubmitFunction = () => {
    return async ({ result }) => {
      if (result) loading = false;
      invalidateAll();
      await applyAction(result);
    };
  };

  function toggleLogin() {
    const loginPage = document.getElementById('loginPage');
    loginPage?.classList.toggle('flex');
    loginPage?.classList.toggle('hidden');
  }
</script>

<div
  id="loginPage"
  class="fixed top-0 z-50 hidden h-full w-full items-center justify-center bg-navy-700 bg-opacity-75 px-4 py-12 sm:px-6 lg:px-8"
>
  <div
    class="relative w-full max-w-md space-y-8 rounded-md border border-navy-500 bg-navy-700 p-5 text-navy-300"
  >
    <div
      class="absolute right-5 top-5 cursor-pointer text-lg"
      on:keypress="{() => null}"
      on:click="{toggleLogin}"
    >
      ✖
    </div>
    <div>
      <h2 class="mt-6 text-center text-3xl font-semibold tracking-tight text-white">
        {$_('loginPage.title')}
      </h2>
    </div>
    <form
      class="mt-8 space-y-6"
      action="/login?/login"
      method="POST"
      use:enhance="{login}"
      on:submit|preventDefault="{handleSubmit}"
    >
      <input type="hidden" name="remember" value="true" />
      <div class="-space-y-px rounded-md shadow-sm">
        <div>
          <label for="accountName" class="sr-only">{$_('loginForm.accountNamePlaceholder')}</label>
          <input
            id="accountName"
            name="accountName"
            required="{true}"
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="{$_('loginForm.accountNamePlaceholder')}"
          />
        </div>
        <div>
          <label for="password" class="sr-only">{$_('loginForm.passwordPlaceholder')}</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required="{true}"
            class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="{$_('loginForm.passwordPlaceholder')}"
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
          class="group relative flex w-full justify-center rounded-md border border-transparent bg-navy-500 px-4 py-2 text-sm font-medium text-white hover:bg-navy-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <!-- Heroicon name: mini/lock-closed -->
            <svg
              class="h-5 w-5 text-navy-300 group-hover:text-navy-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
          {$_('loginForm.buttonText')}
        </button>
      </div>
    </form>
  </div>
</div>
