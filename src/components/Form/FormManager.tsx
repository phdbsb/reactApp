import React, { useEffect } from "react";
import { ExamCard } from "../../models/ExamCard";
import { useForm } from "react-hook-form";

interface FormData {
    title: string;
    faculty: string;
    time: string;
}

interface FormManagerProps {
    isEditMode: boolean;
    examToEdit?: ExamCard; 
    onSave: (exam: ExamCard) => void;
}

const FormManager = ({isEditMode, examToEdit, onSave}: FormManagerProps) => {
    const { register, handleSubmit, formState: {errors}, reset } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        const newExam = new ExamCard (
            examToEdit ? examToEdit.id : Date.now(),
            data.title,
            data.faculty,
            data.time
        );
        onSave(newExam);
        reset();
    };

    useEffect(() => {
        if (isEditMode && examToEdit) {
          reset({
            title: examToEdit.title,
            faculty: examToEdit.faculty,
            time: examToEdit.startsIn
          });
        } else {
          reset({ title: "", faculty: "", time: "" });
        }
    }, [isEditMode, examToEdit, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Title:</label>
                <input
                    {...register("title", { required: "This field is required" })}
                />
                {errors.title && <span>{errors.title.message}</span>}
            </div>
            <div>
                <label>Faculty:</label>
                <input
                    {...register("faculty", { required: "This field is required" })}
                />
                {errors.faculty && <span>{errors.faculty.message}</span>}
            </div>
            <div>
                <label>Time:</label>
                <input
                    {...register("time", { required: "This field is required" })}
                />
                {errors.time && <span>{errors.time.message}</span>}
            </div>
            <button type="submit">{isEditMode ? "Save Changes" : "Create Exam"}</button>
        </form>
    );
}

export default FormManager;