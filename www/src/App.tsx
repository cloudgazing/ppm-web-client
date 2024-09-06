import { Dispatch, SetStateAction, useState } from 'react';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import { ThemeProvider } from '~/providers/theme-provider.tsx';

async function loader(setLoaded: React.Dispatch<React.SetStateAction<boolean>>) {
	const { default: init, getCsrf, sendValidate } = await import('wasm-module');

	await init();

	try {
		await getCsrf();

		const valid = await sendValidate();

		if (valid) setLoaded(true);

		return valid;
	} catch (e) {
		console.error(e instanceof Error ? e.message : e);

		return null;
	}
}

function router(_loaded: boolean, setLoaded: Dispatch<SetStateAction<boolean>>) {
	return createBrowserRouter([
		{
			path: '/',
			async lazy() {
				const { Chat } = await import('~/pages/Chat.tsx');

				return {
					Component: Chat,
					errorElement: <div>chat server down</div>,
					loader: async () => {
						const authenticated = await loader(setLoaded);

						if (authenticated === false) {
							return redirect('/auth');
						}

						return null;
					},
				};
			},
		},
		{
			path: '/auth',
			async lazy() {
				const { Auth } = await import('~/pages/Auth.tsx');

				return {
					Component: Auth,
					errorElement: <div>auth server down</div>,
					loader: async () => {
						const authenticated = await loader(setLoaded);

						if (authenticated === true) {
							return redirect('/');
						}

						return null;
					},
				};
			},
		},
		{
			path: '*',
			async lazy() {
				const { NotFound } = await import('~/pages/NotFound.tsx');

				return { Component: NotFound };
			},
		},
	]);
}

export function App() {
	const [loaded, setLoaded] = useState(false);

	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<RouterProvider router={router(loaded, setLoaded)} />
		</ThemeProvider>
	);
}
