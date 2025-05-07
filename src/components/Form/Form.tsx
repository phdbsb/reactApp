import FormManager from "./FormManager";
import dayjs from "dayjs";
import './style.css';
import { ExamCard } from "@/api/endpoints/exams/types";

interface FormProps {
    isEditMode: boolean;
    examToEdit?: ExamCard;
    onSave: (exam: ExamCard) => void;
    onClose: () => void;
}

const Form = ({ isEditMode, examToEdit, onSave, onClose }: FormProps) => {

    const initialFormData = {
        title: examToEdit?.title || "",
        semester: examToEdit?.semester || 1,
        januaryDate: examToEdit?.schedule?.January ? dayjs(examToEdit.schedule.January) : dayjs(),
        marchDate: examToEdit?.schedule?.March ? dayjs(examToEdit.schedule.March) : dayjs(),
        augustDate: examToEdit?.schedule?.August ? dayjs(examToEdit.schedule.August) : dayjs(),
    };

    const handleSave = (data: typeof initialFormData) => {
        const newExam = new ExamCard(
            examToEdit?.id || "",
            data.title,
            Number(data.semester),
            {
                January: data.januaryDate?.toISOString() || "",
                March: data.marchDate?.toISOString() || "",
                August: data.augustDate?.toISOString() || "",
            },
        );
        onSave(newExam);
    };

    return (
        <div className="form-wrapper">
            <h2>{isEditMode ? "Edit Exam" : "Create Exam"}</h2>
            <FormManager
                initialData={initialFormData}
                onSave={handleSave}
                onClose={onClose}
                isEditMode={isEditMode}
            />
        </div>
    );
};

export default Form;