import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },

  build: {
    outDir: 'dist',
    lib: {
      entry: {
        renderer: path.resolve(__dirname, 'src/renderer/index.ts')
      },
      formats: ['cjs', 'es']
    },
    rollupOptions: {
      external: [
        // React ecosystem (provided by host)
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',

        // Citadel host packages
        '@citadel-app/core',
        '@citadel-app/ui',
        '@citadel-app/sdk',

        // UI libraries (provided by host)
        'lucide-react',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-slot',
        'clsx',
        'tailwind-merge'
      ],
      output: [
        {
          dir: 'dist',
          format: 'cjs',
          entryFileNames: '[name].js',
          exports: 'named'
        }
      ]
    }
  }
});
