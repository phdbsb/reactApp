import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark";

export const useThemeMode = () => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem("theme");
        const newTheme = saved as ThemeMode;
        document.documentElement.setAttribute('data-theme', newTheme);
        return newTheme;
    });

    const toggleTheme = () => {
        const newTheme = themeMode === "light" ? "dark" : "light";
        setThemeMode(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return {themeMode, toggleTheme}
};