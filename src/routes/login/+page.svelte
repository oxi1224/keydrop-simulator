<script>
  import Login from '$components/forms/Login.svelte';
  import Register from '$components/forms/Register.svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    if (localStorage.getItem('logged_in') === 'true') window.location.href = '/';
  });

  function toggleLogin() {
    const loginPage = document.getElementById('loginPage');
    loginPage?.classList.toggle('flex');
    loginPage?.classList.toggle('hidden');
  }

  function toggleRegister() {
    const registerPage = document.getElementById('registerPage');
    registerPage?.classList.toggle('flex');
    registerPage?.classList.toggle('hidden');
  }
</script>

<Login />
<Register />
<main
  class="bg-no-repeat"
  style="
          background-image: url(images/bg.png);
          background-position: center top;
          background-size: 2570px;
          "
>
  <main class="mx-auto container py-16 overflow-hidden relative">
    <div class="aboslute z-10 flex flex-col justify-center items-center">
      <img src="images/website.png" alt="" class="w-3/4 sm:w-1/3" />
      <h2 class="mt-12 e404-subtitle leading-none text-gold font-bold uppercase">
        Nie jesteś zalogowany
      </h2>
      <p class="mt-4 text-sm leading-tight text-navy-300 font-light text-center">
        Musisz być zalogowany aby zobaczyć tę stronę.
      </p>
      <button
        class="mt-5 mb-2 bg-gold-500 px-10 py-3 rounded-md font-semibold text-sm transition-colors duration-200 hover:bg-gold-400"
        on:click="{toggleLogin}"
      >
        Zaloguj się
      </button>
      <button
        class="bg-gold-500 px-10 py-3 rounded-md font-semibold text-sm transition-colors duration-200 hover:bg-gold-400"
        on:click="{toggleRegister}"
      >
        Zarejestruj się
      </button>
    </div>
  </main>
</main>
