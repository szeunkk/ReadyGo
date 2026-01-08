import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        // 유닛 테스트 프로젝트
        test: {
          name: 'unit',
          include: [
            'src/features/**/*.test.ts',
            'src/features/**/*.test.tsx',
            'src/lib/**/*.test.ts',
            'src/lib/**/*.test.tsx',
            'src/services/**/*.test.ts',
            'src/services/**/*.test.tsx',
            'src/repositories/**/*.test.ts',
            'src/repositories/**/*.test.tsx',
          ],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/*.e2e.test.ts',
            '**/*.e2e.test.tsx',
          ],
          environment: 'node',
          globals: true,
        },
      },
    ],
  },
});
