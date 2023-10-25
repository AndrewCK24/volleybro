"use client";

import { Provider as ReduxProvider } from "react-redux";
import store from "./store";

export const Provider = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
