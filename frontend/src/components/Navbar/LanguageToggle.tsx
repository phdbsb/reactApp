import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./style.module.css";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  const toggleLang = () => {
    const newLang = language === "en" ? "sr" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  return (
    <div className={styles.switch}>
      <input
        id="language-toggle"
        type="checkbox"
        className={styles.toggleCheckbox}
        checked={language === "sr"}
        onChange={toggleLang}
      />
      <label htmlFor="language-toggle" className={styles.toggleLabel}></label>
      <span
        className={`${styles.on} ${language === "en" ? styles.active : ""}`}
      >
        EN
      </span>
      <span
        className={`${styles.off} ${language === "sr" ? styles.active : ""}`}
      >
        SR
      </span>
    </div>
  );
};

export default LanguageToggle;
