import { useEffect } from "react";
import { ExamCard } from "models/ExamCard";
import { useForm, Controller  } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { v4 as uuidv4 } from 'uuid';
import "./style.css";


interface FormData {
    title: string;
    faculty: string;
    semester: number;
    januaryDate: Dayjs | null;
    marchDate: Dayjs | null;
    augustDate: Dayjs | null;
}

interface FormManagerProps {
    isEditMode: boolean;
    examToEdit?: ExamCard; 
    onSave: (exam: ExamCard) => void;
}

const FormManager = ({isEditMode, examToEdit, onSave}: FormManagerProps) => {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>();


    const onSubmit = (data: FormData) => {
        console.log("Form Data:", data);
        console.log("ExamTOEdit type: ", typeof(examToEdit?.id));
        const newExam = new ExamCard (
            examToEdit ? examToEdit.id : uuidv4(),
            data.title,
            data.faculty,
            Number(data.semester),
            {
                January: data.januaryDate?.toISOString() || "",
                March: data.marchDate?.toISOString() || "",
                August: data.augustDate?.toISOString() || "",
            },
            examToEdit ? examToEdit.isPassed : false
        );
        console.log("New Exam:", newExam);
        onSave(newExam);
        reset();
    };

    useEffect(() => {
        if (isEditMode && examToEdit) {
            const { schedule } = examToEdit;
            reset({
                title: examToEdit.title,
                faculty: examToEdit.faculty,
                semester: examToEdit.semester,
                januaryDate: schedule.January ? dayjs(schedule.January) : null,
                marchDate: schedule.March ? dayjs(schedule.March) : null,
                augustDate: schedule.August ? dayjs(schedule.August) : null,
            });
        } else {
            reset({ title: "", faculty: "", semester: 1, januaryDate: dayjs(), marchDate: dayjs(), augustDate: dayjs(), });
        }
    }, [isEditMode, examToEdit, reset]);

    const deadlines = [
        { label: "January Deadline:", name: "januaryDate" },
        { label: "March Deadline:", name: "marchDate" },
        { label: "August Deadline:", name: "augustDate" }
    ];

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
                <label>Semester:</label>
                <select {...register("semester", { required: "This field is required" })}>
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                </select>
                {errors.semester && <span>{errors.semester.message}</span>}
            </div>
            {deadlines.map(({ label, name }) => (
                <div key={name}>
                    <label>{label}</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name={name as keyof FormData}
                            control={control}
                            rules={{ required: "This field is required" }}
                            render={({ field }) => (
                                <DateTimePicker
                                    {...field}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue)}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    {errors[name as keyof FormData] && <span>{errors[name as keyof FormData]?.message}</span>}
                </div>
            ))}
            <button type="submit">{isEditMode ? "Save Changes" : "Create Exam"}</button>
        </form>
    );
}

export default FormManager;