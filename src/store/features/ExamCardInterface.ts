export interface IExamCard {
    id: string;
    title: string;
    faculty: string;
    semester: number;
    schedule: { [key: string]: string };
    isPassed: boolean;
}