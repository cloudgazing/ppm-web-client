import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import { ThemeProvider } from '~/providers/theme-provider.tsx';

async function loader() {
	const { default: init, sendVerification } = await import('wasm-module');

	try {
		await init();

		await sendVerification();

		return true;
	} catch (e) {
		console.error(e instanceof Error ? e.message : e);

		return false;
	}
}

function router() {
	return createBrowserRouter([
		{
			path: '/',
			async lazy() {
				const { Chat } = await import('~/pages/Chat.tsx');

				return {
					Component: Chat,
					errorElement: <div>chat server down</div>,
					loader: async () => {
						const verified = await loader();

						if (!verified) {
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
						const verified = await loader();

						if (verified) {
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
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<RouterProvider router={router()} />
		</ThemeProvider>
	);
}
