import { useWindowSize } from 'usehooks-ts';

import { ChatContextProvider } from '~/context/chat/provider.tsx';
import { SheetSidebar } from '~/components/SheetSidebar.tsx';
import { Sidebar } from '~/components/Sidebar.tsx';
import { UserButton } from '~/components/UserButton.tsx';
import { MessagesContainer } from '~/components/MessagesContainer.tsx';
import { Banner } from '~/components/Banner.tsx';
import { BannerContextProvider } from '~/context/banner/provider.tsx';

export function Chat() {
	const winSize = useWindowSize();

	return (
		<BannerContextProvider>
			<ChatContextProvider>
				<div className="flex h-screen max-h-screen min-h-screen flex-col">
					<Banner />
					<div className="flex flex-1 overflow-hidden">
						{winSize.width >= 650 && <Sidebar className="h-full max-h-full max-w-52 flex-1 md:max-w-60" />}
						<div className="flex h-full max-h-full flex-1 flex-col">
							<header className="flex h-14 flex-row-reverse items-center justify-between gap-4 px-6">
								<UserButton />
								{winSize.width < 650 && <SheetSidebar />}
							</header>
							<main className="m-6 flex flex-1 flex-col justify-between overflow-hidden">
								<MessagesContainer />
							</main>
						</div>
					</div>
				</div>
			</ChatContextProvider>
		</BannerContextProvider>
	);
}
