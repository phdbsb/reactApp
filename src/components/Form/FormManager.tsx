import { useForm, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./style.css";
import { useEffect, useState } from "react";

interface FormData {
    title: string;
    semester: number;
    januaryDate: Dayjs;
    marchDate: Dayjs;
    augustDate: Dayjs;
}

interface FormManagerProps {
    initialData: FormData;
    onSave: (data: FormData) => void;
    onClose: () => void;
    isEditMode: boolean;
}

const FormManager = ({ initialData, onSave, onClose, isEditMode }: FormManagerProps) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: initialData
    });

    useEffect(() => {
        reset(initialData);
    }, [reset]);

    const deadlines = [
        { label: "January deadline:", name: "januaryDate" },
        { label: "March deadline:", name: "marchDate" },
        { label: "August deadline:", name: "augustDate" }
    ];

    return (
        <form onSubmit={handleSubmit(onSave)}>
            <div>
                <label>Title:</label>
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                        <input {...field} />
                    )}
                />
                {errors.title && <span>{errors.title.message}</span>}
            </div>
            <div>
                <label>Semester:</label>
                <Controller
                    name="semester"
                    control={control}
                    render={({ field }) => (
                        <select {...field}>
                            <option value={1} className='option1'>Semester 1</option>
                            <option value={2} className='option1'>Semester 2</option>
                        </select>
                    )}
                />
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
                                    sx={{
                                        ".MuiInputBase-input": {
                                            padding: 1.25,
                                            fontSize: 14,
                                        },
                                        ".MuiOutlinedInput-root": {
                                            bgcolor: (t) => t.palette.grey[100]

                                        },
                                        ".MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                            borderColor: (t) => t.palette.divider,
                                        }
                                    }}
                                    {...field}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue ?? dayjs())}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    {errors[name as keyof FormData] && <span>{errors[name as keyof FormData]?.message}</span>}
                </div>
            ))}
            <div className="form-buttons">
                <button type="button" className="close-button" onClick={onClose}>Close</button>
                <button type="submit" className="save-button">{isEditMode ? "Save" : "Create"}</button>
            </div>
        </form>
    );
};

export default FormManager;