import { persisted } from 'svelte-local-storage-store';
import { writable, type Writable } from 'svelte/store';
import type { ToastProps } from './types';

export const settings = persisted('settings', {
  fastOpen: false,
  muteAudio: false
});

export const toastOpen = writable(false);
export const toastProps: Writable<ToastProps> = writable({
  type: 'error',
  header: '',
  message: ''
});
