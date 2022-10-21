<script context="module">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  export async function load({ session }) {
    if (!session?.user) {
      return {
        status: 302,
        redirect: "/sign-in"
      };
    }
    return {
      props: {
        user: session.user
      }
    };
  }
</script>

<script lang="ts">
  import Footer from '$components/footer.svelte';
  import Header from '$components/header.svelte';
  import CaseSection from '$components/caseSection.svelte';
  import Register from '$components/register.svelte';
  import Login from '$components/login.svelte';
  import caseData from '$assets/broad.json';
  export let user: any;

  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  onMount(async () => { 
    if (browser) {
      const { Buffer } = await import('buffer');
      window.Buffer = Buffer;
    }
  });
</script>

<Login />
<Register />
<Header />

<main class="bg-no-repeat" style="background-position: center top; background-size: auto 1400px;">
  <div class="relative">
    <div id="caseList-root" class="py-10 pb-10">
      <div class="min-h-screen text-white">
        <div class="container mx-auto">
          {#each Object.entries(caseData) as [id, caseValues]}
            <CaseSection id="{id}" caseValues="{caseValues}" />
          {/each}
        </div>
      </div>
    </div>
  </div>
</main>

<Footer />
{JSON.stringify(user)}