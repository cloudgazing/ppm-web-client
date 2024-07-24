import type { AppState } from '~/types/appState.ts';

import { createCustomContext } from '~/context/custom.ts';

const [useAppStateContext, ContextProvider] = createCustomContext<AppState>();

export { useAppStateContext, ContextProvider };
