import { IRegistration, UpdatePassedModel } from "./types";
import { baseApi } from "@/api";

export const registrationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPassedStatus: builder.query<boolean, {examId: string}> ({
            query: ({examId}) => `registrations/passed-status?examId=${examId}`,
            providesTags: ["Exams", "Registrations"]
        }),
        
        registerExam: builder.mutation<void, IRegistration>({
            query: (registration) => ({
                url: "registrations",
                method: "POST",
                body: registration
            }),
            invalidatesTags: ["Registrations", "Exams"]
        }),
        
        updatePassedStatus: builder.mutation<void, UpdatePassedModel> ({
            query: (update) => ({
                url: "registrations/status",
                method: "PUT",
                body: update
            }),
            invalidatesTags: ["Registrations", "Exams"],
        }),
    }),
});


export const {
    useGetPassedStatusQuery,
    useRegisterExamMutation,
    useUpdatePassedStatusMutation
} = registrationsApi;