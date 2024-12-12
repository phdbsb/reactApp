import { useState } from "react";
import Exam from "./Exam";
import { Form } from "../Form";
import { ExamCard } from "../../models/ExamCard";
import { parseISO, formatDistanceToNow } from 'date-fns';
import "./style.css";

const examData: ExamCard[] = [
    new ExamCard(1, "Operating systems", "Faculty of Electronics", '2024-12-10T09:00:00'),
    new ExamCard(2, "Computer Network", "Faculty of Electronics", '2024-12-11T14:00:00'),
    new ExamCard(3, "Web programming", "Faculty of Electronics", '2024-12-15T08:00:00'),
    new ExamCard(4, "Software engineering", "Faculty of Electronics", '2024-12-18T12:00:00'),
    new ExamCard(5, "Database systems", "Faculty of Electronics", '2024-12-20T10:00:00')
];

const Exams = () => {
    const [exams, setExams] = useState<ExamCard[]>(examData);

    const [formState, setFormState] = useState ({
        isEditMode: false,
        examToEditId: null as number | null,
        showForm: false
    });

    const onExamDoubleClick = (exam: ExamCard) => {
        setFormState({
            isEditMode: true,
            examToEditId: exam.id,
            showForm: true
        });
    };

    const onCreateClick = () => {
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: true,
        });
    };

    const handleSave = (exam: ExamCard) => {
        setExams((prevExams) =>
            formState.isEditMode && formState.examToEditId !== null ? 
                prevExams.map((e) => (e.id === formState.examToEditId ? { ...exam } : e)) : [...prevExams, exam]
        );
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: false,
        });
    };

    const examToEdit = formState.examToEditId ? exams.find((exam) => exam.id === formState.examToEditId) : undefined;

    const calculateTimeLeft = (exam: ExamCard) => {
        const examDate = parseISO(exam.startsIn);
        return formatDistanceToNow(examDate, { addSuffix: true });
    };
    
    return (
        <>
            <div className="exams-container">
                {exams.map((exam) => (
                    <Exam key={exam.id} exam={exam} onDoubleClick={onExamDoubleClick} timeLeft={calculateTimeLeft(exam)}/>
                ))}
            </div>
            <div className="create-button-container">
                <button className="create-button" onClick={onCreateClick}> Create Exam </button>
            </div>
            {formState.showForm && (
                <div className="form-container">
                    <Form
                        isEditMode={formState.isEditMode}
                        examToEdit={examToEdit}
                        onSave={handleSave}
                    />
                </div>
            )}
        </>
    );
};

export default Exams;