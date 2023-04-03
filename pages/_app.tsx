import type { AppProps } from "next/app";
import "@/styles/globals.css";

import { SWRConfig } from "swr";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { lightTheme } from "@/themes";
import { CartProvider, UIProvider } from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <CartProvider>
        <UIProvider>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UIProvider>
      </CartProvider>
    </SWRConfig>
  );
}
