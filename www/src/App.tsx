import { useEffect, useState } from 'react';
import { Spinner } from '@material-tailwind/react';

//import { Chat } from '~/pages/Chat.tsx';
import { Login } from '~/pages/Login.tsx';
import { AppStateContextProvider } from '~/context/appState.provider.tsx';

import init from 'ppm-wasm';

export function App() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		async function initwasm() {
			await init();
			setIsLoaded(true);
		}
		void initwasm();
	}, []);

	return isLoaded ? (
		<AppStateContextProvider>
			<Login />
		</AppStateContextProvider>
	) : (
		<div className="flex h-screen items-center justify-center bg-gray-900 text-white transition-all duration-1000 ease-linear">
			<Spinner className="h-10 w-10" />
		</div>
	);
}
