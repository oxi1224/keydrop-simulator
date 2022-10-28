import { writable, type Writable } from 'svelte/store';
import type { PopupProps, UserData } from './types';

export const popupOpen = writable(false);
export const popupProps: Writable<PopupProps> = writable({
  type: 'error',
  header: '',
  message: ''
});
export const setUserData = async () => {
  const { data } = await (await fetch('/api/getUser', { method: 'get' })).json();
  userData.set(data);
};
export const userData: Writable<UserData | null> = writable(null);
