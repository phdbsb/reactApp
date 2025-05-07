import { IDeadline } from "@/api/endpoints/deadlines/types";
import { format } from "date-fns";

interface TermSelectionProps {
    deadlines: IDeadline[];
    selectedTerm: string;
    onSelectTerm: (term: string) => void;
}

const TermSelection = ({ deadlines, selectedTerm, onSelectTerm }: TermSelectionProps) => {
    const currentDate = new Date();

    return (
        <div>
            <strong>Choose a deadline: </strong>
            <div className="term-options">
                {deadlines.map((deadline) => {
                    const termDate = new Date(deadline.examDate);
                    const isPast = termDate < currentDate;
                    return (
                        <div key={deadline.id} className="term-option">
                            <label className="term-label">
                                <input
                                    type="checkbox"
                                    value={deadline.id}
                                    checked={selectedTerm === deadline.id}
                                    disabled={isPast}
                                    onChange={() => onSelectTerm(deadline.id)}
                                />
                                <span className={`term-text ${isPast ? "disabled-text" : ""}`}>
                                    {deadline.name}: {format(termDate, 'dd.MM.yyyy')}
                                </span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TermSelection;
