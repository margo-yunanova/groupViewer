import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import groups from "../../server/groups.ts";
import { GetGroupsResponse, Group } from "./types.ts";
import { getResponseAfterDelay } from "./utils.ts";

export const groupsApi = createApi({
  reducerPath: "groupsApi",
  tagTypes: ["Groups"],
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (build) => ({
    getGroups: build.query<Group[], void>({
      queryFn: async () => {
        const { result, data }: GetGroupsResponse = await getResponseAfterDelay(
          { result: 1, data: groups },
          1000
        );

        if (data && result === 1) return { data };
        return {
          error: {
            status: 500,
            data: "Internal Server Error",
          },
        };
      },
    }),
  }),
});

export const { useGetGroupsQuery } = groupsApi;
