import { IAuthResponse } from "@/api/endpoints/auth/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    user: IAuthResponse | null;
}

const initialState: AuthState = {
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IAuthResponse>) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        }
    }
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;


