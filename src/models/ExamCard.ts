export class ExamCard {
    id: string;
    title: string;
    faculty: string;
    semester: number;
    schedule: { [key: string]: string };
    isPassed: boolean;

    constructor(id: string, title: string, faculty: string, semester: number, schedule: { [key: string]: string }, isPassed: boolean ) {
        this.id = id;
        this.title = title;
        this.faculty = faculty;
        this.semester = semester;
        this.schedule = schedule;
        this.isPassed = isPassed;
    }
};