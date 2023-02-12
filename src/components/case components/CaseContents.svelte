<script lang="ts">
  import { colors, type CaseDrop } from '$lib';
  export let caseDrops: CaseDrop[];

  const parsedDisplayDrops = (() => {
    const uniqueKeys = [];
    for (const drop of caseDrops) {
      uniqueKeys.push({
        name: drop.skinName,
        weapon: drop.weaponName
      });
    }
    const filtered = uniqueKeys.filter(
      (
        (s) => (o) =>
          ((k) => !s.has(k) && s.add(k))(
            ['name', 'weapon'].map((k) => o[k as keyof typeof o]).join('|')
          )
      )(new Set())
    );
    const returnArr = [];
    for (const obj of filtered) {
      const allMatchingDrops = caseDrops.filter(
        (item) => item.skinName == obj.name && item.weaponName == obj.weapon
      );
      const displayDrop: DisplayDrop = {
        displayChance: allMatchingDrops[0].displayChance,
        skinRarity: allMatchingDrops[0].skinRarity,
        skinImgSource: allMatchingDrops[0].skinImgSource,
        weaponName: allMatchingDrops[0].weaponName,
        skinName: allMatchingDrops[0].skinName,
        priceRange: allMatchingDrops[0].priceRange,
        details: []
      };
      for (const drop of allMatchingDrops) {
        displayDrop.details.push({
          quality: drop.skinQuality,
          price: drop.skinPrice,
          range: drop.oddsRange,
          odds: drop.displayOdds
        });
      }
      returnArr.push(displayDrop);
    }
    return returnArr;
  })();

  function toggleDetails(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    }
  ) {
    e.currentTarget.offsetParent?.querySelector('.details-page')?.classList.toggle('hidden');
  }

  interface DisplayDrop {
    displayChance: string;
    skinRarity: keyof typeof colors.itemBg;
    skinImgSource: string;
    weaponName: string;
    skinName: string;
    priceRange: string;
    details: DisplayDropDetails[];
  }

  interface DisplayDropDetails {
    quality: string;
    price: number;
    range: number[];
    odds: string;
  }
</script>

<div class="container mx-auto">
  <section>
    <div
      class="flex flex-col items-center space-y-4 border-b border-solid md:space-y-0 border-navy-500"
    >
      <h2
        class="order-3 inline-block px-10 py-5 mx-auto -mb-px text-xl font-semibold leading-tight text-center text-white uppercase border-b border-solid md:order-2 border-gold"
      >
        Zawartość skrzyni
      </h2>
    </div>
    <ul class="grid mt-8 mb-20 gap-2 css-a27jap">
      {#each parsedDisplayDrops as drop}
        <li class="group" style="contain: content;">
          <div
            class="z-0 grid items-center justify-center grid-cols-1 grid-rows-1 bg-center bg-cover border border-dotted rounded group justify-items-center ratio border-navy-400 sm:rounded-lg css-awr5wf"
          >
            <div
              class="details-page z-20 w-full h-full col-start-1 row-start-1 row-end-3 rounded bg-navy-800 bg-opacity-70 sm:rounded-lg transition duration-300 css-bnrups hidden"
            >
              <div class="grid mt-5 text-right css-15kssi9">
                <div class="col-start-2 font-bold text-white uppercase">Price</div>
                <div class="font-bold text-white uppercase">Range</div>
                <div class="font-bold text-white uppercase">Odds</div>
                {#each drop.details as details}
                  <div class="text-navy-100">{details.quality}</div>
                  <div class="text-gold">{details.price.toFixed(2)} PLN</div>
                  <div class="text-navy-100">{details.range[0]} - {details.range[0]}</div>
                  <div class="text-navy-100">{details.odds}</div>
                {/each}
              </div>
            </div>
            <button
              id="detailsToggle"
              class="z-30 self-start col-start-1 row-start-1 justify-self-start css-5mrvkg text-navy-200"
              on:click="{(e) => toggleDetails(e)}"
            >
              <div
                class="flex items-center justify-center w-5 h-5 font-bold text-center transition-colors duration-200 rounded-full bg-navy-500 css-1t6ze00"
              >
                i
              </div>
            </button>
            <div
              class="z-10 col-start-1 row-start-1 mb-auto ml-auto font-semibold leading-none text-right uppercase text-navy-200 css-1f31obc"
            >
              Chance
              <br />
              <span class="css-ix4kef">{drop.displayChance}</span>
            </div>
            <img
              alt=""
              class="object-contain col-start-1 mt-6 md:mt-0 row-start-1 duration-300 transform group-hover:scale-110 ease-in-out css-96c4l3"
              src="{colors.itemBg[drop.skinRarity]}"
            />
            <img
              src="{drop.skinImgSource}"
              alt=""
              class="object-contain w-3/4 col-start-1 row-start-1 mt-6 duration-300 ease-in-out transform pointer-events-none sm:mt-0 group-hover:scale-75 group-hover:rotate-12 css-1w1pcrf"
            />
            <div
              class="z-10 self-end w-full col-start-1 row-start-2 font-semibold leading-tight uppercase md:row-start-1 justify-self-start css-1jurzha"
            >
              <div class="truncate text-navy-200 text-3xs">{drop.skinName}</div>
              <div class="font-bold text-white truncate css-6plnry">{drop.weaponName}­</div>
              <div class="-mb-1 font-bold truncate text-gold css-6plnry">
                {drop.priceRange}
              </div>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </section>
</div>
