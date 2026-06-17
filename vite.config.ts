import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
            return 'react-vendor';
          }

          // Keep Profabric's React wrappers with React to avoid circular
          // dependencies between admin-vendor and react-vendor in production.
          if (id.includes('@profabric')) {
            return 'react-vendor';
          }

          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui-vendor';
          }

          if (id.includes('@reduxjs') || id.includes('/redux') || id.includes('react-redux')) {
            return 'state-vendor';
          }

          if (id.includes('@fortawesome')) {
            return 'icons-vendor';
          }

          if (id.includes('admin-lte')) {
            return 'admin-vendor';
          }

          if (id.includes('react-bootstrap') || id.includes('formik') || id.includes('yup')) {
            return 'forms-vendor';
          }

          if (id.includes('react-toastify')) {
            return 'toast-vendor';
          }

          if (id.includes('react-highlight.js') || id.includes('highlight.js')) {
            return 'highlight-vendor';
          }

          if (id.includes('crypto-js') || id.includes('luxon') || id.includes('uuid')) {
            return 'utils-vendor';
          }

          if (id.includes('styled-components')) {
            return 'styled-vendor';
          }

          if (id.includes('axios') || id.includes('oidc-client-ts') || id.includes('i18next')) {
            return 'data-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
 // server: {
 //   host: '10.90.250.186',
 //   port: 5173, // optional; defaults to 5173
 //   https: false // optional; since you're using `basicSsl()`
 // }
});
