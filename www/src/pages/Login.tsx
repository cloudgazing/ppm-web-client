import { Card, Typography, Input, Button, ButtonGroup } from '@material-tailwind/react';
import { FormEvent, useRef, useState } from 'react';
//import { useAppStateContext } from '~/context/appState.loader.ts';

function SignInForm() {
	//const { ws } = useAppStateContext();

	const accessKeyRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	function formSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (accessKeyRef.current?.value && passwordRef.current?.value) {
			//ws.sendLogin(accessKeyRef.current.value, passwordRef.current.value);
		}
	}

	return (
		<form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={formSubmit}>
			<div className="mb-1 flex flex-col gap-6">
				<Typography variant="h6" color="white" className="-mb-3">
					Access Key
				</Typography>
				<Input
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={accessKeyRef}
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
	//const { ws } = useAppStateContext();

	const accessKeyRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const displayNameRef = useRef<HTMLInputElement>(null);

	function formSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (accessKeyRef.current?.value && passwordRef.current?.value && displayNameRef.current?.value) {
			//ws.sendSignup(accessKeyRef.current.value, passwordRef.current.value, displayNameRef.current.value);
		}
	}

	return (
		<form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={formSubmit}>
			<div className="mb-1 flex flex-col gap-6">
				<Typography variant="h6" color="white" className="-mb-3">
					Access Key
				</Typography>
				<Input
					size="lg"
					className="!border-gray-700 text-white focus:!border-gray-50"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
					inputRef={accessKeyRef}
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

export function Login() {
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
