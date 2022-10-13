<script>
  import Footer from '@components/footer.svelte';
  import Header from '@components/header.svelte';
  import data from '@assets/cases/kacper-rietz.json';
  export let caseItems = [];
  export const colors = {
    gold: 'linear-gradient(transparent 60%, rgba(220, 174, 100, 0.15))',
    red: 'linear-gradient(transparent 60%, rgba(255, 68, 93, 0.15))',
    pink: 'linear-gradient(transparent 60%, rgba(223, 93, 238, 0.15))',
    violet: 'linear-gradient(transparent 60%, rgba(223, 93, 238, 0.15))',
    blue: 'linear-gradient(transparent 60%, rgba(68, 130, 255, 0.15))',
    gray: 'linear-gradient(transparent 60%, rgba(102, 102, 102, 0.15))'
  };
  for (let i = 0; i < 60; i++) {
    const roll = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
    const item = data.drops.find(
      (obj) => obj.dropDetails.range[0] <= roll && obj.dropDetails.range[1] >= roll
    );
    caseItems.push(item);
  }

  export function rollItem() {
    const items = [...document.querySelectorAll('li.case-item')];
    const winningItem = items[Math.floor(Math.random() * ((items.length - 3) - 7 + 1)) + 7];
    const bounds = winningItem.getBoundingClientRect();
    const x = Math.floor(Math.random() * (bounds.right - bounds.left + 1)) + bounds.right;
    // CaseRolls-row
    document.querySelector('ul.CaseRolls-row').animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(-${x / 2}px)` },
      { transform: `translateX(-${x}px)` }
    ], {
      iterations: 1,
      duration: 1500,
      easing: 'ease-in-out',
      endDelay: 500
    });
    document.querySelector('ul.CaseRolls-row').style.transform = `translateX(-${x}px)`;
  }
</script>

<Header />

<main
  class="bg-no-repeat"
  style="background-image: url(/images/bg.png); background-position: center top; background-size: 2570px;"
>
  <div
    id="case-root"
    style="background: url(/images/loser-bg.jpg) center top / 100% auto no-repeat"
  >
    <header class="container flex items-center grid-cols-3 py-8 sm:grid mx-auto">
      <a
        href="/"
        class="flex items-center transition-colors duration-200 text-navy-200 hover:text-white text-sm font-bold"
        ><svg class="w-3 h-3 mr-2 md:w-4 md:h-4 md:mr-3"
          ><use xlink:href="/icons/icons.svg#arrow-left" /></svg
        ><span class="pt-px leading-none"
          ><span class="md:hidden">Wróć</span><span class="hidden md:inline"
            >Wróć do strony głównej</span
          ></span
        ></a
      >
      <h2 class="px-6 mx-auto text-xl font-semibold leading-tight text-center text-white uppercase">
        KACPER RIETZ
      </h2>
      <div class="flex justify-center space-x-1 sm:space-x-2 sm:justify-end">
        <button
          class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg font-bold text-white border-navy-100 bg-navy-550 js-sound-btn"
          aria-label="Wyłącz dźwięk"
          ><svg viewBox="-10 0 130 120" class="block w-4 h-4 fill-current"
            ><path
              fill="currentColor"
              stroke="currentColor"
              stroke-width="10"
              d="M9.6 34.1c-2.5 0-4.6 0.9-6.4 2.7 -1.7 1.7-2.6 3.8-2.6 6.3v33.8c0 2.5 0.9 4.7 2.6 6.5C5 85 7.1 85.8 9.6 85.8h17.9l39.8 30.4V3.7L27.5 34.1H9.6"
              class="css-qeu6t3"
            /><path
              class="vol"
              d="M84.9 29.3l-7.8 8.2c6.5 6.5 9.8 14 9.8 22.5s-3.3 16-9.8 22.5l7.8 8.3C93.7 82 98 71.8 98 60S93.7 38 84.9 29.3"
              style="transform-origin: 0px 0px 0px; opacity: 1;"
              data-svg-origin="77.0999984741211 29.299999237060547"
              transform="matrix(1,0,0,1,0,0)"
            /><path
              class="vol"
              d="M99.5 15L92 22.8c10.5 10.5 15.8 22.9 15.8 37.2 0 14.7-5.3 27.1-15.8 37.1l7.5 8.3C112.5 92.9 119 77.8 119 60 119 42.2 112.5 27.2 99.5 15z"
              style="transform-origin: 0px 0px 0px; opacity: 1;"
              data-svg-origin="92 15"
              transform="matrix(1,0,0,1,0,0)"
            /></svg
          ></button
        ><button
          class="flex justify-center items-center h-10 px-4 transition-all duration-300 text-xs text-center border border-solid rounded-lg font-bold text-white border-navy-100 bg-navy-550"
          aria-label="Wyłącz tryb natychmiastowego wyświetlania wyniku"
          ><svg class="block w-4 h-4"><use xlink:href="/icons/icons.svg#lightning" /></svg></button
        >
      </div>
    </header>
    <section class="mt-1 mb-8 container mx-auto" style="max-width: 1480px;">
      <div class="relative">
        <svg
          viewBox="0 0 31 31"
          class="point-arrow absolute z-10 w-10 h-10 -mt-5 -ml-5 top-0 left-1/2 rotate-180"
          ><defs
            ><filter
              id="Polygon_43"
              x="1.5"
              y="2.5"
              width="28"
              height="24"
              filterUnits="userSpaceOnUse"
              ><feGaussianBlur stdDeviation="2.5" result="blur" /><feFlood
                flood-color="#ff445d"
                flood-opacity="0.388"
              /><feComposite operator="in" in2="blur" /><feComposite in="SourceGraphic" /></filter
            ></defs
          ><g transform="translate(-1265 -607)"
            ><g transform="translate(1270 612)" fill="#19181e" stroke="#262630" stroke-width="3"
              ><circle cx="10.5" cy="10.5" r="13.5" stroke="none" /><circle
                cx="10.5"
                cy="10.5"
                r="13"
                fill="none"
              /></g
            ><g transform="matrix(1, 0, 0, 1, 1265, 607)" filter="url(#Polygon_43)"
              ><g transform="translate(9 10)" fill="none"
                ><path d="M6.5,0,13,9H0Z" stroke="none" /><path
                  class="point-arrow-triangle"
                  d="M 6.5 3.415939807891846 L 3.91151237487793 7 L 9.08848762512207 7 L 6.5 3.415939807891846 M 6.5 0 L 13 9 L 0 9 L 6.5 0 Z"
                  stroke="none"
                  fill="#ff445d"
                /></g
              ></g
            ></g
          ></svg
        >
        <svg
          viewBox="0 0 31 31"
          class="point-arrow absolute z-10 w-10 h-10 -mt-5 -ml-5 top-full left-1/2 rotate-0"
          ><defs
            ><filter
              id="Polygon_43"
              x="1.5"
              y="2.5"
              width="28"
              height="24"
              filterUnits="userSpaceOnUse"
              ><feGaussianBlur stdDeviation="2.5" result="blur" /><feFlood
                flood-color="#ff445d"
                flood-opacity="0.388"
              /><feComposite operator="in" in2="blur" /><feComposite in="SourceGraphic" /></filter
            ></defs
          ><g transform="translate(-1265 -607)"
            ><g transform="translate(1270 612)" fill="#19181e" stroke="#262630" stroke-width="3"
              ><circle cx="10.5" cy="10.5" r="13.5" stroke="none" /><circle
                cx="10.5"
                cy="10.5"
                r="13"
                fill="none"
              /></g
            ><g transform="matrix(1, 0, 0, 1, 1265, 607)" filter="url(#Polygon_43)"
              ><g transform="translate(9 10)" fill="none"
                ><path d="M6.5,0,13,9H0Z" stroke="none" /><path
                  class="point-arrow-triangle"
                  d="M 6.5 3.415939807891846 L 3.91151237487793 7 L 9.08848762512207 7 L 6.5 3.415939807891846 M 6.5 0 L 13 9 L 0 9 L 6.5 0 Z"
                  stroke="none"
                  fill="#ff445d"
                /></g
              ></g
            ></g
          ></svg
        >
        <div
          class="relative overflow-hidden sm:rounded-lg bg-navy-800"
          style="height: 300px; box-shadow: rgba(66, 66, 84, 0.2) 0px 0px 0px 5px;"
        >
          <div
            class="absolute top-0 left-0 w-full h-full grid grid-stack"
            style="width: 1480px; left: calc(50% - 740px);"
          >
            <ul class="flex w-full h-full CaseRolls-row">
              {#each caseItems as item}
                <li class="flex-shrink-0 flex h-full min-w-0 relative case-item" style="width: 14.2857%; background-image: {colors[item.skinRarity]};">
                  <img
                    src={item.skinImgSource}
                    alt=""
                    class="object-contain mx-auto w-4/5 h-full"
                  />
                  <div
                    class="absolute bottom-0 left-0 w-full p-2 -mb-1 font-semibold leading-tight uppercase md:p-5"
                  >
                    <div class="truncate text-navy-200 css-1vba4yg">{item.skinName}</div>
                    <div class="font-bold text-white truncate" title="{item.skinWeapon} ">
                      {item.skinWeapon} ­
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
  <button id="roll" on:click={rollItem}>roll</button>
</main>

<Footer />
