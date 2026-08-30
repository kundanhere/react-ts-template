import { ErrorBoundary } from "@/app/error-boundary";
import { RouteRenderer } from "@/routes/route-renderer";

import { Providers } from "./providers";

function App() {
  return (
    <Providers>
      <ErrorBoundary variant="root">
        <RouteRenderer />
      </ErrorBoundary>
    </Providers>
  );
}

export default App;
