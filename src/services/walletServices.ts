import { server, apiErrorHandler, paginationHelper } from "../utils";
import { 
    TWallet, 
    TWalletToken, 
    TWalletTransactions
} from "../models/wallet";
import { BearerParams, TToken } from "../components/interface";

interface WalletTopupParams {
    token: TToken,
    params: {
        Amount: number,
        TransactionType: number,
        AttachmentId: string,
        ToWalletId: string,
        FromType: number,
        ToType: number,
        ActionBankInfo: string,
    }
}

interface WalletTransactionParams {
    token: TToken,
    params: {
        id: string
    }
}

interface ResetPINParams {
    token: TToken,
    params: {
        PinNumber: string,
        OtpNumber: string,
    }
}

export interface VerifyPINParams {
    token: TToken,
    params: {
        OneTimePassword: string
    }
}

export interface GetWalletTransactionsParams {
    token: TToken,
    params: {
        PageSize: number,
        SortOrder: number
    }
}

export const getVoucherBalance = async (payload: BearerParams): Promise<TWallet> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/wallet/balance/user`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getWalletToken = async (payload: BearerParams): Promise<TWalletToken> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/wallet/token`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getWalletBalance = async (payload: BearerParams): Promise<TWallet> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/wallet/balance/user`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getWalletTransactions = async (page: number, payload: GetWalletTransactionsParams): Promise<TWalletTransactions[]> => {
    try {
        const params = paginationHelper({
            CurrentPage: page,
            PageSize: payload.params.PageSize,
            SortOrder: payload.params.SortOrder,
        });

        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/wallet/own/transaction${params}`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getWalletTransaction = async (payload: WalletTransactionParams): Promise<TWalletTransactions> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/wallet/own/transaction/${payload.params.id}`, {
            headers: headerOptions
        });

        if (res.data.errorCode) {
            throw new Error(res.data.message);
        }

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getRewardTransactions = async (page: number, payload: GetWalletTransactionsParams): Promise<TWalletTransactions[]> => {
    try {
        const params = paginationHelper({
            CurrentPage: page,
            PageSize: payload.params.PageSize,
            SortOrder: payload.params.SortOrder,
        });

        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/wallet/own/transaction${params}&transactionType=reward`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const setPaymentPIN = async (payload: BearerParams): Promise<TWalletTransactions[]> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/wallet/onetime-password`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const walletTopUp = async (payload: WalletTopupParams): Promise<TWalletTransactions> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`/api/v2/wallet/user/topup`, payload.params, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getResetPINOTP = async (payload: BearerParams): Promise<any> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/wallet/pin/reset`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const resetPIN = async (payload: ResetPINParams): Promise<boolean> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.put(`/api/v2/wallet/pin/reset`, payload.params, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const verifyPin = async (payload: VerifyPINParams): Promise<boolean> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.put(`/api/wallet/onetime-password/verify`, payload.params, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}