import { useState } from "react";
import TermSelection from "./TermSelection";
import styles from "./style.module.css";
import { ExamCard } from "@/api/endpoints/exams/types";
import { useGetDeadlinesQuery } from "@/api/endpoints/deadlines";

interface PopupProps {
  exam: ExamCard;
  onClose: () => void;
  onSave: (selectedTerm: string) => void;
}

const Popup = ({ exam, onClose, onSave }: PopupProps) => {
  const { data: deadlines } = useGetDeadlinesQuery(exam.id);
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  const handleSave = () => {
    if (!selectedTerm) {
      alert("Select a deadline before saving");
      return;
    }
    onSave(selectedTerm);
    onClose();
  };

  return (
    <div className={styles["popup-overlay"]} onClick={onClose}>
      <div
        className={styles["popup-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles["popup-header"]}>
          <h2>{exam.title}</h2>
          <button className={styles["close-button"]} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles["popup-body"]}>
          <TermSelection
            deadlines={deadlines || []}
            selectedTerm={selectedTerm}
            onSelectTerm={setSelectedTerm}
          />
        </div>

        <div className={styles["popup-footer"]}>
          <button className={styles["save-button"]} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
