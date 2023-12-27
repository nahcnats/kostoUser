import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    token: string,
    userId: string,
    name: string,
    walletId: string,
    isVerified: boolean,
    countryCode: string,
    phoneNumber: string
}

type InitialState = {
    value: AuthState
}

const initialState = {
    value: {
        token: "",
        userId: "",
        name: "",
        walletId: "",
        isVerified: false,
        countryCode: "",
        phoneNumber: ""
    }
} as InitialState;

export const auth = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logOut: () => {
            AsyncStorage.removeItem('CREDENTIALS');
            return initialState;
        },
        logIn: (state, action: PayloadAction<AuthState>) => {
            return {...state, value: action.payload}
        },
    }
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;