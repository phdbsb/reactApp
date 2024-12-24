import { useEffect, useState } from "react";
import Exam from "./Exam";
import { Form } from "../Form";
import { addExam, fetchExams, updateExam } from "../../store/thunks/examsThunks";
import { RootState, AppDispatch } from '../../store';
import { ExamCard } from "../../models/ExamCard";
import { parseISO, formatDistanceToNow } from 'date-fns';
import "./style.css";
import { useDispatch, useSelector } from "react-redux";


const Exams = () => {
    const exams = useSelector((state: RootState) => state.exams.exams);
    const dispatch = useDispatch<AppDispatch>();

    const [formState, setFormState] = useState ({
        isEditMode: false,
        examToEditId: null as number | null,
        showForm: false
    });

    useEffect(() => {
        dispatch(fetchExams());
    }, [dispatch]);

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

    const handleSave = async (exam: ExamCard) => {
        const examObject = {
            id: exam.id,
            title: exam.title,
            faculty: exam.faculty,
            startsIn: exam.startsIn,
        };

        if (formState.isEditMode && formState.examToEditId !== null) {
            await dispatch(updateExam(examObject)); 
        } else {
            await dispatch(addExam(examObject));
        }
        
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: false,
        });
    };

    const examToEdit = formState.examToEditId ? exams.find((exam) => exam.id === formState.examToEditId) : undefined;

    const calculateTimeLeft = (exam: ExamCard) => {
        const examDate = parseISO(exam.startsIn);
        if (isNaN(examDate.getTime())) {
            return "Invalid date";
        }
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