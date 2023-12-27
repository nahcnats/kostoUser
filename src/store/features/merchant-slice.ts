import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MerchantState = {
    MerchantId: string,
}

type InitialState = {
    value: MerchantState
}

const initialState = {
    value: {
        MerchantId: '',
    } as MerchantState
} as InitialState;

export const merchant = createSlice({
    name: "merchant",
    initialState: initialState,
    reducers: {
        setMerchantId: (state, action: PayloadAction<MerchantState>) => {
            return { ...state, value: action.payload }
        },
    }
});

export const { setMerchantId } = merchant.actions;
export default merchant.reducer;