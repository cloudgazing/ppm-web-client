import { useEffect, useState } from 'react';

import { Chat } from '~/pages/Chat.tsx';
import init from 'ppm-wasm';

declare global {
	interface Window {
		onMessageReceived: (message: string) => void;
	}
}

export function App() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		window.onMessageReceived = (message: string) => {
			console.log(message);
		};
		async function initwasm() {
			await init();
			setIsLoaded(true);
		}
		void initwasm();
	}, []);

	return isLoaded && <Chat />;
}
