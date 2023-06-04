import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';
const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: 'src/components/',
      $static: 'static/',
      $assets: 'src/assets/',
      '$lib/server': 'src/lib/server/'
    },
    preserveSymlinks: true
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
};

export default config;
