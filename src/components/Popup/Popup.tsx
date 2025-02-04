import { useState } from "react";
import { ExamCard } from "models/ExamCard";
import { format } from "date-fns";

import './style.css';

interface PopupProps {
    exam: ExamCard;
    onClose: () => void;
    onSave: (selectedTerm: string) => void;
}

const Popup = ({exam, onClose, onSave }: PopupProps) => {

    const deadlines = Object.keys(exam.schedule);
    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const currentDate = new Date();

    const handleCheckboxChange = (term: string) => {
        setSelectedTerm(term);
    };

    const handleSave = () => {
        if (selectedTerm) {
            onSave(selectedTerm);
            onClose();
        } else {
            alert("Please select a deadline before saving.");
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>{exam.title}</h2>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="popup-body">
                    <div>
                        <strong>Choose a deadline: </strong>
                        <div className="term-options">
                            {deadlines.map((deadline, index) => {
                                const termDate = new Date(exam.schedule[deadline]);
                                const isPast = termDate < currentDate;
                                return (
                                    <div key={index} className="term-option">
                                        <label className="term-label">
                                            <input
                                                type="checkbox"
                                                value={deadline}
                                                checked={selectedTerm === deadline}
                                                disabled={isPast}
                                                onChange={() => handleCheckboxChange(deadline)}
                                            />
                                            <span
                                                className={`term-text ${isPast ? "disabled-text" : ""}`}
                                            >
                                                {deadline}: {format(termDate, 'dd.MM.yyyy')}
                                            </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="popup-footer">
                    <button className="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Popup;