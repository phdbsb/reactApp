import { useEffect, useState } from "react"; 
import Exam from "./Exam";
import { Form } from "../Form";
import { parseISO, formatDistanceToNow, isPast } from 'date-fns';
import "./style.css";
import Popup from "../Popup/Popup";
import { useMemo } from "react";
import { ExamCard } from "@/api/endpoints/exams/types";
import { useAddExamMutation, useGetExamsQuery, useUpdateExamMutation } from "@/api/endpoints/exams";
import { useRegisterExamMutation } from "@/api/endpoints/registrations";


const Exams = () => {
    const { data: exams } = useGetExamsQuery();
    const [addExam] = useAddExamMutation();
    const [updateExam] = useUpdateExamMutation();
    const [registerExam] = useRegisterExamMutation();


    const [formState, setFormState] = useState ({
        isEditMode: false,
        examToEditId: null as string | null,
        showForm: false
    });

    const [selectedExam, setSelectedExam] = useState<ExamCard | null>(null);
    const [selectedTerms, setSelectedTerms] = useState<Record<string, string>>({});
    const [timeLeftMap, setTimeLeftMap] = useState<Record<string, string>>({});   
    
    
    useEffect(() => {
        const updateTimes = () => {
            const updatedTimeLeftMap: Record<string, string> = {};

            exams?.forEach((exam) => {
                if(exam.term) {
                    const examDate = parseISO(exam.term);
                    const isExpired = isPast(examDate);
                    if(!isExpired) {
                        const timeLeft = formatDistanceToNow(parseISO(exam.term), { includeSeconds: true, addSuffix: true });
                        updatedTimeLeftMap[exam.id] = timeLeft;
                    }
                }
            });

            setTimeLeftMap(updatedTimeLeftMap);
        };

        updateTimes();
        const interval = setInterval(updateTimes, 60000);

        return () => clearInterval(interval);
    }, [exams, selectedTerms]);
    
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

    const onCreateClick = () => {
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: true,
        });
    };
    
    const handleSave = async (exam: ExamCard) => {
        
        if (formState.isEditMode && formState.examToEditId) {
            const updatedExam: ExamCard = { id: exam.id, title: exam.title, semester: exam.semester, schedule: exam.schedule }
            await updateExam(updatedExam);
        } else {
            await addExam(exam);
        }
        
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: false,
        });
    };

    const handleCloseForm = () => {
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: false,
        });
    };

    const handlePopupSave = async (term: string) => {
        if (selectedExam) {
            setSelectedTerms((prev) => ({
                ...prev,
                [selectedExam.id]: term,
            }));

            try {
                await registerExam({
                    studentId: "920dae77-9480-41c8-8cec-b2fe902d835f",
                    examId: selectedExam.id,
                    deadlineId: term,
                }).unwrap();

            } catch (error) {
                console.error("Error when registering for the exam", error);
            }
            setSelectedExam(null);
        }
    };

    const examToEdit = useMemo(() => {
        return formState.examToEditId ? exams?.find((exam) => exam.id === formState.examToEditId) : undefined;
    }, [formState.examToEditId, exams]);

    return (
        <>
            <div className="exam-container">
                <div className="exams-wrapper">
                    <div className="nav-exams">
                        <h1 className="exams-title">My Exams</h1>
                        <button className="create-button" onClick={onCreateClick}> <img src="images/add.svg" width="22px" alt="" /> Create </button>
                    </div>
                    <div className="exams-container">
                        {exams?.map((exam, index) => (
                            <Exam 
                                key={`${exam.id}-${index}`} 
                                exam={exam} 
                                onDoubleClick={onExamDoubleClick} 
                                onReportClick={onReportClick} 
                                timeLeft={timeLeftMap[exam.id] || ""}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {formState.showForm && (
                <div className="form-container">
                    <Form
                        isEditMode={formState.isEditMode}
                        examToEdit={examToEdit}
                        onSave={handleSave}
                        onClose={handleCloseForm}
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