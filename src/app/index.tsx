import { RouteRenderer } from "@/routes/route-renderer";

import { Providers } from "./providers";

function App() {
  return (
    <Providers>
      <RouteRenderer />
    </Providers>
  );
}

export default App;
