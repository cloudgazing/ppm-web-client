import { createCustomContext } from '~/context/createContext.ts';

type BannerValue = string | undefined;

interface BannerContext {
	banner: BannerValue;
	setBanner: React.Dispatch<React.SetStateAction<BannerValue>>;
}

const [useBannerContext, ContextProvider] = createCustomContext<BannerContext>();

export { useBannerContext, ContextProvider };
