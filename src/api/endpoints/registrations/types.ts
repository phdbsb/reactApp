export interface IRegistration {
    examId: string;
    deadlineId: string;
}

type IRegWithoutDeadlineId = Omit<IRegistration, "deadlineId">;
export type UpdatePassedModel = IRegWithoutDeadlineId & { passed: boolean; }