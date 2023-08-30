<script>
  import { _ } from 'svelte-i18n';
</script>

<div class="bg-navy-700">
  <div
    class="container mx-auto flex flex-col justify-between space-y-5 py-9 tabular-nums xl:flex-row xl:space-y-5 xl:py-14"
  >
    <div
      class="group mx-auto flex cursor-default items-center text-sm xl:mx-0 xl:mt-5 xl:justify-center xl:text-lg"
    >
      <div class="relative mr-4">
        <svg
          viewBox="0 0 24 24"
          class="block h-20 w-20 fill-current text-gold"
          style="transform: rotate(-45deg)"
        >
          <path
            d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"
          ></path>
        </svg>
      </div>
      <div>
        <p
          class="cursor-default text-3xl font-semibold leading-none tracking-wide text-gold transition duration-500 ease-in-out group-hover:text-white"
        >
          696 969
        </p>
        <p class="mt-2 text-base uppercase leading-none text-navy-300">
          {$_('footer.stats.openedCases')}
        </p>
      </div>
    </div>
    <div
      class="group mx-auto flex cursor-default items-center text-sm xl:mx-0 xl:justify-center xl:text-lg"
    >
      <div class="relative mr-4">
        <svg viewBox="0 0 24 22" class="block h-20 w-20 fill-current text-gold">
          <path
            d="m18.965 15.79 3.31 3.176-1.422 1.365-3.31-3.176 1.422-1.365ZM23.28 19.013l.652.626a.218.218 0 0 1 0 .317l-2.049 1.966a.24.24 0 0 1-.33 0l-.652-.626a.218.218 0 0 1 0-.317l2.048-1.966a.24.24 0 0 1 .33 0ZM5.146 3.503a.287.287 0 0 0-.202-.08.297.297 0 0 0-.202.08.274.274 0 0 0-.084.194.265.265 0 0 0 .084.194l11.042 10.6-1.676 1.608L2.98 5.417 1.092 0l5.643 1.812 11.13 10.682-1.676 1.608-11.043-10.6ZM14.344 16.524l3.987-3.827.568-.545.933.896a.884.884 0 0 1 .27.627.856.856 0 0 1-.27.627l-.769.738-2.3 2.208-.782.75a.928.928 0 0 1-.653.26.956.956 0 0 1-.653-.26l-.934-.895.603-.579ZM5.035 15.803l1.422 1.364-3.309 3.176-1.422-1.364 3.31-3.176ZM1.05 19.026 3.1 20.992a.223.223 0 0 1 .068.158.216.216 0 0 1-.068.159l-.653.626a.235.235 0 0 1-.165.066.24.24 0 0 1-.165-.066L.068 19.969a.22.22 0 0 1 0-.317l.652-.626a.235.235 0 0 1 .165-.066.241.241 0 0 1 .165.066ZM5.692 12.73l3.988 3.828.567.545-.933.896a.926.926 0 0 1-.653.26.956.956 0 0 1-.653-.26l-.769-.738-2.301-2.209-.782-.75a.884.884 0 0 1-.27-.627.855.855 0 0 1 .27-.627l.933-.896.603.579ZM14.426 8.542l4.833-4.638a.27.27 0 0 0 .084-.194.27.27 0 0 0-.084-.195.293.293 0 0 0-.405 0l-4.832 4.639-1.676-1.609 4.92-4.721L22.907.012 21.021 5.43l-4.919 4.72-1.676-1.608ZM9.992 12.798l1.676 1.608-1.776 1.705-1.676-1.608 1.776-1.705ZM7.911 10.8l1.676 1.61-1.776 1.704-1.676-1.608L7.911 10.8Z"
          ></path>
        </svg>
      </div>
      <div>
        <p
          class="cursor-default text-3xl font-semibold leading-none tracking-wide text-gold transition-colors duration-300 ease-in-out hover:text-white"
        >
          696 969
        </p>
        <p class="mt-2 text-base uppercase leading-none text-navy-300">
          {$_('footer.stats.battles')}
        </p>
      </div>
    </div>
    <div
      class="group mx-auto flex cursor-default items-center text-sm xl:mx-0 xl:justify-center xl:text-lg"
    >
      <div class="relative mr-4">
        <svg viewBox="0 0 24 24" class="block h-20 w-20 fill-current text-gold">
          <path
            d="m10 10.414 4 4 5.707-5.707L22 11V5h-6l2.293 2.293L14 11.586l-4-4-7.707 7.707 1.414 1.414z"
          ></path>
        </svg>
      </div>
      <div>
        <p
          class="cursor-default text-3xl font-semibold leading-none tracking-wide text-gold transition-colors duration-300 ease-in-out hover:text-white"
        >
          696 969
        </p>
        <p class="mt-2 text-base uppercase leading-none text-navy-300">
          {$_('footer.stats.upgrades')}
        </p>
      </div>
    </div>
    <div
      class="group mx-auto flex cursor-default items-center text-sm xl:mx-0 xl:justify-center xl:text-lg"
    >
      <div class="relative mr-4">
        <svg
          viewBox="0 0 24 24"
          class="block h-20 w-20 fill-current text-gold"
          style="transform: scale(.95)"
        >
          <circle fill="none" cx="12" cy="7" r="3"></circle>
          <path
            d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm9 11v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1h2z"
          ></path>
        </svg>
      </div>
      <div>
        <p
          class="cursor-default text-3xl font-semibold leading-none tracking-wide text-gold transition-colors duration-300 ease-in-out hover:text-white"
        >
          696 969
        </p>
        <p class="mt-2 text-base uppercase leading-none text-navy-300">
          {$_('footer.stats.users')}
        </p>
      </div>
    </div>
    <div
      class="group mx-auto flex cursor-default items-center text-sm xl:mx-0 xl:justify-center xl:text-lg"
    >
      <div class="relative mr-4">
        <svg
          viewBox="0 0 24 24"
          class="block h-20 w-20 fill-current text-gold"
          style="transform: scale(.95)"
        >
          <path
            d="M12 6c3.537 0 6.837 1.353 9.293 3.809l1.414-1.414C19.874 5.561 16.071 4 12 4c-4.071.001-7.874 1.561-10.707 4.395l1.414 1.414C5.163 7.353 8.463 6 12 6zm5.671 8.307c-3.074-3.074-8.268-3.074-11.342 0l1.414 1.414c2.307-2.307 6.207-2.307 8.514 0l1.414-1.414z"
          ></path>
          <path
            d="M20.437 11.293c-4.572-4.574-12.301-4.574-16.873 0l1.414 1.414c3.807-3.807 10.238-3.807 14.045 0l1.414-1.414z"
          ></path>
          <circle cx="12" cy="18" r="2"></circle>
        </svg>
      </div>
      <div>
        <p
          class="cursor-default text-3xl font-semibold leading-none tracking-wide text-gold transition-colors duration-300 ease-in-out hover:text-white"
        >
          696 969
        </p>
        <p class="mt-2 text-base uppercase leading-none text-navy-300">
          {$_('footer.stats.online')}
        </p>
      </div>
    </div>
  </div>
</div>
