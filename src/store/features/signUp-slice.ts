import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignUpState = {
    CountryCode: string,
    PhoneNumber: string,
}

type InitialState = {
    value: SignUpState
}

const initialState = {
    value: {
        CountryCode: '',
        PhoneNumber: '',
    } as SignUpState
} as InitialState;

export const signUp = createSlice({
    name: "signUp",
    initialState: initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<SignUpState>) => {
            return { ...state, value: action.payload }
        },
    }
});

export const { registerUser } = signUp.actions;
export default signUp.reducer;