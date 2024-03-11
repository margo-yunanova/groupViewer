import { configureStore } from "@reduxjs/toolkit";
import { groupsApi } from "../utils/api";

export const store = configureStore({
  reducer: {
    [groupsApi.reducerPath]: groupsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(groupsApi.middleware),
});
