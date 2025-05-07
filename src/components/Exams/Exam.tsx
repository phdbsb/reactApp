import { getCurrentSemester } from '@/utils/getCurrentSemester';
import './style.css';
import { ExamCard, IGetExams } from '@/api/endpoints/exams/types';
import { useGetPassedStatusQuery, useUpdatePassedStatusMutation } from '@/api/endpoints/registrations';

interface ExamCardProps {
    exam: IGetExams;
    timeLeft: string | null;
    onDoubleClick: (exam: ExamCard) => void;
    onReportClick: (exam: ExamCard) => void;
};

const Exam = ({ exam, onDoubleClick, onReportClick, timeLeft }: ExamCardProps) => {

    const [updatePassedStatus] = useUpdatePassedStatusMutation();
 
    const currentSemester = getCurrentSemester();
    const canReport = currentSemester === 2 || (currentSemester === 1 && exam.semester === 1);

    const {data: passedStatus} = useGetPassedStatusQuery(
        {studentId: "920dae77-9480-41c8-8cec-b2fe902d835f", examId: exam.id},
    );

    const onPassClick = async (exam: ExamCard) => {

        try {
            await updatePassedStatus({
                studentId: "920dae77-9480-41c8-8cec-b2fe902d835f",
                examId: exam.id,
                passed: !passedStatus
            });
        }
        catch(error) {
            console.error("Error updating passed status", error);
        }
    };

    return (
        <div className={`exam-card ${passedStatus ? 'passed' : ''}`}  onDoubleClick={() => onDoubleClick(exam)} title="Double-click to edit">
            <div className="exam-header">
                <h3 className="exam-title">{exam.title}</h3>
                <button
                    className="apply-button"
                    disabled={!canReport || (exam.isRegistered && (!!timeLeft || !!passedStatus))}
                    onClick={() => onReportClick(exam) }
                >
                    Report exam
                </button>
            </div>
            <div className="exam-footer">
                <span className="exam-faculty">Faculty of Electronics</span>
                {exam.isRegistered && (
                    <>
                        {timeLeft !== '' ? (
                            <span className="exam-time">
                                { timeLeft ? `Starts ${timeLeft}` : "No start time" }
                            </span>
                        ) : (
                            <span className="pass-button" onClick={() => onPassClick(exam)}>
                                { passedStatus ? "Didn't passed" : "Passed" }
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Exam;