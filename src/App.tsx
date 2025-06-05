import './styles/theme.css';
import './index.css';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@mui/material'
import { returnTheme } from './styles/palette';
import { Route, Routes } from 'react-router';
import HomePage from './pages/Home';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import { ToastContainer } from 'react-toastify';
import { useThemeMode } from './hooks/useThemeMode';

const App = () => {
  const {themeMode, toggleTheme} = useThemeMode();
  return (
    <ThemeProvider theme={returnTheme(themeMode)}>
      <BrowserRouter>
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
        <Routes>
          <Route path="/" element={<HomePage themeMode={themeMode} toggleTheme={toggleTheme}/>}/>
          <Route path="/login" element={<AuthLogin />}/>
          <Route path="/register" element={<AuthRegister />}/>
          {/* <Route path="*" element={}/> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;