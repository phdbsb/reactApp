import FormManager from "./FormManager";
import { ExamCard } from "models/ExamCard";
import './style.css';

interface FormProps {
    isEditMode: boolean;
    examToEdit?: ExamCard;
    onSave: (exam: ExamCard) => void;
}

const Form = ({ isEditMode, examToEdit, onSave }: FormProps) => {
    return (
        <div className="form-wrapper">
            <h2>{isEditMode ? "Edit Exam" : "Create Exam"}</h2>
            <FormManager
                isEditMode={isEditMode}
                examToEdit={examToEdit}
                onSave={onSave}
            />
        </div>
    );
};

export default Form;