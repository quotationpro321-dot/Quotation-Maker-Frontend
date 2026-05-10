"use client";

import { store } from "@/redux/store";
import { IChildren } from "@/types/common.type";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: IChildren) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
