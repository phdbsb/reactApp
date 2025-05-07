import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExamCard } from "./ExamCardInterface";
import { fetchExams, addExam, removeExam, updateExam } from "../thunks/examsThunks";


interface ExamsState {
    exams: IExamCard[];
}

const initialState: ExamsState = {
    exams: []
};

const examsSlice = createSlice({
    name: 'exams',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.fulfilled, (state, action: PayloadAction<IExamCard[]>) => {
                state.exams = action.payload;
            })
            .addCase(addExam.fulfilled, (state, action: PayloadAction<IExamCard>) => {
                state.exams.push(action.payload);
            })
            .addCase(updateExam.fulfilled, (state, action: PayloadAction<IExamCard>) => {
                const index = state.exams.findIndex((exam) => exam.id === action.payload.id);
                if (index !== -1) {
                    state.exams[index] = action.payload;    
                }
            })
            .addCase(removeExam.fulfilled, (state, action: PayloadAction<string>) => {
            state.exams = state.exams.filter((exam) => exam.id !== action.payload);
      });
    }
});

export default examsSlice.reducer;


