import './styles/theme.css';
import './index.css';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@mui/material'
import { returnTheme } from './styles/palette';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import HomePage from './pages/Home';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';

const App = () => {
  const [themeMode, setThemeMode] = useState("light");
  return (
    <ThemeProvider theme={returnTheme(themeMode)}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage themeMode={themeMode} setThemeMode={setThemeMode}/>}/>
          <Route path="/login" element={<AuthLogin />}/>
          <Route path="/register" element={<AuthRegister />}/>
          {/* <Route path="*" element={}/> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;