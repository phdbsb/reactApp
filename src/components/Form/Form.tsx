import FormManager from "./FormManager";
import dayjs from "dayjs";
import styles from './style.module.css';
import { ExamCard } from "@/api/endpoints/exams/types";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface FormProps {
    open: boolean;
    isEditMode: boolean;
    examToEdit?: ExamCard;
    onSave: (exam: ExamCard) => void;
    onClose: () => void;
}

const Form = ({ open, isEditMode, examToEdit, onSave, onClose }: FormProps) => {
    const { t } = useTranslation();

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
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle sx={{fontSize: '1.4rem', fontWeight: 600}}>{isEditMode ? t("form.editExam") : t("form.createExam")}</DialogTitle>
            <DialogContent>
                <FormManager
                    initialData={initialFormData}
                    onSave={handleSave}
                    onClose={onClose}
                    isEditMode={isEditMode}
                />
            </DialogContent>
        </Dialog>
    );
};

export default Form;