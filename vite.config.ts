import { fileURLToPath } from 'node:url'

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// Components ship as Svelte source via `svelte-package` (see the `build`
// script), the way Svelte libraries are meant to be consumed: the app's own
// compiler builds them against its single Svelte runtime. Vite only bundles
// the stylesheet entry (`./styles.css`) — components never import CSS
// themselves, so consumers import it once.
//
// The `svelte` plugin stays registered so Storybook and the Vitest story
// suite, which inherit this config, can compile `.svelte` files.
export default defineConfig({
  plugins: [svelte()],
  build: {
    emptyOutDir: false,
    cssCodeSplit: true,
    lib: {
      entry: { styles: fileURLToPath(new URL('src/styles/index.css', import.meta.url)) },
      formats: ['es'],
    },
    rollupOptions: {
      output: { assetFileNames: '[name][extname]' },
    },
  },
})
