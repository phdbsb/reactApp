import { logoutUser } from "@/store/features/authSlice";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5099/",
  mode: "cors",
  credentials: "include",
});

const middleware401: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logoutUser());
    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "examApi",
  tagTypes: ["Exams", "Registrations", "Deadlines", "PassedStatus", "Users"],
  baseQuery: middleware401,
  endpoints: () => ({}),
});
