import React, { useState } from "react";
import Exam from "./Exam";
import { Form } from "../Form";
import { ExamCard } from "../../models/ExamCard";
import FormManager from "../Form/FormManager";
import "./style.css";

const examData: ExamCard[] = [
    new ExamCard(1, "Operating systems", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(2, "Computer Network", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(3, "Web programming", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(4, "Software engineering", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(5, "Database systems", "Faculty of Electronics", "Starts in 2h")
];

const Exams = () => {
    const [exams, setExams] = useState<ExamCard[]>(examData);
    const [isEditMode, setIsEditMode] = useState(false);
    const [examToEdit, setExamToEdit] = useState<ExamCard | null>(null);
    const [showForm, setShowForm] = useState(false);

    const onExamDoubleClick = (exam: ExamCard) => {
        setIsEditMode(true);
        setExamToEdit(exam);
        setShowForm(true);
    };

    const onCreateClick = () => {
        setIsEditMode(false);
        setExamToEdit(null);
        setShowForm(true);
    };

    const handleSave = (exam: ExamCard) => {
        if (isEditMode && examToEdit) {
            console.log("Editing exam: ", exam);
            setExams((prevExams) => {
                console.log("Previous exams (before edit):", prevExams);
                const updatedExams = prevExams.map((e) => e.id === examToEdit.id ? { ...exam } : e);
                console.log("Updated exams (edit): ", updatedExams);
                return updatedExams;
            });
        } else {
            console.log("Creating new exam: ", exam);
            setExams((prevExams) => {
                console.log("Previous exams (before create):", prevExams);
                const newExams = [...prevExams, exam];
                console.log("Updated exams (create):", newExams);
                return newExams;
            });
        }
        setShowForm(false);
        setExamToEdit(null);
        setIsEditMode(false);
    };

    return (
        <>
            <div className="exams-container">
                {exams.map((exam) => (
                    <Exam key={exam.id} exam={exam} onDoubleClick={onExamDoubleClick} />
                ))}
            </div>
            <div className="create-button-container">
                <button className="create-button" onClick={onCreateClick}> Create Exam </button>
            </div>
            {showForm && (
                <div className="form-container">
                    <Form
                        isEditMode={isEditMode}
                        examToEdit={examToEdit || undefined}
                        onSave={handleSave}
                    />
                </div>
            )}
        </>
    );
};

export default Exams;