import { baseApi } from "@/api";
import { UserDisplay, UserRoleUpdate } from "./types";
import { UserRole } from "../auth/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query<UserDisplay[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation<void, UserRoleUpdate>({
      query: (user) => ({
        url: "users/update-role",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetAllusersQuery, useUpdateUserRoleMutation } = userApi;
  