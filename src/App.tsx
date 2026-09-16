import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/routes";
import SessionHydrator from "@/components/common/SessionHydrator";

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionHydrator />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
