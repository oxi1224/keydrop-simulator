<script lang="ts">
  import { createPopup } from '$lib';
  import Spinner from '$components/util/Spinner.svelte';

  let loading = false;
  let name: string;
  let password: string;
  let passwordConfirm: string;
  let sandboxMode: boolean;

  async function handleRegister() {
    if (password !== passwordConfirm) {
      createPopup({
        type: 'error',
        header: 'błąd',
        message: 'Hasła się nie zgadzają.'
      });
      return;
    }
    loading = true;
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, password, sandboxMode }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    createPopup({
      type: res.ok ? 'success' : 'error',
      header: res.ok ? 'sukces' : 'błąd',
      message: (await res.json()).message
    });
    loading = false;
    return;
  }

  function toggleRegister() {
    const registerPage = document.getElementById('registerPage');
    registerPage?.classList.toggle('flex');
    registerPage?.classList.toggle('hidden');
  }
</script>

<div
  id="registerPage"
  class="hidden items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-700 bg-opacity-75 fixed top-0 z-50 w-full h-full"
>
  <div
    class="w-full max-w-md space-y-8 bg-navy-700 text-navy-300 p-5 rounded-md border-navy-500 border relative"
  >
    <div class="absolute top-5 right-5 cursor-pointer text-lg" on:click="{toggleRegister}">✖</div>
    <div>
      <h2 class="mt-6 text-center text-3xl font-semibold tracking-tight text-white">
        Zarejestruj się
      </h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault="{handleRegister}">
      <input type="hidden" name="remember" value="true" />
      <div class="-space-y-px rounded-md shadow-sm">
        <div>
          <label for="accountName" class="sr-only">Nazwa konta</label>
          <input
            id="accountName"
            required
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Nazwa Konta"
            bind:value="{name}"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Hasło</label>
          <input
            id="password"
            type="password"
            autocomplete="current-password"
            required
            class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Hasło"
            bind:value="{password}"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Potwierdź hasło</label>
          <input
            id="passwordConfirm"
            type="password"
            autocomplete="current-password"
            required
            class="relative block w-full appearance-none border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Potwierdź hasło"
            bind:value="{passwordConfirm}"
          />
        </div>
        <div class="bg-white rounded-b-md border border-gray-300 px-3 py-2 sm:text-sm">
          <input
            id="sandboxToggle"
            name="sandboxToggle"
            type="checkbox"
            bind:checked="{sandboxMode}"
          />
          <label for="sandboxToggle" class="text-navy-300 w-full">
            Tryb sandbox (nielimitowany balans)
          </label>
        </div>
      </div>

      <div class="relative overflow-hidden">
        <div
          class="bg-navy-500 bg-opacity-95 min-w-full min-h-full z-50 rounded-md {loading
            ? 'flex'
            : 'hidden'} absolute pointer-events-none justify-center items-center"
        >
          <Spinner size="2em" borderWidth=".3em" />
        </div>
        <button
          type="submit"
          disabled="{loading}"
          class="group relative flex w-full justify-center rounded-md border border-transparent bg-navy-500 py-2 px-4 text-sm font-medium text-white hover:bg-navy-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          Stwórz konto
        </button>
      </div>
    </form>
  </div>
</div>
