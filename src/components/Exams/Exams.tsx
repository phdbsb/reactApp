import React from "react";
import Exam from "./Exam";
import { ExamCard } from "../../models/ExamCard";
import "./style.css";

const examData: ExamCard[] = [
    new ExamCard(1, "Operating systems", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(2, "Computer Network", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(3, "Web programming", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(4, "Software engineering", "Faculty of Electronics", "Starts in 2h"),
    new ExamCard(5, "Database systems", "Faculty of Electronics", "Starts in 2h")
];

const Exams = () => {
    return (
        <div className="exams-container">
            {examData.map((exam) => (
                <Exam
                    key={exam.id}
                    title={exam.title}
                    facultyName={exam.faculty}
                    timeLeft={exam.startsIn}
                />
            ))}
        </div>
    );
}

export default Exams;