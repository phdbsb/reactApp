export interface IGetExams {
    id: string;
    title: string;
    semester: number;
    schedule: { [key: string]: string };
    term: string | null;
    isRegistered: boolean;
}

export interface IExamCard {
    id: string;
    title: string;
    semester: number;
    schedule: { [key: string]: string };
}

export class ExamCard {
    id: string;
    title: string;
    semester: number;
    schedule: { [key: string]: string };

    constructor(id: string, title: string, semester: number, schedule: { [key: string]: string }) {
        this.id = id;
        this.title = title;
        this.semester = semester;
        this.schedule = schedule;
    }
};
