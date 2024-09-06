import { AppStateContextProvider } from '~/context/appState.provider.tsx';
import { SheetSidebar } from '~/components/SheetSidebar.tsx';
import { Sidebar } from '~/components/Sidebar.tsx';
import { UserButton } from '~/components/UserButton.tsx';
import { MessagesContainer } from '~/components/MessagesContainer.tsx';

export function Chat() {
	return (
		<AppStateContextProvider>
			<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
				<Sidebar />
				<div className="flex flex-col">
					<header className="flex h-14 flex-row-reverse items-center justify-between gap-4 px-4 lg:h-[60px] lg:px-6">
						<UserButton />
						<SheetSidebar />
					</header>
					<main className="flex flex-1 flex-col justify-between gap-4 p-4 lg:gap-6 lg:p-6">
						<MessagesContainer />
					</main>
				</div>
			</div>
		</AppStateContextProvider>
	);
}
