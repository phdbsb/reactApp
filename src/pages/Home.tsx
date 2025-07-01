import { Navbar } from "@/components/Navbar"
import Exams from "@/components/Exams/Exams";

interface HomeProps {
    themeMode: "light" | "dark";
    toggleTheme: () => void; 
}

const HomePage = ({ themeMode, toggleTheme } : HomeProps) => {
    return (
        <>
            <Exams />
        </>     
    );
}

export default HomePage;