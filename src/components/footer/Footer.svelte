<script lang="ts">
  import FooterStats from './components/FooterStats.svelte';
  import FooterPaymentsList from './components/FooterPaymentsList.svelte';
  import FooterNav from './components/FooterNav.svelte';
  import FooterSocials from './components/FooterSocials.svelte';
</script>

<footer class="bg-navy-600">
  <FooterStats />
  <FooterPaymentsList />
  <div class="bg-navy-800">
    <div class="container mx-auto text-navy-300">
      <div class="flex flex-col py-16 sm:flex-row sm:items-center">
        <div>
          <a rel="alternate" href="/" class="ml-3 block w-48" aria-label="Go back to front page">
            <svg viewBox="0 0 269.2 67.4" class="block">
              <path
                class="fill-white text-white"
                d="M179.3 17.5V55h-5.2l-.3-4.2c-2.1 3.4-5.6 4.7-9.2 4.7-7.7 0-13.5-5-13.5-13.8 0-9 5.7-13.8 13.4-13.8 3.2 0 7.6 1.6 9.3 4.7V17.5h5.5zm-22.7 24.3c0 5.3 3.7 8.6 8.4 8.6 4.6 0 8.4-3.4 8.4-8.6 0-5.1-3.8-8.6-8.4-8.6-4.7 0-8.4 3.1-8.4 8.6zm35.3-13.2l.4 3.5c1.9-3.4 4.9-4.1 7.8-4.1 2.6 0 5 .9 6.5 2.3l-2.5 4.8a6.5 6.5 0 00-4.7-1.6c-3.8 0-7.1 2.4-7.1 7.2V55h-5.5V28.6h5.1zm43.4 13.2c0 7.8-5.4 13.7-13.7 13.7-8.3 0-13.6-5.9-13.6-13.7S213.4 28 221.6 28c8.1 0 13.7 6 13.7 13.8zm-21.8 0c0 4.7 3.1 8.6 8.1 8.6 5.1 0 8.1-3.9 8.1-8.6s-3.3-8.7-8.1-8.7c-5.1 0-8.1 4-8.1 8.7zm27.6 25.5V28.6h5.2l.3 4.3a11 11 0 019.3-4.8c7.9.1 13.3 5.8 13.3 13.8s-5.1 13.8-13.3 13.8c-3.2 0-7.3-1.2-9.3-4.4v16.1h-5.5v-.1zm22.7-25.5c0-5-3.3-8.4-8.4-8.4s-8.3 3.7-8.3 8.4 3.5 8.4 8.3 8.4a8 8 0 008.4-8.4zM151.1 62h13.6v5.3h-13.6V62z"
              ></path>
              <path
                class="fill-gold text-gold"
                d="M73.1 17.5v21.9l9.8-10.8h6.7v.3L78.2 41l13 13.6v.4h-6.8L73.1 42.8V55h-5.6V17.5h5.6zm24.5 26.3c.5 4 3.8 6.6 8.6 6.6 2.7 0 6.1-1 7.7-2.8l3.6 3.5c-2.7 3-7.3 4.5-11.4 4.5-8.7 0-14.3-5.5-14.3-14 0-8 5.6-13.8 13.9-13.8 8.5 0 14.3 5.2 13.3 16H97.6zm16.1-4.6c-.3-4.2-3.4-6.4-7.8-6.4-4 0-7.3 2.2-8.2 6.4h16zm35.4-10.6l-16.7 38.7h-6.1l5.5-12.6-10.6-26h6.4l4.6 12.5 2.6 7.5 2.8-7.4 5.3-12.6h6.2v-.1zM25 24.5h6.7v9.1H25v-9.1zm0 14h6.7V63H25V38.5zm-4.8-4.9H4.6c-2.5 0-4.6-2-4.6-4.6 0-2.5 2-4.6 4.6-4.6h15.6v9.2zm0 29.4C11.8 63 5 56.2 5 47.8v-9.3h15.2V63zm16.3-29.4h15.6c2.5 0 4.6-2 4.6-4.6 0-2.5-2-4.6-4.6-4.6H36.5v9.2zm0 29.4c8.4 0 15.2-6.8 15.2-15.2v-9.3H36.5V63zM24.4 20.1L9.2 15.8c-1.1-.3-1.3-1.9-.4-2.5L19.2 6c.7-.5 1.6-.2 1.9.6L26 18.1c.4 1.1-.5 2.3-1.6 2zm5.8-1.7L39.1.8c.5-1 1.8-1 2.3-.1l8.9 14.9c.5.9 0 2-.9 2.1l-17.8 2.8c-1.1.1-1.9-1.1-1.4-2.1z"
              ></path>
            </svg>
          </a>
          <div class="mt-10 flex w-full sm:w-auto">
            <FooterSocials />
          </div>
        </div>
        <FooterNav />
      </div>
      <div
        class="flex flex-col justify-between border-t border-dashed border-navy-600 pb-20 pt-8 text-xs font-light md:flex-row"
      ></div>
    </div>
  </div>
</footer>
