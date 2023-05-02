import { writable, type Writable } from 'svelte/store';
import type { ToastProps } from './types';
import { persisted } from 'svelte-local-storage-store';

export const settings = persisted('settings', {
  fastOpen: false
});

export const toastOpen = writable(false);
export const toastProps: Writable<ToastProps> = writable({
  type: 'error',
  header: '',
  message: ''
});
