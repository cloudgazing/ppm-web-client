import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';
import tsconfigPaths from 'vite-tsconfig-paths';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	plugins: [tsconfigPaths(), react(), wasm(), topLevelAwait(), checker({ typescript: true })],
	server: {
		fs: {
			allow: ['..'],
		},
	},
});
