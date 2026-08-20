import { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/toast";
import { store } from "@/store";
import { queryClient } from "@/utils/query-client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
