<style>
  .loader,
  .loader:after {
    border-radius: 50%;
    width: var(--size);
    height: var(--size);
  }
  .loader {
    z-index: 500;
    border-top: var(--border-width) solid rgba(255, 255, 255, 0.2);
    border-right: var(--border-width) solid rgba(255, 255, 255, 0.2);
    border-bottom: var(--border-width) solid rgba(255, 255, 255, 0.2);
    border-left: var(--border-width) solid #ffffff;
    transform: translateZ(0);
    animation: load 1.1s infinite linear;
  }

  @keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>

<script>
  export let size = '2.5em';
  export let borderWidth = '.4em';
</script>

<div class="loader" style="--border-width: {borderWidth}; --size: {size}"></div>
