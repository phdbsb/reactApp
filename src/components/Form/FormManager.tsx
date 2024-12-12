import { useEffect, useState } from "react";
import { ExamCard } from "../../models/ExamCard";
import { useForm, Controller  } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./style.css";


interface FormData {
    title: string;
    faculty: string;
    time: Dayjs | null;
}

interface FormManagerProps {
    isEditMode: boolean;
    examToEdit?: ExamCard; 
    onSave: (exam: ExamCard) => void;
}

const FormManager = ({isEditMode, examToEdit, onSave}: FormManagerProps) => {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>();

    const onSubmit = (data: FormData) => {

        const newExam = new ExamCard (
            examToEdit ? examToEdit.id : Date.now(),
            data.title,
            data.faculty,
            dayjs(data.time).toISOString()
        );
        onSave(newExam);
        reset();
    };

    useEffect(() => {
        if (isEditMode && examToEdit) {
          reset({
            title: examToEdit.title,
            faculty: examToEdit.faculty,
            time: dayjs(examToEdit.startsIn),
          });
        } else {
            reset({ title: "", faculty: "", time: dayjs() });
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
                <label>Date and Time:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="time"
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                            <DateTimePicker
                                {...field}
                                value={field.value || null}
                                onChange={(newValue) => field.onChange(newValue)}
                            />
                        )}
                    />
                </LocalizationProvider>
                {errors.time && <span>{errors.time.message}</span>}
            </div>
            <button type="submit">{isEditMode ? "Save Changes" : "Create Exam"}</button>
        </form>
    );
}

export default FormManager;