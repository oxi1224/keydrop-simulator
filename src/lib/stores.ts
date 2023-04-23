import type { Item, User } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';
import type { PopupProps } from './types';
import { browser } from '$app/environment';

export const popupOpen = writable(false);
export const popupProps: Writable<PopupProps> = writable({
  type: 'error',
  header: '',
  message: ''
});
export const setUserData = async () => {
  const { data } = await (
    await fetch('/api/get-user', { method: 'get', cache: 'no-cache' })
  ).json();
  userData.set(data);
  localStorage.setItem('logged_in', `${!!data}`);
};
export const userData: Writable<UserDataStore | null> = writable(null);
export interface UserDataStore extends Omit<User, 'passwordHash'> {
  inventory: Item[];
}

export const fastOpen = writable<boolean>(false);
export const loggedIn = writable<boolean>(false);

if (browser) {
  fastOpen.subscribe((value) => localStorage['fast_open'] = String(value));
  loggedIn.subscribe((value) => localStorage['logged_in'] = String(value));
}