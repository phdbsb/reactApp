export class ExamCard {
    id: number;
    title: string;
    faculty: string;
    startsIn: string;

    constructor(id: number, title: string, faculty: string, startsIn: string) {
        this.id = id;
        this.title = title;
        this.faculty = faculty;
        this.startsIn = startsIn;
    }
};