"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";
import AuthLoader from "@/components/AuthLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthLoader>
        {children}
        <Toaster position="top-center" />
      </AuthLoader>
    </Provider>
  );
}
