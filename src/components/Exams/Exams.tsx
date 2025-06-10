import { useEffect, useState } from "react";
import Exam from "./Exam";
import { Form } from "../Form";
import { parseISO, formatDistanceToNow, isPast } from "date-fns";
import styles from "./style.module.css";
import Popup from "../Popup/Popup";
import { useMemo } from "react";
import { ExamCard, IGetExams } from "@/api/endpoints/exams/types";
import {
  useAddExamMutation,
  useArchiveExamMutation,
  useGetExamsQuery,
  useUpdateExamMutation,
} from "@/api/endpoints/exams";
import {
  useGetPassedExamsQuery,
  useRegisterExamMutation,
} from "@/api/endpoints/registrations";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

const Exams = () => {
  const { data: exams } = useGetExamsQuery();
  const { data: passedExams } = useGetPassedExamsQuery();
  const [addExam] = useAddExamMutation();
  const [updateExam] = useUpdateExamMutation();
  const [registerExam] = useRegisterExamMutation();
  const [archiveExam] = useArchiveExamMutation();
  const { t } = useTranslation();

  const [formState, setFormState] = useState({
    isEditMode: false,
    examToEditId: null as string | null,
    showForm: false,
  });

  const [selectedExam, setSelectedExam] = useState<ExamCard | null>(null);
  const [timeLeftMap, setTimeLeftMap] = useState<Record<string, string>>({});

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [examToArchive, setExamToArchive] = useState<ExamCard | null>(null);

  useEffect(() => {
    const updateTimes = () => {
      const updatedTimeLeftMap: Record<string, string> = {};

      exams?.forEach((exam) => {
        if (exam.term) {
          const examDate = parseISO(exam.term);
          const isExpired = isPast(examDate);
          if (!isExpired) {
            const timeLeft = formatDistanceToNow(parseISO(exam.term), {
              includeSeconds: true,
              addSuffix: true,
            });

            let shortenedTimeLeft = timeLeft
              .replace(/ seconds?/, " sec")
              .replace(/ minute[s]?/, " min");

            updatedTimeLeftMap[exam.id] = shortenedTimeLeft;
          }
        }
      });

      setTimeLeftMap(updatedTimeLeftMap);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);

    return () => clearInterval(interval);
  }, [exams]);

  const onEditClick = (exam: ExamCard) => {
    setFormState({
      isEditMode: true,
      examToEditId: exam.id,
      showForm: true,
    });
  };

  const onReportClick = (exam: ExamCard) => {
    setSelectedExam(exam);
  };

  const onCreateClick = () => {
    setFormState({
      isEditMode: false,
      examToEditId: null,
      showForm: true,
    });
  };

  const handleSave = async (exam: ExamCard) => {
    if (formState.isEditMode && formState.examToEditId) {
      const updatedExam: ExamCard = {
        id: exam.id,
        title: exam.title,
        semester: exam.semester,
        schedule: exam.schedule,
      };
      await updateExam(updatedExam);
    } else {
      await addExam(exam);
    }

    setFormState({
      isEditMode: false,
      examToEditId: null,
      showForm: false,
    });
  };

  const handleCloseForm = () => {
    setFormState({
      isEditMode: false,
      examToEditId: null,
      showForm: false,
    });
  };

  const handlePopupSave = async (term: string) => {
    if (selectedExam) {
      try {
        await registerExam({
          examId: selectedExam.id,
          deadlineId: term,
        }).unwrap();
      } catch (error) {
        console.error("Error when registering for the exam", error);
      }
      setSelectedExam(null);
    }
  };

  const examToEdit = useMemo(() => {
    return formState.examToEditId
      ? exams?.find((exam) => exam.id === formState.examToEditId)
      : undefined;
  }, [formState.examToEditId, exams]);

  const onDeleteClick = (exam: ExamCard) => {
    setExamToArchive(exam);
    setShowConfirmDialog(true);
  };

  const confirmArchive = async () => {
    if (examToArchive) {
      await archiveExam({ id: examToArchive.id });
      setShowConfirmDialog(false);
    }
  };

  const cancelArchive = () => {
    setShowConfirmDialog(false);
  };

  const mappedPassedExams = passedExams
    ?.filter((pe) => pe.passed)
    .map((pe) => {
      const fullExam = exams?.find((exam) => exam.id === pe.examId);
      return fullExam ? { ...fullExam } : null;
    })
    .filter((exam): exam is IGetExams => exam !== null);

  const notPassedExams = exams?.filter(
    (exam) => !passedExams?.some((pe) => pe.examId === exam.id && pe.passed)
  );

  return (
    <>
      <div className={styles["exam-container"]}>
        <div className={styles["exams-wrapper"]}>
          <div className={styles["nav-exams"]}>
            <h1 className={styles["exams-title"]}>{t("exam.title")}</h1>
            <button className={styles["create-button"]} onClick={onCreateClick}>
              {" "}
              <img src="assets/add.svg" width="22px" alt="" />
              {t("exam.create")}{" "}
            </button>
          </div>
          <div className={styles["exams-container"]}>
            {notPassedExams?.map((exam, index) => (
              <Exam
                key={`${exam.id}-${index}`}
                exam={exam}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onReportClick={onReportClick}
                timeLeft={timeLeftMap[exam.id] || ""}
              />
            ))}
          </div>
          <h2 className={styles["passed-title"]}>
            {(mappedPassedExams?.length ?? 0) > 0
              ? t("exam.passedExams")
              : t("exam.noPassedExams")}
          </h2>
          <div className={styles["passed-exams-container"]}>
            {mappedPassedExams?.map((exam, index) => (
              <Exam
                key={`${exam.id}-${index}`}
                exam={exam}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onReportClick={onReportClick}
                timeLeft={timeLeftMap[exam.id] || ""}
              />
            ))}
          </div>
        </div>
      </div>
      {formState.showForm && (
        <div className={styles["form-container"]}>
          <Form
            isEditMode={formState.isEditMode}
            examToEdit={examToEdit}
            onSave={handleSave}
            onClose={handleCloseForm}
          />
        </div>
      )}
      {selectedExam && (
        <Popup
          exam={selectedExam}
          onSave={handlePopupSave}
          onClose={() => setSelectedExam(null)}
        />
      )}
      {showConfirmDialog && (
        <ConfirmDialog onConfirm={confirmArchive} onCancel={cancelArchive} />
      )}
    </>
  );
};

export default Exams;
