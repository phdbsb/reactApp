import { IExamCard } from "../store/features/ExamCardInterface";
import { AddExam } from "../store/thunks/types";

export const createAddExamObject = (exam: IExamCard ): AddExam => {
    return {
        title: exam.title,
        semester: exam.semester,
        schedule: exam.schedule,
    };
};
