import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '~/App.tsx';

import '~/main.css';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
