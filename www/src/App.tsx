import { Chat } from "~/pages/Chat.tsx";

import init from 'ppm-wasm';
import { useEffect, useState } from "react";

init().then();

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
