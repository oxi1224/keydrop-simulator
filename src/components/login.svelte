<script lang="ts">
  import { createPopup } from '$lib';

  let name: string;
  let password: string;
  async function handleLogin() {
    const res = await fetch('/api/log-in', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      createPopup({
        type: 'error',
        header: 'błąd',
        message: (await res.json()).message
      });
      return;
    }
    createPopup({
      type: 'success',
      header: 'sukces',
      message: (await res.json()).message
    });
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    loginPage?.classList.remove('flex');
    registerPage?.classList.remove('flex');
    loginPage?.classList.add('hidden');
    registerPage?.classList.add('hidden');
    return;
  }

  export function toggleScreens() {
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    loginPage?.classList.toggle('flex');
    loginPage?.classList.toggle('hidden');
    registerPage?.classList.toggle('flex');
    registerPage?.classList.toggle('hidden');
  }
</script>

<div
  id="loginPage"
  class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-700 bg-opacity-75 fixed top-0 z-50 w-full h-full"
>
  <div
    class="w-full max-w-md space-y-8 bg-navy-700 text-navy-300 p-5 rounded-md border-navy-500 border"
  >
    <div>
      <h2 class="mt-6 text-center text-3xl font-semibold tracking-tight text-white">Zaloguj się</h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault="{handleLogin}">
      <input type="hidden" name="remember" value="true" />
      <div class="-space-y-px rounded-md shadow-sm">
        <div>
          <label for="accountName" class="sr-only">Nazwa konta</label>
          <input
            id="accountName"
            required
            bind:value="{name}"
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Nazwa Konta"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            bind:value="{password}"
            autocomplete="current-password"
            required
            class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-navy-700 placeholder-navy-300 focus:z-10 focus:border-navy-550 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Hasło"
          />
        </div>
      </div>
      <div>
        <div
          class="text-xs text-navy-200 mb-2 hover:text-navy-100 w-fit transition-colors duration-100"
          on:click="{toggleScreens}"
        >
          <button class="w-fit">Nie masz konta? Stwórz je!</button>
        </div>
        <button
          type="submit"
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
          Login
        </button>
      </div>
    </form>
  </div>
</div>
