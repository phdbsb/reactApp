import { useEffect, useState } from "react";
import Exam from "./Exam";
import { Form } from "../Form";
import { fetchExams } from "../../store/thunks/examsThunks";
import { RootState, AppDispatch } from '../../store';
import { ExamCard } from "../../models/ExamCard";
import { parseISO, formatDistanceToNow } from 'date-fns';
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import useSaveExam from "../../hooks/useSaveExam";
import Popup from "../Popup/Popup";


const Exams = () => {
    const exams = useSelector((state: RootState) => state.exams.exams);
    const dispatch = useDispatch<AppDispatch>();

    const [formState, setFormState] = useState ({
        isEditMode: false,
        examToEditId: null as string | null,
        showForm: false
    });

    const [selectedExam, setSelectedExam] = useState<ExamCard | null>(null);
    const [selectedTerms, setSelectedTerms] = useState<Record<string, string>>({});

    const { saveExam } = useSaveExam();

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

    const onReportClick = (exam: ExamCard) => {
        setSelectedExam(exam);
    }

    const onPassClick = (exam: ExamCard) => {
        const updatedExam = { ...exam, isPassed: !exam.isPassed };
        //dispatch(saveExam(updatedExam, formState));
    };

    const onCreateClick = () => {
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: true,
        });
    };
    
    const handleSave = async (exam: ExamCard) => {
        await saveExam(exam, formState);
        
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: false,
        });
    };

    const handlePopupSave = (term: string) => {
        if (selectedExam) {
            setSelectedTerms((prev) => ({
                ...prev,
                [selectedExam.id]: term,
            }));
            setSelectedExam(null);
        }
    };

    const examToEdit = formState.examToEditId ? exams.find((exam) => exam.id === formState.examToEditId) : undefined;

    const calculateTimeLeft = (exam: ExamCard) => {
        const selectedTerm = selectedTerms[exam.id];
        if (!selectedTerm) {
            return null;
        }
        const examDate = parseISO(exam.schedule[selectedTerm]);
        if (isNaN(examDate.getTime())) {
            return "Invalid date";
        }
        return formatDistanceToNow(examDate, { addSuffix: true });
    };


    return (
        <>
            <div className="exams-container">
                {exams.map((exam, index) => (
                    <Exam key={`${exam.id}-${index}`} exam={exam} onDoubleClick={onExamDoubleClick} onReportClick={onReportClick} onPassClick={onPassClick} timeLeft={calculateTimeLeft(exam)}/>
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
            {selectedExam && (
                <Popup 
                    exam={selectedExam}
                    onSave={handlePopupSave}
                    onClose={() => setSelectedExam(null)}
                />
            )}
        </>
    );
};

export default Exams;