import type { ReactNode } from 'react';

import { WebSocketClient } from "ppm-wasm";

import { ContextProvider } from '~/context/webSocket.loader.ts';

function WSContextProvider({ children }: { children: ReactNode }) {
	const WSClient = new WebSocketClient();

	return <ContextProvider value={{ WSClient }}>{children}</ContextProvider>;
}

export { WSContextProvider };
