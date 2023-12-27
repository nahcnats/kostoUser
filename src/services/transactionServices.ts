import { 
    server, 
    apiErrorHandler,
    paginationHelper, 
} from "../utils";
import { TToken, TPagination } from "../components/interface";
import { TTransactions } from "../models/transactions";

export interface TransactionsParams {
    token: TToken,
    params: {
        PageSize: number,
        SortOrder: number
    }
}

interface TransactionParams {
    token: TToken,
    params: {
        transactionId: string
    }
}

interface CreateTransactionParams {
    token: TToken,
    params: {
        ProductName: string
        MerchantId: string
        Amount: number,
        PaymentType: string,
    }
}

export interface PayTransactionParams {
    token: TToken,
    params: {
        TransactionId: string,
        OneTimePassword: string,
    }
}

export const getTransactions = async (page: number, payload: TransactionsParams): Promise<TTransactions[]> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const params = paginationHelper({
            CurrentPage: page,
            PageSize: payload.params.PageSize,
            SortOrder: payload.params.SortOrder,
        });

        const res = await server.get(`/api/transaction/own${params}`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getTransaction = async (payload: TransactionParams): Promise<TTransactions> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/transaction/${payload.params.transactionId}`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const createPreTransaction = async (payload: CreateTransactionParams): Promise<TTransactions> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`/api/v2/transaction`,payload.params, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const payTransaction = async (payload: PayTransactionParams): Promise<TTransactions> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`/api/v2/pay`, payload.params, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}