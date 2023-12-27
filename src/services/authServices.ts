import { server, apiErrorHandler } from "../utils";
import { TSignInOtp, TRegister } from "../models/auth";

interface signInParams {
    CountryCode: string,
    PhoneNumber: string,
    OtpNumber?: string
}

export interface registerParams {
    params: {
        Name: string,
        Gender: number,
        CountryCode: string,
        PhoneNumber: string
        ReferredBy: string,
        Email: string,
        Birthday: string
    }
}

export const signIn = async (payload: signInParams) : Promise<boolean> => {
    try {
        const headerOptions = {
            'Accept': 'application/json'
        }

        const res = await server.post(`/api/v2/auth/user/login`, payload, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const signInOtp = async (payload: signInParams): Promise<TSignInOtp> => {
    try {
        const headerOptions = {
            'Accept': 'application/json'
        }

        const res = await server.post(`/api/v2/auth/user/login/otp`, payload, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}

export const register = async (payload: registerParams): Promise<TRegister> => {
    try {
        const headerOptions = {
            'Accept': 'application/json'
        }

        const res = await server.post(`/api/v2/auth/user/register`, payload, {
            headers: headerOptions
        });

        return res.data;
    } catch (err: any) {
        throw new Error(`${apiErrorHandler(err)}`);
    }
}