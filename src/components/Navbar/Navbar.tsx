import { useLocation, useNavigate } from "react-router";
import AccountMenu from "./AccountMenu";
import LanguageToggle from "./LanguageToggle";
import styles from "./style.module.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

interface themeProps {
  themeMode: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ themeMode, toggleTheme }: themeProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenOnRoutes = ["/login", "/register", "/unauthorized"];
  if (hiddenOnRoutes.includes(location.pathname)) {
    return null;
  }

  const showBackButton = location.pathname === "/admin-dashboard";

  return (
    <nav className={styles["navbar-container"]}>
      <div className={styles["left-side"]}>
        {showBackButton && (
          <div className={styles["backButton"]} onClick={() => navigate("/")}>
            <KeyboardBackspaceIcon fontSize="large" />
          </div>
        )}
      </div>
      <div className={styles["right-side"]}>
        <LanguageToggle />
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
