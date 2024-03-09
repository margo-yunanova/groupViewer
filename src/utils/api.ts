import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import groups from "../../server/groups.ts";

export const groupsApi = createApi({
  reducerPath: "groupsApi",
  tagTypes: ["Groups"],
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (build) => ({
    getGroups: build.query({
      queryFn: async () => {
        const result = await new Promise((resolve) => {
          setTimeout(() => resolve(groups), 1000);
        });
        return { data: result };
      },
    }),
  }),
});

export const { useGetGroupsQuery } = groupsApi;
