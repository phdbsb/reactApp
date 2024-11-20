import React from 'react';
import './style.css'

interface ExamCardProps {
    title: string;
    facultyName: string;
    timeLeft: string;
};

const Exam = ({ title, facultyName, timeLeft}: ExamCardProps) => {
    return(
        <div className="exam-card">
            <div className="exam-header">
                <h3 className="exam-title">{title}</h3>
                <button className="apply-button">Report exam</button>
            </div>
            <div className="exam-footer">
                <span className="exam-faculty">{facultyName}</span>
                <span className="exam-time">{timeLeft}</span>
            </div>
        </div>
    );
};

export default Exam;