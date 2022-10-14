<script>
  import Footer from '@components/footer.svelte';
  import Header from '@components/header.svelte';
  import Case from '@components/case.svelte';
  import data from '@assets/cases/kacper-rietz.json';
</script>


<Header />

<Case data="{data}"/>

<Footer />
