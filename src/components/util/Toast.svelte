<script lang="ts">
  import { closetoast, toastOpen, toastProps, type ToastProps } from '$lib';
  let open: boolean;
  let toastData: ToastProps;
  toastOpen.subscribe((bool) => (open = bool));
  toastProps.subscribe((props) => (toastData = props));
</script>

<div
  id="toast-container"
  class="z-50 fixed right-0 bottom-0 max-w-full md:right-5 md:bottom-5 md:w-96 transition-transform duration-500 translate-x-110 is-open:-translate-x-0 {open
    ? 'is-open'
    : ''}"
  on:click="{closetoast}"
  on:keypress="{() => null}"
>
  <div class="mt-2 w-full h-full">
    <div
      class="flex items-center w-full relative z-0 text-white cursor-pointer md:rounded-xl bg-opacity-95 {toastData.type ===
      'error'
        ? 'bg-failure'
        : 'bg-success'}"
    >
      <div
        class="self-stretch shrink-0 flex justify-center items-center w-16 p-2 mb-3 ml-5 bg-white rounded-bl-xl rounded-rl-xl {toastData.type ===
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
        <p class="font-semibold text-base leading-none uppercase">{toastData.header}</p>
        <p class="mt-2 font-extralight text-xs leading-snug">{toastData.message}</p>
      </div>
      <div class="toast-close-btn"></div>
    </div>
  </div>
</div>
