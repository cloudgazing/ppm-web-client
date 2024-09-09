import { createContext, useContext } from 'react';

export function createCustomContext<T>() {
	const context = createContext<T | undefined>(undefined);

	function useCustomContext() {
		const value = useContext(context);

		if (value === undefined) {
			throw new Error(`useContext must be used inside a Provider with a value that's not undefined`);
		}

		return value;
	}

	return [useCustomContext, context.Provider] as const;
}
