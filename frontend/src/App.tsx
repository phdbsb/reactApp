import "./styles/theme.css";
import "./index.css";
import { BrowserRouter, useLocation } from "react-router";
import { ThemeProvider } from "@mui/material";
import { returnTheme } from "./styles/palette";
import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import AuthLogin from "./pages/AuthLogin";
import AuthRegister from "./pages/AuthRegister";
import { ToastContainer } from "react-toastify";
import { useThemeMode } from "./hooks/useThemeMode";
import { AuthInitializer } from "./AuthInitializer";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { Navbar } from "./components/Navbar";
import RequireAdmin from "./components/Guards/RequireAdmin";
import Unauthorized from "./components/AccessControl/Unauthorized";
import ProfileSettings from "./components/Profile/ProfileSettings";

const App = () => {
  const { themeMode, toggleTheme } = useThemeMode();

  return (
    <ThemeProvider theme={returnTheme(themeMode)}>
      <BrowserRouter>
        <AuthInitializer />
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={themeMode}
        />
        <Navbar themeMode={themeMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage themeMode={themeMode} toggleTheme={toggleTheme} />
            }
          />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route
            path="/admin-dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="*" element={}/> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
