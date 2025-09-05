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

  // TODO nista spec samo promenjive bi trebao uvek na vrhu fajla da definises, ovako nesto, da se ne upetljavas kasnije
  const hiddenOnRoutes = ["/login", "/register", "/unauthorized"];
  const routesWithBackButton = ["/admin-dashboard", "/profile"];
  
  if (hiddenOnRoutes.includes(location.pathname)) {
    return null;
  }

  const showBackButton = routesWithBackButton.includes(location.pathname);

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
