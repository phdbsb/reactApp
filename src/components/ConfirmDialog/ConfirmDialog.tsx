import styles from "@/components/Popup/style.module.css";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles["popup-overlay"]}>
      <div className={styles["popup-content"]}>
        <div className={styles["popup-header"]}>
          <h2>{t("dialog.deleteTitle")}</h2>
        </div>
        <div className={styles["popup-body2"]}>
          <p>{t("dialog.deleteMessage")}</p>
        </div>
        <div className={styles["popup-footer"]}>
          <button className={styles["cancel-button"]} onClick={onCancel}>
            {t("dialog.cancel")}
          </button>
          <button className={styles["save-button"]} onClick={onConfirm}>
            {t("dialog.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
