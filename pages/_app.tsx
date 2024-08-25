import { QueryProvider } from "@/modules/provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "thirdweb/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider>
      <QueryProvider>
        <Component {...pageProps} />
      </QueryProvider>
    </ThirdwebProvider>
  );
}
