import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    viteSingleFile({
      // Inline all JavaScript and CSS into the HTML
      removeViteModuleLoader: true,
      deleteInlinedFiles: true
    })
  ],
  build: {
    // Output directory
    outDir: 'dist',
    // Inline assets smaller than 100MB (basically everything)
    assetsInlineLimit: 100000000,
    // Don't minify for debugging
    minify: false,
    // Single chunk
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  // Ensure Vue is properly resolved
  resolve: {
    alias: {
      'vue': 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    }
  }
});