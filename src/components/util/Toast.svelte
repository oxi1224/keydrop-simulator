<script lang="ts">
  import { closetoast, toastOpen, toastProps, type ToastProps } from '$lib';
  let open: boolean;
  let toastData: ToastProps;
  toastOpen.subscribe((bool) => (open = bool));
  toastProps.subscribe((props) => (toastData = props));
</script>

<div
  id="toast-container"
  class="fixed bottom-0 right-0 z-50 max-w-full translate-x-110 transition-transform duration-500 is-open:-translate-x-0 md:bottom-5 md:right-5 md:w-96 {open
    ? 'is-open'
    : ''}"
  on:click="{closetoast}"
  on:keypress="{() => null}"
>
  <div class="mt-2 h-full w-full">
    <div
      class="relative z-0 flex w-full cursor-pointer items-center bg-opacity-95 text-white md:rounded-xl {toastData.type ===
      'error'
        ? 'bg-failure'
        : 'bg-success'}"
    >
      <div
        class="rounded-rl-xl mb-3 ml-5 flex w-16 shrink-0 items-center justify-center self-stretch rounded-bl-xl bg-white p-2 {toastData.type ===
        'error'
          ? 'text-failure'
          : 'text-success'}"
      >
        <svg class="block max-h-full" width="100%" viewBox="0 0 50 50">
          <g transform="translate(-1025 -1255)">
            <g transform="translate(1025 1255)" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="25" cy="25" r="25" stroke="none"></circle>
              <circle cx="25" cy="25" r="24" fill="none"></circle>
            </g>
            <path
              d="M1.89-8.3,4.97-6.86,5.5-24.57H1.3Zm1.5,3.64a2.262,2.262,0,0,0-1.663.683A2.262,2.262,0,0,0,1.05-2.31,2.205,2.205,0,0,0,1.732-.665,2.293,2.293,0,0,0,3.395,0,2.293,2.293,0,0,0,5.057-.665,2.205,2.205,0,0,0,5.74-2.31a2.262,2.262,0,0,0-.683-1.662A2.262,2.262,0,0,0,3.395-4.655Z"
              transform="translate(1047 1295)"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </div>
      <div class="p-5">
        <p class="text-base font-semibold uppercase leading-none">{toastData.header}</p>
        <p class="mt-2 text-xs font-extralight leading-snug">{toastData.message}</p>
      </div>
      <div class="toast-close-btn"></div>
    </div>
  </div>
</div>
