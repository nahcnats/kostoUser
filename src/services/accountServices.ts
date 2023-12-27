import { 
    server, 
    apiErrorHandler,
     paginationHelper 
} from "../utils";
import { BearerParams, TPagination, TToken } from "../components/interface";
import { TMerchant, TMerchantV2 } from "../models/merchant";
import { TUser } from "../models/account";

interface GetMerchantsParams {
    params?: TPagination
}

interface GetMerchantParams {
    token: TToken,
    params: {
        id: string,
    }
}

export interface UpdateUserParams {
    token: TToken,
    params: {
        name: string,
        gender: string,
        birthday: string,
        language: string
    }
}

export interface UpdateEmailParams {
    token: TToken,
    params: {
        email: string,
    }
}

export interface UpdateReferredByParams {
    token: TToken,
    params: {
        referredBy: string,
    }
}

export const getMerchant = async (payload: GetMerchantParams): Promise<TMerchantV2> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/common/merchant/detail/${payload.params.id}`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        console.log('err', err)
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getMerchants = async (payload: GetMerchantsParams): Promise<TMerchantV2> => {
    try {
        const headerOptions = {
            'Accept': 'application/json'
        }

        const paginationParams = paginationHelper(payload.params);

        // console.log('params', paginationParams)

        const res = await server.get(`/api/v2/common/merchant/all${paginationParams}`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const getUser = async (payload: BearerParams): Promise<TUser> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/api/v2/user/profile`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const updateUser = async (payload: UpdateUserParams): Promise<TUser> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.put(`/api/v2/user/profile`, payload.params, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const updateEmail = async (payload: UpdateEmailParams): Promise<TUser> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.put(`/api/v2/user/profile/email`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const updateReferredBy = async (payload: UpdateReferredByParams): Promise<TUser> => {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.put(`/api/v2/user/referred-by`, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}