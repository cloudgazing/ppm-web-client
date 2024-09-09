import { useBannerContext } from '~/context/banner/loader.ts';

export function Banner() {
	const { banner } = useBannerContext();

	return (
		<div>
			{banner && <div className="flex h-8 w-full min-w-full items-center justify-center bg-red-600">{banner}</div>}
		</div>
	);
}
