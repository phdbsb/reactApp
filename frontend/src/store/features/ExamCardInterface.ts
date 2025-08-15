export interface IExamCard {
    id: string;
    title: string;
    semester: number;
    schedule: { [key: string]: string };
}

