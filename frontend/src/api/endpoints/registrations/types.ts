export interface IRegistration {
    examId: string;
    deadlineId: string;
}

type IRegWithoutDeadlineId = Omit<IRegistration, "deadlineId">;
export type UpdatePassedModel = IRegWithoutDeadlineId & { passed: boolean; };

export interface StudentData {
    userId: string,
    examId: string,
    grade: number | null
}

