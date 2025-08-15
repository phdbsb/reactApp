import { baseApi } from "@/api";
import { UserDisplay, UserIdImage, UserInfoUpdate, UserRoleUpdate } from "./types";
import { IAuthResponse } from "../auth/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query<UserDisplay[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getUsersIdImage: builder.query<UserIdImage[], void>({
      query: () => "users/id-images",
      providesTags: ["ProfileImages", "UserIdImg"],
    }),

    updateUserRole: builder.mutation<void, UserRoleUpdate>({
      query: (user) => ({
        url: "users/update-role",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUserInfo: builder.mutation<IAuthResponse, UserInfoUpdate>({
      query: (body) => ({
        url: "users/update-info",
        method: "PUT",
        body
      }),
      invalidatesTags: ["Users", "CurrentUser"]
    })
  }),
});

export const {
  useGetAllusersQuery,
  useGetUsersIdImageQuery,
  useUpdateUserRoleMutation,
  useUpdateUserInfoMutation
} = userApi;
