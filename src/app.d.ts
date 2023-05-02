// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { UserData } from '$lib';

declare global {
  declare namespace App {
    interface Locals {
      user: UserData;
      lang: 'pl' | 'en';
    }
    interface PageData {
      user: UserData;
      lang: 'pl' | 'en';
      currency: 'pln' | 'eur';
    }
    // interface Error {}
    // interface Platform {}
  }
}
