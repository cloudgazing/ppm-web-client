import type { Config } from 'tailwindcss';
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'side-bar': 'rgb(23, 23, 23)'
			}
		}
	},
	plugins: []
} satisfies Config);
