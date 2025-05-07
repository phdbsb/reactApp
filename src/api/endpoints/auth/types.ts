export interface IReg {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface ILogin {
    email: string,
    password: string
}

type IRegWithoutPassword = Omit<IReg, "password">
export type IAuthResponse = IRegWithoutPassword & { id: string }

