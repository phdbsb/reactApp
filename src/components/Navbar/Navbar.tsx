import AccountMenu from "./AccountMenu";
import styles from "./style.module.css";

interface themeProps {
  themeMode: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ themeMode, toggleTheme }: themeProps) => {
  return (
    <nav className={styles["navbar-container"]}>
      <div className={styles["icons-container"]}>
        <div className={styles["theme-icon"]}>
          <img
            src={themeMode === "light" ? "/assets/Moon.svg" : "/assets/Sun.svg"}
            alt="Toggle theme"
            onClick={toggleTheme}
            style={{ cursor: "pointer" }}
          />
        </div>
          <AccountMenu />
      </div>
    </nav>
  );
};

export default Navbar;
