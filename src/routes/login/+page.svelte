<script>
  import Login from '$components/forms/Login.svelte';
  import Register from '$components/forms/Register.svelte';
  import { _ } from 'svelte-i18n';

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
          background-image: url(images/bg.webp);
          background-position: center top;
          background-size: 2570px;
          "
>
  <main class="mx-auto container py-16 overflow-hidden relative">
    <div class="aboslute z-10 flex flex-col justify-center items-center">
      <img src="images/website.webp" alt="" class="w-3/4 sm:w-1/3" />
      <h2 class="mt-12 e404-subtitle leading-none text-gold font-bold uppercase">
        {$_('loginPage.title')}
      </h2>
      <p class="mt-4 text-sm leading-tight text-navy-300 font-light text-center">
        {$_('loginPage.text')}
      </p>
      <button
        class="mt-5 mb-2 bg-gold-500 px-10 py-3 rounded-md font-semibold text-sm transition-colors duration-200 hover:bg-gold-400"
        on:click="{toggleLogin}"
      >
        {$_('loginPage.login')}
      </button>
      <button
        class="bg-gold-500 px-10 py-3 rounded-md font-semibold text-sm transition-colors duration-200 hover:bg-gold-400"
        on:click="{toggleRegister}"
      >
        {$_('loginPage.register')}
      </button>
    </div>
  </main>
</main>
