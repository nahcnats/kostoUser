import React, { useCallback, useEffect} from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppState } from '@react-native-community/hooks';
import colors from "tailwindcss/colors";
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { Text, View } from "react-native";
import { useDispatch } from 'react-redux';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { logIn, logOut } from "../store/features/auth-slice"
import { useAppSelector } from "../store/store";
import AuthNavigation from "./AuthNavigation";
import MainNavigation from "./MainNavigation";
import { jwtDecrypt } from "../utils";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.white
    }
}

const RootNavigation = () => {
    const currentAppState = useAppState();
    const dispatch = useDispatch();
    const isAuth = useAppSelector((state) => !!state.authReducer.value.token);
    
    const trySignIn = useCallback(async () => {
        try {
            const authStore = await AsyncStorage.getItem("CREDENTIALS");

            if (!authStore) return;

            const credentials = JSON.parse(authStore);

            dispatch(logIn(credentials));
        } catch (err: any) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message || 'Invalid credentials',
                autoClose: 2000,
            });

            dispatch(logOut);
        }
    }, []);

    useEffect(() => {
        if (currentAppState !== 'active') return;

        // trigger trySignIn only when app state is active
        trySignIn();
    }, [currentAppState]);

    return (
        <NavigationContainer
            theme={MyTheme}
        >
            <BottomSheetModalProvider>
                {
                    isAuth
                        ? <MainNavigation />
                        : <AuthNavigation />
                }
            </BottomSheetModalProvider>
        </NavigationContainer>
    );
}

export default RootNavigation;