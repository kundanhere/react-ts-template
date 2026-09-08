import { ErrorBoundary } from "@/app/error-boundary";
import { useAuthSync } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { RouteRenderer } from "@/routes/route-renderer";

import { Providers } from "./providers";

function App() {
  useTheme();
  useAuthSync();

  return (
    <Providers>
      <ErrorBoundary variant="root">
        <RouteRenderer />
      </ErrorBoundary>
    </Providers>
  );
}

export default App;
