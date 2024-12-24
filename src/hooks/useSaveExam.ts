import { useDispatch } from "react-redux";
import { ExamCard } from "../models/ExamCard";
import { addExam, updateExam } from "../store/thunks/examsThunks";
import { AppDispatch } from "../store";

interface FormState {
    isEditMode: boolean;
    examToEditId: number | null;
    showForm: boolean;
}

const useSaveExam = () => {
    const dispatch = useDispatch<AppDispatch>();

    const saveExam = async (exam: ExamCard, formState: FormState) => {
        const examObject = {
            id: exam.id,
            title: exam.title,
            faculty: exam.faculty,
            startsIn: exam.startsIn,
        };
    
        if (formState.isEditMode && formState.examToEditId !== null) {
          await dispatch(updateExam(examObject));
        } else {
          await dispatch(addExam(examObject));
        }
    };

    return { saveExam };
};

export default useSaveExam;