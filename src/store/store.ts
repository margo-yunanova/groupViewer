import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import groups from "../slices/groupsSlice";
import { groupsApi } from "../utils/api";

export const store = configureStore({
  reducer: {
    groups,
    [groupsApi.reducerPath]: groupsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(groupsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
