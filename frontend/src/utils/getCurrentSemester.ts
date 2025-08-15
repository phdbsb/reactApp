export const getCurrentSemester = (): number => {
    const month = new Date().getMonth() + 1;
    return month >= 10 || month <= 1 ? 1 : 2;
};