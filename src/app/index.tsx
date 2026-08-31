import { ErrorBoundary } from "@/app/error-boundary";
import { useTheme } from "@/hooks/use-theme";
import { RouteRenderer } from "@/routes/route-renderer";

import { Providers } from "./providers";

function App() {
  useTheme();

  return (
    <Providers>
      <ErrorBoundary variant="root">
        <RouteRenderer />
      </ErrorBoundary>
    </Providers>
  );
}

export default App;
