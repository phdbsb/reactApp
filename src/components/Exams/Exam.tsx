import { getCurrentSemester } from "@/utils/getCurrentSemester";
import styles from "./style.module.css";
import { ExamCard, IGetExams } from "@/api/endpoints/exams/types";
import {
  useGetPassedStatusQuery,
  useUpdatePassedStatusMutation,
} from "@/api/endpoints/registrations";
import { useState } from "react";
import { TbEditCircle } from "react-icons/tb";
import ContextMenu from "../ContextMenu/ContextMenu";

interface ExamCardProps {
  exam: IGetExams;
  timeLeft: string | null;
  onEditClick: (exam: ExamCard) => void;
  onDeleteClick: (exam: ExamCard) => void;
  onReportClick: (exam: ExamCard) => void;
}

const Exam = ({
  exam,
  // selectedDeadlineId,
  onEditClick,
  onDeleteClick,
  onReportClick,
  timeLeft,
}: ExamCardProps) => {
  const [updatePassedStatus] = useUpdatePassedStatusMutation();
  const [showMenu, setShowMenu] = useState(false);

  const currentSemester = getCurrentSemester();
  const canReport =
    currentSemester === 2 || (currentSemester === 1 && exam.semester === 1);

  const { data: passedStatus } = useGetPassedStatusQuery({ examId: exam.id });

  const onPassClick = async (exam: ExamCard) => {
    try {
      await updatePassedStatus({
        examId: exam.id,
        passed: !passedStatus,
      });
    } catch (error) {
      console.error("Error updating passed status", error);
    }
  };

  return (
    <div
      className={`${styles["exam-card"]} ${
        passedStatus ? styles["passed"] : ""
      }`}
    >
      <div
        className={`${styles["icon-wrapper"]} ${
          showMenu ? styles["icon-visible"] : ""
        }`}
      >
        <TbEditCircle
          className={styles["edit-icon"]}
          onClick={(e) => {
            setShowMenu(!showMenu);
            e.stopPropagation();
          }}
        />
        {showMenu && (
          <ContextMenu
            onEdit={() => onEditClick(exam)}
            onDelete={() => onDeleteClick(exam)}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
      <div className={styles["exam-header"]}>
        <h3 className={styles["exam-title"]}>{exam.title}</h3>
        <button
          className={styles["apply-button"]}
          disabled={
            !canReport || (exam.isRegistered && (!!timeLeft || !!passedStatus))
          }
          onClick={() => onReportClick(exam)}
        >
          Report exam
        </button>
      </div>
      <div className={styles["exam-footer"]}>
        <span className={styles["exam-faculty"]}>Faculty of Electronics</span>
        {exam.isRegistered && (
          <>
            {timeLeft !== "" ? (
              <span className={styles["exam-time"]}>
                {timeLeft ? `Starts ${timeLeft}` : "No start time"}
              </span>
            ) : (
              <span
                className={styles["pass-button"]}
                onClick={() => onPassClick(exam)}
              >
                {passedStatus ? "Didn't passed" : "Passed"}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Exam;
