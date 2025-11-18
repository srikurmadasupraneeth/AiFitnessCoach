// app/providers.tsx
"use client";

import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {
  ChakraProvider,
  ColorModeScript,
  localStorageManager,
  cookieStorageManagerSSR,
} from "@chakra-ui/react";
import theme from "./theme";

const cache = createCache({ key: "chakra", prepend: true });

export function Providers({ children }: { children: React.ReactNode }) {
  // For App Router, server may render; but this file is client-only.
  return (
    <CacheProvider value={cache}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider
        theme={theme}
        colorModeManager={
          typeof window === "undefined"
            ? cookieStorageManagerSSR("")
            : localStorageManager
        }
      >
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
