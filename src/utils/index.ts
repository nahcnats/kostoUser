import { Platform, Keyboard, NativeModules } from "react-native";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Buffer } from "buffer";

import { DEV_API, PROD_API } from "../constants";

export const queryClient = new QueryClient();
export const IS_ANDROID = Platform.OS === 'android';

export const BASE_URL = NativeModules.RNConfig.env === (IS_ANDROID ? 'internal' : 'Internal') ? DEV_API : PROD_API;

export const server = axios.create({
    baseURL: BASE_URL,
});

export const dismissKeyboard = () => {
    Keyboard.dismiss();
    return false;
}

export const apiErrorHandler = (error: Error) => {
    let message = 'Opps, something went wrong!';

    if (error.message) {
        message = error.message;
    }

    return new Error(message);
}

// cannot use use standard jtwCode, different implementation
export const jwtDecrypt = (token: string) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            Buffer.from(base64, 'base64')
                .toString('utf8')
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.log('jwtDecrypt error', err);
        return null;
    }
}

export const paginationHelper = (payloadParams: any) => {
    let params = '';

    if (payloadParams) {
        let i = 0;
        params += '?';

        const objLen = Object.keys(payloadParams).length;

        for (const [key, value] of Object.entries(payloadParams)) {
            i++;
            
            params += `${key}=${value}`;

            if (i < objLen) {
                params += '&';
            }
        }
    }

    return params;
}