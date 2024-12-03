import React from 'react';
import { ExamCard } from '../../models/ExamCard';
import './style.css'

interface ExamCardProps {
    exam: ExamCard;
    onDoubleClick: (exam: ExamCard) => void;
};

const Exam = ({ exam, onDoubleClick }: ExamCardProps) => {
    return (
        <div className="exam-card" onDoubleClick={() => onDoubleClick(exam)} title="Double-click to edit">
            <div className="exam-header">
                <h3 className="exam-title">{exam.title}</h3>
                <button className="apply-button">Report exam</button>
            </div>
            <div className="exam-footer">
                <span className="exam-faculty">{exam.faculty}</span>
                <span className="exam-time">{exam.startsIn}</span>
            </div>
        </div>
    );
};

export default Exam;