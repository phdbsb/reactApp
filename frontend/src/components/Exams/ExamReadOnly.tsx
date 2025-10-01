import styles from "./style.module.css";

interface OtherExamCardProps {
  exam: { id: string; title: string };
}

const OtherExamCard = ({ exam }: OtherExamCardProps) => (
  <div className={styles["exam-card"]}>
    <h3 className={styles["exam-title"]}>{exam.title}</h3>
  </div>
);

export default OtherExamCard;