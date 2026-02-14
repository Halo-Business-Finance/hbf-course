import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    // Exclude heavy unused packages from Vite's dependency pre-bundling
    // to prevent timeouts. None of these are imported in src/.
    exclude: [
      'pg',
      '@types/pg',
      'http-proxy',
      'drizzle-orm',
      'drizzle-kit',
      '@react-three/drei',
      '@react-three/fiber',
      'three',
      'terser',
      'fabric',
      '@mendable/firecrawl-js',
    ],
  },
}));
