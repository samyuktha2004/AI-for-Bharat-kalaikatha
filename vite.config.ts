
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'figma:asset/c4bd4a481962f09a4571c49fd1d8d14e665e0b1b.png': path.resolve(__dirname, './src/assets/c4bd4a481962f09a4571c49fd1d8d14e665e0b1b.png'),
        'figma:asset/9624e0bdf872be4bedbe11475c00e20161c3fe5a.png': path.resolve(__dirname, './src/assets/9624e0bdf872be4bedbe11475c00e20161c3fe5a.png'),
        'figma:asset/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png': path.resolve(__dirname, './src/assets/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png'),
        'figma:asset/839d5fc81266cc945ac41643b120ebf74a13775a.png': path.resolve(__dirname, './src/assets/839d5fc81266cc945ac41643b120ebf74a13775a.png'),
        'figma:asset/7fd5fb8a933651d1f6d8e284e3e3441e6c7838df.png': path.resolve(__dirname, './src/assets/7fd5fb8a933651d1f6d8e284e3e3441e6c7838df.png'),
        'figma:asset/47690a220b997aa35549fe419decf1f499e5d1e2.png': path.resolve(__dirname, './src/assets/47690a220b997aa35549fe419decf1f499e5d1e2.png'),
        'figma:asset/026d2eb585b4b871d4756883b2306909ae57cb39.png': path.resolve(__dirname, './src/assets/026d2eb585b4b871d4756883b2306909ae57cb39.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });