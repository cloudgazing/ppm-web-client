import type { ReactNode } from 'react';

import { useState } from 'react';

import { ContextProvider } from '~/context/banner/loader.ts';

function BannerContextProvider({ children }: { children: ReactNode }) {
	const [banner, setBanner] = useState<string>();

	return <ContextProvider value={{ banner, setBanner }}>{children}</ContextProvider>;
}

export { BannerContextProvider };
