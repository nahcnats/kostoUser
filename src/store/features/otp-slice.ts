import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OtpState = {
    CountryCode: string,
    PhoneNumber: string,
    OtpNumber?: string
}

type InitialState = {
    value: OtpState
}

const initialState = {
    value: {
        CountryCode: '',
        PhoneNumber: '',
        OtpNumber: '' 
    } as OtpState
} as InitialState;

export const otp = createSlice({
    name: "otp",
    initialState: initialState,
    reducers: {
        otpSignIn: (state, action: PayloadAction<OtpState>) => {
            return { ...state, value: action.payload}
        },
    }
});

export const { otpSignIn } = otp.actions;
export default otp.reducer;