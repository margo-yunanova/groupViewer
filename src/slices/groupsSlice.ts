import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { GetGroupsResponse, Group } from "../utils/types";

const initialState: GetGroupsResponse = {
  result: 1,
  data: [],
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    getGroups: (state, action: PayloadAction<Group[]>) => {
      state.data = action.payload;
    },
  },
});

export const { getGroups } = groupsSlice.actions;

export const selectGroups = (state: RootState) => state.groups.data;

export default groupsSlice.reducer;
