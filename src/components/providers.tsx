import { ReactNode } from "react";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  // Add more providers here as needed
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}
