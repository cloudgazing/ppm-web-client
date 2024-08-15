import { Card, Typography, Input, Button, ButtonGroup } from '@material-tailwind/react';
import { FormEvent, useRef, useState } from 'react';

interface JSResponse {
	ok: boolean;
	message: string;
}

function SignInForm() {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	function formSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const username = usernameRef.current?.value;
		const password = passwordRef.current?.value;

		if (username && password) {
			void (async () => {
				const { sendLogin } = await import('ppm-wasm');

				try {
					const resp = (await sendLogin(username, password)) as JSResponse;

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
		<form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={formSubmit}>
			<div className="mb-1 flex flex-col gap-6">
				<Typography variant="h6" color="white" className="-mb-3">
					Username
				</Typography>
				<Input
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={usernameRef}
					crossOrigin=""
				/>
				<Typography variant="h6" color="white" className="-mb-3">
					Password
				</Typography>
				<Input
					type="password"
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={passwordRef}
					crossOrigin=""
				/>
			</div>
			<Button color="white" className="mt-6" fullWidth type="submit">
				Continue
			</Button>
		</form>
	);
}

function SignUpForm() {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const displayNameRef = useRef<HTMLInputElement>(null);

	function formSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const username = usernameRef.current?.value;
		const password = passwordRef.current?.value;
		const displayName = displayNameRef.current?.value;

		if (username && password && displayName) {
			void (async () => {
				const { sendSignup } = await import('ppm-wasm');

				try {
					const resp = (await sendSignup(username, password, displayName)) as JSResponse;

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
			displayNameRef.current.value = '';
		}
	}

	return (
		<form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={formSubmit}>
			<div className="mb-1 flex flex-col gap-6">
				<Typography variant="h6" color="white" className="-mb-3">
					Username
				</Typography>
				<Input
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={usernameRef}
					crossOrigin=""
				/>
				<Typography variant="h6" color="white" className="-mb-3">
					Password
				</Typography>
				<Input
					type="password"
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={passwordRef}
					crossOrigin=""
				/>
				<Typography variant="h6" color="white" className="-mb-3">
					Display Name
				</Typography>
				<Input
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={displayNameRef}
					crossOrigin=""
				/>
			</div>
			<Button color="white" className="mt-6" fullWidth type="submit">
				Continue
			</Button>
		</form>
	);
}

export function Auth() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<main className="relative h-screen w-screen bg-gray-900">
			<div className="absolute left-1/2 top-1/4 flex -translate-x-1/2 transform flex-col items-center">
				<ButtonGroup color="white">
					<Button onClick={() => setIsLogin(true)}>Log In</Button>
					<Button onClick={() => setIsLogin(false)}>Sign Up</Button>
				</ButtonGroup>
				<Card color="transparent" shadow={false}>
					{isLogin ? <SignInForm /> : <SignUpForm />}
				</Card>
			</div>
		</main>
	);
}
