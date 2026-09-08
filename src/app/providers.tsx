import { ReactNode } from "react";

// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/toast";
import { store } from "@/store";
import { queryClient, queryPersistOptions } from "@/utils/query-client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={queryPersistOptions}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </Provider>
  );
}
