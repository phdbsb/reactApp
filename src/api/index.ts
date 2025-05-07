import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "examApi",
    tagTypes: [
        "Exams",
        "Registrations",
        "Deadlines"
    ],
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:5099/", mode: 'cors', credentials: 'omit' }),
    endpoints: () => ({}),
});