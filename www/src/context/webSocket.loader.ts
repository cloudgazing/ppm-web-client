import type { WebSocketClient } from 'ppm-wasm';

import { createCustomContext } from '~/context/custom.ts';

interface WebSocket {
	WSClient: WebSocketClient;
}

const [useWSClientContext, ContextProvider] = createCustomContext<WebSocket>();

export { useWSClientContext, ContextProvider };
