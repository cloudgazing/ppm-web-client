import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';

import { App } from './App.tsx';

import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
	<StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</StrictMode>
);
