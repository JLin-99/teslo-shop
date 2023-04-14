import type { AppProps } from "next/app";
import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { lightTheme } from "@/themes";
import { AuthProvider, CartProvider, UIProvider } from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT || "",
        }}
      >
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
