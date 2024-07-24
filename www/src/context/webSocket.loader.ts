import type { WebSocketClient } from "ppm-wasm";

import { createCustomContext } from '~/context/custom.ts';

type WebSocket = {
	WSClient: WebSocketClient;
};

const [useWSClientContext, ContextProvider] = createCustomContext<WebSocket>();

export { useWSClientContext, ContextProvider };
