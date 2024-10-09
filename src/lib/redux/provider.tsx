"use client";
import React, { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/redux/store";

export const ReduxProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) storeRef.current = makeStore();

  return <Provider store={storeRef.current}>{children}</Provider>;
};
