import React from "react";
import { useFocusEffect } from "@react-navigation/native";

import { BOUNCE_RATE } from "../constants";

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
    const firstTimeRef = React.useRef(true);

    useFocusEffect(
        React.useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch();
        }, [refetch])
    );
}

export const useDebounce = () => {
    const busy = React.useRef(false);

    const debounce = async (callback: Function) => {
        setTimeout(() => {
            busy.current = false;
        }, BOUNCE_RATE);

        if (!busy.current) {
            busy.current = true;
            callback();
        }
    }

    return { debounce };
}