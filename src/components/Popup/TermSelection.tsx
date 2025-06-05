import { IDeadline } from "@/api/endpoints/deadlines/types";
import { format } from "date-fns";
import styles from "./style.module.css";

interface TermSelectionProps {
  deadlines: IDeadline[];
  selectedTerm: string;
  onSelectTerm: (term: string) => void;
}

const TermSelection = ({
  deadlines,
  selectedTerm,
  onSelectTerm,
}: TermSelectionProps) => {
  const currentDate = new Date();

  return (
    <div>
      <strong>Choose a deadline: </strong>
      <div className={styles["term-options"]}>
        {deadlines.map((deadline) => (
          <div key={deadline.id} className={styles["term-option"]}>
            <label className={styles["term-label"]}>
              <input
                type="checkbox"
                value={deadline.id}
                checked={selectedTerm === deadline.id}
                disabled={new Date(deadline.examDate) < currentDate}
                onChange={() => onSelectTerm(deadline.id)}
              />
              <span
                className={`${styles["term-text"]} ${
                  new Date(deadline.examDate) < currentDate 
                    ? styles["disabled-text"] 
                    : ""
                }`}
              >
                {deadline.name}: {format(new Date(deadline.examDate), "dd.MM.yyyy")}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermSelection;