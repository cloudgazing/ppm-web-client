import { useRef } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs.tsx';
import { Button } from '~/components/ui/button.tsx';
import { Input } from '~/components/ui/input.tsx';
import { Label } from '~/components/ui/label.tsx';

function LoginTab() {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	function submitData() {
		const username = usernameRef.current?.value;
		const password = passwordRef.current?.value;

		if (username && password) {
			void (async () => {
				const { sendAuthLogin } = await import('wasm-module');
				try {
					const resp = await sendAuthLogin(username, password);
					if (resp.ok) {
						alert('Login successful!');
					} else {
						alert(resp.message);
					}
				} catch (e) {
					alert(e instanceof Error ? e.message : e);
				}
			})();

			usernameRef.current.value = '';
			passwordRef.current.value = '';
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Log In</CardTitle>
				<CardDescription>Log into an existing account.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label htmlFor="username">Username</Label>
					<Input id="username" ref={usernameRef} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" ref={passwordRef} />
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={submitData}>Continue</Button>
			</CardFooter>
		</Card>
	);
}

function SignUpTab() {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordVerifyRef = useRef<HTMLInputElement>(null);
	const displayNameRef = useRef<HTMLInputElement>(null);

	function submitData() {
		const username = usernameRef.current?.value;
		const password = passwordRef.current?.value;
		const passwordVerify = passwordVerifyRef.current?.value;
		const displayName = displayNameRef.current?.value;

		if (username && password && passwordVerify && displayName) {
			void (async () => {
				const { sendAuthSignup } = await import('wasm-module');
				try {
					const resp = await sendAuthSignup(username, password, displayName);
					if (resp.ok) {
						alert('Login successful!');
					} else {
						alert(resp.message);
					}
				} catch (e) {
					alert(e instanceof Error ? e.message : e);
				}
			})();

			usernameRef.current.value = '';
			passwordRef.current.value = '';
			passwordVerifyRef.current.value = '';
			displayNameRef.current.value = '';
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Create a new account.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label htmlFor="username">Username</Label>
					<Input id="username" ref={usernameRef} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" ref={passwordRef} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="verify-password">Verify Password</Label>
					<Input id="verify-password" type="password" ref={passwordVerifyRef} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="display-name">Display Name</Label>
					<Input id="display-name" ref={displayNameRef} />
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={submitData}>Continue</Button>
			</CardFooter>
		</Card>
	);
}

export function Auth() {
	return (
		<main className="mt-40 flex flex-col items-center gap-4">
			<Tabs defaultValue="login" className="w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">Log In</TabsTrigger>
					<TabsTrigger value="signup">Sign Up</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<LoginTab />
				</TabsContent>
				<TabsContent value="signup">
					<SignUpTab />
				</TabsContent>
			</Tabs>
			<p>OR</p>
			<Button>Start a quick conversation</Button>
		</main>
	);
}
