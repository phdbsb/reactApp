import { baseApi } from "@/api";
import { IAuthResponse, ILogin, IReg } from "./types";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<IAuthResponse, IReg>({
            query: (auth) => ({
                url: "auth/register",
                method: "POST",
                body: auth
            })
        }),

        login: builder.mutation<IAuthResponse, ILogin>({
            query: (auth) => ({
                url: "auth/login",
                method: "POST",
                body: auth
            })
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "auth/logout",
                method: "POST"
            }),
        }),
    })
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;