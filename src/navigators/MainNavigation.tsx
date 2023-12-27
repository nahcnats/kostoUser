import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator, StackView } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

import BottomTabNavigation from "./BottomTabNavigation";
import {
    MTTransactionsScreen
} from '../screens/mt/tabs'
import { ScanScreen } from '../screens';
import { 
    PayformScreen,
    PayVerifyScreen,
    ForgotPINScreen,
    PINOTPScreen,
    RegisterPINScreen,
    PaySuccessScreen
} from '../screens/pay';
import { 
    VouchersScreen,
    PaymentsScreen,
    RewardsScreen
} from '../screens/history/tabs';
import { 
    VoucherPurchaseScreen,
    VoucherPaymentLoadingScreen,
    VoucherPurchaseSuccessScreen
} from '../screens/voucher';
import { BackHeader } from '../components/common';

export type MainNavigationParams = {
    BottomTab: undefined | { screen?: string },
    MTTransactions: undefined,
    ScanScreen: undefined,
    Payform: undefined,
    PayVerify: {
        transactionId: string,
        shopName: string,
        productName: string,
        merchantId: string
        amount: number,
    },
    PaySuccess: { transactionId: string},
    ForgotPIN: { otpCode: string },
    PINOTP: { type: string },
    RegisterPIN: { otpCode: string },
    VouchersHistory: undefined,
    PaymentsHistory: undefined,
    RewardsHistory: undefined
    VoucherPurchase: undefined,
    VoucherPaymentLoading: { amount: number },
    VoucherPurchaseSuccess: { walletTransactionId: string },
}

const Stack = createStackNavigator<MainNavigationParams>();

const MainNavigation = () => {
    const { t } = useTranslation();
    
    const defaultNavOptions = {
        headerStyle: {
            backgroundColor: 'transparent'
        },
        headerShadowVisible: false,
        headerTintColor: colors.black,
    }

    return (
        <Stack.Navigator
            initialRouteName='BottomTab'
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='BottomTab'
                component={BottomTabNavigation}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Group
                key='MTGroup'
            >
                <Stack.Screen
                    name='MTTransactions'
                    component={MTTransactionsScreen}
                />
            </Stack.Group>
            <Stack.Screen
                name='ScanScreen'
                component={ScanScreen}
                options={{
                    headerTitle: "",
                    headerLeft: () => <BackHeader inverted={false} />,
                    headerBackTitleVisible: false,
                }}
            />
            <Stack.Group
                key='PayGroup'
            >
                <Stack.Screen
                    name='Payform'
                    component={PayformScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true
                    }}
                />
                <Stack.Screen
                    name='PayVerify'
                    component={PayVerifyScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true,
                    }}
                />
                <Stack.Screen
                    name='ForgotPIN'
                    component={ForgotPINScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true,
                    }}
                />
                <Stack.Screen
                    name='PINOTP'
                    component={PINOTPScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true,
                    }}
                />
                <Stack.Screen
                    name='RegisterPIN'
                    component={RegisterPINScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true,
                    }}
                />
                <Stack.Screen
                    name='PaySuccess'
                    component={PaySuccessScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true,
                        headerShown: false
                    }}
                />
            </Stack.Group>
            <Stack.Group
                key='HistoryGroup'
            >
                <Stack.Screen
                    name='VouchersHistory'
                    component={VouchersScreen}
                />
                <Stack.Screen
                    name='PaymentsHistory'
                    component={PaymentsScreen}
                />
                <Stack.Screen
                    name='RewardsHistory'
                    component={RewardsScreen}
                />
            </Stack.Group>
            <Stack.Group
                key='VoucherGroup'
            >
                <Stack.Screen
                    name='VoucherPurchase'
                    component={VoucherPurchaseScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={true} />,
                        headerTransparent: true
                    }}
                />
                <Stack.Screen
                    name='VoucherPaymentLoading'
                    component={VoucherPaymentLoadingScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={false} />,
                        headerTransparent: true,
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='VoucherPurchaseSuccess'
                    component={VoucherPurchaseSuccessScreen}
                    options={{
                        headerTitle: "",
                        headerLeft: () => <BackHeader inverted={false} />,
                        headerTransparent: true,
                        headerShown: false
                    }}
                />
            </Stack.Group> 
        </Stack.Navigator>
    );
}

export default MainNavigation;