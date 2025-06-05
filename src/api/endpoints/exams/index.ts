import { ExamCard, IExamCard, IGetExams } from "./types";
import { createAddExamObject } from "@/utils/AddExam";
import { baseApi } from "@/api";

export const examsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<IGetExams[], void>({
      query: () => "exams",
      providesTags: ["Exams"],
    }),

    addExam: builder.mutation<void, IExamCard>({
      query: (exam) => ({
        url: "exams",
        method: "POST",
        body: createAddExamObject(exam),
      }),
      invalidatesTags: ["Exams"],
    }),

    updateExam: builder.mutation<void, ExamCard>({
      query: (exam) => ({
        url: `exams/${exam.id}`,
        method: "PUT",
        body: exam,
      }),
      invalidatesTags: ["Exams", "Deadlines"],
    }),

    archiveExam: builder.mutation<void, { id: string }>({
      query: ({id}) => ({
        url: `exams/${id}/archive`,
        method: "PUT",
      }),
      invalidatesTags: ["Exams"],
    }),
  }),
});

export const { useGetExamsQuery, useAddExamMutation, useUpdateExamMutation, useArchiveExamMutation } = examsApi;
