import { server, apiErrorHandler, paginationHelper } from "../utils";
import { BearerParams, TPagination, TToken } from "../components/interface";
import { TBlock } from "../models/block";
import { QueryFunction, QueryFunctionContext } from "@tanstack/react-query";

export interface GetMTTransactionsParam {
    token: TToken,
    params: {
        PageSize: number,
        SortOrder: number
    }
}

export const getMTTransactions = async (page: number, payload: GetMTTransactionsParam) : Promise<TBlock> => {
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

        const res = await server.get(`/api/v2/block/own?CurrentPage${params}`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getBlocks = async (payload: BearerParams): Promise<TBlock[]> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/block/own`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getCurrentBlock = async (payload: BearerParams): Promise<TBlock> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/block/own/current`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}