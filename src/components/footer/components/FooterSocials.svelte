<script>
  import { _ } from 'svelte-i18n';
</script>

<div>
  <div class="mb-3 ml-3 text-xs uppercase text-white">{$_('footer.socials.follow')}</div>
  <ul class="ml-1 flex">
    <li>
      <a
        href="https://www.instagram.com/keydropcom_official/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram page"
        class="block p-2 text-navy-200 transition-colors duration-200 hover:text-white"
      >
        <svg class="block h-6 w-6">
          <use xlink:href="/icons/icons.svg#instagram"></use>
        </svg>
      </a>
    </li>
    <li>
      <a
        href="https://www.facebook.com/keydropcom"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook page"
        class="block p-2 text-navy-200 transition-colors duration-200 hover:text-white"
      >
        <svg class="block h-6 w-6">
          <use xlink:href="/icons/icons.svg#facebook"></use>
        </svg>
      </a>
    </li>
    <li>
      <a
        href="https://www.twitter.com/keydropcom/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter page"
        class="block p-2 text-navy-200 transition-colors duration-200 hover:text-white"
      >
        <svg class="block h-6 w-6">
          <use xlink:href="/icons/icons.svg#twitter"></use>
        </svg>
      </a>
    </li>
    <li>
      <a
        href="https://steamcommunity.com/groups/csbulletsgo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Steam page"
        class="block p-2 text-navy-200 transition-colors duration-200 hover:text-white"
      >
        <svg class="block h-6 w-6">
          <use xlink:href="/icons/icons.svg#steam-circle"></use>
        </svg>
      </a>
    </li>
    <li>
      <a
        href="https://discord.com/invite/keydrop"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join the Key-Drop.com Discord Server!"
        class="block p-2 text-navy-200 transition-colors duration-200 hover:text-white"
      >
        <svg class="block h-6 w-6">
          <use xlink:href="/icons/icons.svg#discord"></use>
        </svg>
      </a>
    </li>
    <li>
      <a
        href="https://t.me/keydropofficial"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join the Key-Drop.com Telegram Channel!"
        class="block p-2 transition-colors duration-200 hover:text-white"
      >
        <svg class="block h-6 w-6">
          <use xlink:href="/icons/icons.svg#telegram"></use>
        </svg>
      </a>
    </li>
  </ul>
</div>
