import { ExamCard } from '../../models/ExamCard';
import { getCurrentSemester } from '../../utils/getCurrentSemester';
import './style.css';

interface ExamCardProps {
    exam: ExamCard;
    timeLeft: string | null;
    onDoubleClick: (exam: ExamCard) => void;
    onReportClick: (exam: ExamCard) => void;
    onPassClick: (exam: ExamCard) => void;
};

const Exam = ({ exam, onDoubleClick, onReportClick, timeLeft, onPassClick  }: ExamCardProps) => {

    const currentSemester = getCurrentSemester();
    const canReport = currentSemester === 2 || (currentSemester === 1 && exam.semester === 1);

    return (
        <div className={`exam-card ${exam.isPassed ? 'passed' : ''}`}  onDoubleClick={() => onDoubleClick(exam)} title="Double-click to edit">
            <div className="exam-header">
                <h3 className="exam-title">{exam.title}</h3>
                <button 
                    className="apply-button" 
                    disabled={!canReport || exam.isPassed} 
                    onClick={() => { onReportClick(exam) }}
                >
                    Report exam
                </button>
            </div>
            <div className="exam-footer">
                <span className="exam-faculty">{exam.faculty}</span>
                <span className="exam-time">
                    {timeLeft ? `${timeLeft}` : ""}
                </span>
                {exam.isPassed ? (
                    <button className="pass-button" onClick={() => onPassClick(exam)}>
                        Nije polozio
                    </button>
                ) : (
                    <button className="pass-button" onClick={() => onPassClick(exam)}>
                        Polozio
                    </button>
                )}
            </div>
        </div>
    );
};

export default Exam;