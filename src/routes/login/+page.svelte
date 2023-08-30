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
  <main class="container relative mx-auto overflow-hidden py-16">
    <div class="aboslute z-10 flex flex-col items-center justify-center">
      <img src="images/website.webp" alt="" class="w-3/4 sm:w-1/3" />
      <h2 class="e404-subtitle mt-12 font-bold uppercase leading-none text-gold">
        {$_('loginPage.title')}
      </h2>
      <p class="mt-4 text-center text-sm font-light leading-tight text-navy-300">
        {$_('loginPage.text')}
      </p>
      <button
        class="mb-2 mt-5 rounded-md bg-gold-500 px-10 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-gold-400"
        on:click="{toggleLogin}"
      >
        {$_('loginPage.login')}
      </button>
      <button
        class="rounded-md bg-gold-500 px-10 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-gold-400"
        on:click="{toggleRegister}"
      >
        {$_('loginPage.register')}
      </button>
    </div>
  </main>
</main>
