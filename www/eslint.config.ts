import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	prettierConfig,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: true
			}
		},
		plugins: { import: importPlugin },
		rules: {
			'import/extensions': ['error', 'ignorePackages'],
			'@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }]
		}
	},
	{ ignores: ['vite.config.ts', 'dist', '.vercel'] }
);
