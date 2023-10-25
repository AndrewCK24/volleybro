"use client";

import { Provider } from "react-redux";
import store from "./store";

export const Provider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
