import type { ReactNode } from 'react';

import { createCustomContext } from '~/context/custom.ts';

import { WebSocketClient } from "ppm-wasm";

type WebSocket = {
	WSClient: WebSocketClient;
};

const [useWSClientContext, ContextProvider] = createCustomContext<WebSocket>();

function WSContextProvider({ children }: { children: ReactNode }) {
	const WSClient = new WebSocketClient();

	return <ContextProvider value={{ WSClient }}>{children}</ContextProvider>;
}

export { WSContextProvider, useWSClientContext };
