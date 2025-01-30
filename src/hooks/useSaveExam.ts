import { useDispatch } from "react-redux";
import { ExamCard } from "../models/ExamCard";
import { addExam, updateExam } from "../store/thunks/examsThunks";
import { AppDispatch } from "../store";

interface FormState {
    isEditMode: boolean;
    examToEditId: string | null;
    showForm: boolean;
}

const useSaveExam = () => {
    const dispatch = useDispatch<AppDispatch>();
   
  
    const saveExam = async (exam: ExamCard, formState: FormState) => {
        console.log(typeof(exam.id));
        const examObject = {
            id: exam.id,
            title: exam.title,
            faculty: exam.faculty,
            semester: exam.semester,
            schedule: exam.schedule,
            isPassed: exam.isPassed
        };
    
        console.log("Exam ID:", typeof(exam.id));

        if (formState.isEditMode && formState.examToEditId !== null) {
          await dispatch(updateExam(examObject));
        } else {
          await dispatch(addExam(examObject));
        }
    };

    return { saveExam };
};

export default useSaveExam;