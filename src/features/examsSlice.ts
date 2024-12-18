import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExamCard } from "../models/ExamCard";
import { ExamCardInterface } from "../models/ExamCardInterface";


interface ExamsState {
    exams: ExamCardInterface[];
}

const initialState: ExamsState = {
    exams: [
        { id: 1, title: "Operating systems", faculty: "Faculty of Electronics", startsIn: '2024-12-10T09:00:00' },
        { id: 2, title: "Computer Network", faculty: "Faculty of Electronics", startsIn: '2024-12-11T14:00:00' },
        { id: 3, title: "Web programming", faculty: "Faculty of Electronics", startsIn: '2024-12-15T08:00:00' },
        { id: 4, title: "Software engineering", faculty: "Faculty of Electronics", startsIn: '2024-12-18T12:00:00' },
        { id: 5, title: "Database systems", faculty: "Faculty of Electronics", startsIn: '2024-12-20T10:00:00' }
    ],
};

const examsSlice = createSlice({
    name: 'exams',
    initialState,
    reducers: {
        setExams: (state, action: PayloadAction<ExamCard[]>) => {
            state.exams = action.payload;
        },
        addExam: (state, action: PayloadAction<ExamCard>) => {
            state.exams.push(action.payload);
        },
        updateExam: (state, action: PayloadAction<ExamCard>) => {
            const index = state.exams.findIndex(exam => exam.id === action.payload.id);
            if (index !== -1) {
                state.exams[index] = action.payload;
            }
        },
        removeExam: (state, action: PayloadAction<number>) => {
            state.exams = state.exams.filter(exam => exam.id !== action.payload);
        }   
    }
});

export const { setExams, addExam, updateExam, removeExam } = examsSlice.actions;
export default examsSlice.reducer;