import { useDispatch } from "react-redux";
import { addExam, updateExam } from "@/store/thunks/examsThunks";
import { AppDispatch } from "@/store";
import { ExamCard } from "@/api/endpoints/exams/types";

interface FormState {
    isEditMode: boolean;
    examToEditId: string | null;
    showForm: boolean;
}

const useSaveExam = () => {
    const dispatch = useDispatch<AppDispatch>();
   
  
    const saveExam = async (exam: ExamCard, formState: FormState) => {
        const examObject = {
            id: exam.id,
            title: exam.title,
            semester: exam.semester,
            schedule: exam.schedule
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