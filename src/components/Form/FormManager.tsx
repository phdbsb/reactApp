import { useForm, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import styles from './style.module.css';
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    useEffect(() => {
        reset(initialData);
    }, [reset]);

    const deadlines = [
        { label:  t("form.januaryDeadline"), name: "januaryDate" },
        { label: t("form.marchDeadline"), name: "marchDate" },
        { label: t("form.augustDeadline"), name: "augustDate" }
    ];

    return (
        <form onSubmit={handleSubmit(onSave)}>
            <div>
                <label>{t("form.title")}:</label>
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: t("form.requiredField") }}
                    render={({ field }) => (
                        <input {...field} />
                    )}
                />
                {errors.title && <span>{errors.title.message}</span>}
            </div>
            <div>
                <label>{t("form.semester")}:</label>
                <Controller
                    name="semester"
                    control={control}
                    render={({ field }) => (
                        <select {...field}>
                            <option value={1} className={styles['option1']}>{t("form.semester1")}</option>
                            <option value={2} className={styles['option1']}>{t("form.semester2")}</option>
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
                            rules={{ required: t("form.requiredField") }}
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
            <div className={styles["form-buttons"]}>
                <button type="button" className={styles["close-button"]} onClick={onClose}>{t("form.close")}</button>
                <button type="submit" className={styles["save-button"]}>{isEditMode ? t("form.save") : t("form.create")}</button>
            </div>
        </form>
    );
};

export default FormManager;