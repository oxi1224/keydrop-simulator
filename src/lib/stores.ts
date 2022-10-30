import { writable, type Writable } from 'svelte/store';
import type { PopupProps, UserData } from './types';

export const popupOpen = writable(false);
export const popupProps: Writable<PopupProps> = writable({
  type: 'error',
  header: '',
  message: ''
});
export const setUserData = async () => {
  const { data } = await (await fetch('/api/get-user', { method: 'get' })).json();
  userData.set(data);
  localStorage.setItem('logged_in', `${!!data}`);
};
export const userData: Writable<UserData | null> = writable(null);
