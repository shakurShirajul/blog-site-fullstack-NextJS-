"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";

const ReduxProviderWrapper = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxProviderWrapper;
