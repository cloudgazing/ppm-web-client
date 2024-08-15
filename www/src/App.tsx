import { Dispatch, SetStateAction, useState } from 'react';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';

import { Auth } from '~/pages/Auth.tsx';
import { Chat } from '~/pages/Chat.tsx';
import { NotFound } from '~/pages/NotFound.tsx';

async function loader(setLoaded: React.Dispatch<React.SetStateAction<boolean>>) {
	const { default: init, getCsrf, sendValidate } = await import('ppm-wasm');

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
			loader: async () => {
				const authenticated = await loader(setLoaded);

				if (authenticated === false) {
					return redirect('/auth');
				}

				return null;
			},
			element: <Chat />,
			errorElement: <div>chat server down</div>
		},
		{
			path: '/auth',
			loader: async () => {
				const authenticated = await loader(setLoaded);

				if (authenticated === true) {
					return redirect('/');
				}

				return null;
			},
			element: <Auth />,
			errorElement: <div>auth server down</div>
		},
		{
			path: '*',
			element: <NotFound />
		}
	]);
}

export function App() {
	const [loaded, setLoaded] = useState(false);

	return <RouterProvider router={router(loaded, setLoaded)} />;
}
