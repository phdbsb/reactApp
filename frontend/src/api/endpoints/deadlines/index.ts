import { IDeadline } from "./types";
import { baseApi } from "@/api";

export const deadlinesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDeadlines: builder.query<IDeadline[], string> ({
            query: (id) => `deadlines/${id}`,
            providesTags: ["Deadlines"],
        }),
    })
});

export const { 
    useGetDeadlinesQuery
} = deadlinesApi;