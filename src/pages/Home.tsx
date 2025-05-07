import { Navbar } from "@/components/Navbar"
import Exams from "@/components/Exams/Exams";
import { useState } from "react";
import { returnTheme } from "@/styles/palette";
import { ThemeProvider } from "@mui/material";

interface HomeProps {
    themeMode: string;
    setThemeMode: React.Dispatch<React.SetStateAction<string>>;
}

const HomePage = ({ themeMode, setThemeMode } : HomeProps) => {
    return (
        <>
            <Navbar themeMode={themeMode} setThemeMode={setThemeMode}/>
            <Exams />
        </>     
    );
}

export default HomePage;