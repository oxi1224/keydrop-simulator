import { writable, type Writable } from 'svelte/store';
import type { ToastProps } from './types';
import { browser } from '$app/environment';

export const toastOpen = writable(false);
export const toastProps: Writable<ToastProps> = writable({
  type: 'error',
  header: '',
  message: ''
});

export const fastOpen = writable<boolean>(false);
export const loggedIn = writable<boolean>(false);

if (browser) {
  fastOpen.subscribe((value) => localStorage['fast_open'] = String(value));
  loggedIn.subscribe((value) => localStorage['logged_in'] = String(value));
}