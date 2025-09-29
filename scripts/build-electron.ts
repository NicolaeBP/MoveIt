import { build } from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Build configuration for Electron main process (ESM)
 */
const MAIN_BUILD_CONFIG = {
  entryPoints: [join(__dirname, '../electron/main.ts')],
  bundle: true,
  platform: 'node' as const,
  target: 'node18',
  format: 'esm' as const,
  outdir: join(__dirname, '../dist'),
  external: ['electron', '@nut-tree-fork/nut-js', 'electron-store'],
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV === 'development',
};

/**
 * Build configuration for Electron preload script (CommonJS)
 * Preload scripts must be CommonJS for Electron compatibility
 */
const PRELOAD_BUILD_CONFIG = {
  entryPoints: [join(__dirname, '../electron/preload.ts')],
  bundle: true,
  platform: 'node' as const,
  target: 'node18',
  format: 'cjs' as const,
  outdir: join(__dirname, '../dist'),
  external: ['electron'],
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV === 'development',
};

/**
 * Build Electron main and preload processes using esbuild
 * Main process: ESM format
 * Preload script: CommonJS format (required by Electron)
 */
(async (): Promise<void> => {
  try {
    // eslint-disable-next-line no-console
    console.log('🔨 Building Electron processes...');

    await Promise.all([build(MAIN_BUILD_CONFIG), build(PRELOAD_BUILD_CONFIG)]);

    // eslint-disable-next-line no-console
    console.log('✅ Electron build completed successfully');
  } catch (error) {
    console.error('❌ Electron build failed:', error);

    process.exit(1);
  }
})();
