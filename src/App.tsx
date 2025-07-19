import { Providers } from "./components/providers";
import { RouteRenderer } from "./routes/RouteRenderer";

function App() {
  return (
    <Providers>
      <RouteRenderer />
    </Providers>
  );
}

export default App;
