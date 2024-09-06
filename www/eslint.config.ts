import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	prettierConfig,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: true,
			},
			sourceType: 'module',
		},
		plugins: { import: importPlugin },
		rules: {
			'import/extensions': ['error', 'ignorePackages'],
			'import/order': [
				'warn',
				{
					groups: ['type', 'builtin', 'external', ['internal', 'parent', 'sibling'], 'index', 'object', 'unknown'],
					'newlines-between': 'always',
				},
			],
			'@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
		},
	},
	{ ignores: ['dist', '.vercel'] }
);
