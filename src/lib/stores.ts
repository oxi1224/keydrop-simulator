import { writable, type Writable } from 'svelte/store';
import type { PopupProps, UserData } from './types';

export const popupOpen = writable(false);
export const popupProps: Writable<PopupProps> = writable({
  type: 'error',
  header: '',
  message: ''
});
export const userData: Writable<UserData | null> = writable();
