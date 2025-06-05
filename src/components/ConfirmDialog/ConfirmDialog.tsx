import styles from "@/components/Popup/style.module.css";

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <div className={styles["popup-overlay"]}>
      <div className={styles["popup-content"]}>
        <div className={styles["popup-header"]}>
          <h2>Delete exam</h2>
        </div>
        <div className={styles["popup-body2"]}>
          <p>Are you sure you want to delete this exam?</p>
        </div>
        <div className={styles["popup-footer"]}>
          <button className={styles["cancel-button"]} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles["save-button"]} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
