import { Chat } from "~/pages/Chat.tsx";

import init from 'ppm-wasm';
import { useEffect, useState } from "react";

init().then();

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (window as any).onMessageReceived = (message: string) => {
      console.log(message);
    }
    async function initwasm() {
      await init();
      setIsLoaded(true);
    }
    initwasm();
  }, []);

  return (
    isLoaded && <Chat />
  )
}
