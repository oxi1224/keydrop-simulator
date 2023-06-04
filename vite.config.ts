import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';
const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      src: '/src',
      $components: '/src/components/',
      $static: './static/',
      $assets: './src/assets/',
      '$lib/server': './src/lib/server/'
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
};

export default config;
