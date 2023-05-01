// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { UserData } from "$lib";

declare global {
  declare namespace App {
  
    interface Locals {
      user: UserData
    }
    interface PageData {
      user: UserData
    }
    // interface Error {}
    // interface Platform {}
  }
}
