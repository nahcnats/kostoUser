// Taken from https://github.com/antonioru/beautiful-react-hooks/blob/master/src/useTimeout.ts
import { useCallback, useEffect, useRef, useState } from 'react';
export type UseTimeoutOptions = {
    cancelOnUnmount?: boolean;
};
const defaultOptions = {
    cancelOnUnmount: true,
};
/**
 * An async-utility hook that accepts a callback function and a delay time (in milliseconds), then delays the
 * execution of the given function by the defined time.
 */
export const useTimeout = <T extends (...args: any[]) => any>(
    fn: T,
    milliseconds: number | null,
    options: UseTimeoutOptions = defaultOptions,
): [boolean, () => void] => {
    const opts = { ...defaultOptions, ...(options || {}) };
    const timeout = useRef<NodeJS.Timeout>();
    const callback = useRef<T>(fn);
    const [isCleared, setIsCleared] = useState<boolean>(false);
    // the clear method
    const clear = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            setIsCleared(true);
        }
    }, []);
    // if the provided function changes, change its reference
    useEffect(() => {
        if (typeof fn === 'function') {
            callback.current = fn;
        }
    }, [fn]);
    // when the milliseconds change, reset the timeout (if not null)
    // if milliseconds are null, clear the timeout
    useEffect(() => {
        if (milliseconds !== null) {
            timeout.current = setTimeout(() => {
                callback.current();
            }, milliseconds);
        } else {
            clear();
        }
        return clear;
    }, [milliseconds]);
    // when component unmount clear the timeout
    useEffect(
        () => () => {
            if (opts.cancelOnUnmount) {
                clear();
            }
        },
        [],
    );
    return [isCleared, clear];
};