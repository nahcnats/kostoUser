import { View, Text, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ALERT_TYPE, Toast, Dialog } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { useAppSelector } from '../../store/store';
import { IS_ANDROID, dismissKeyboard } from '../../utils';
import { TWallet } from '../../models/wallet';
import { TMerchant, TMerchantV2 } from '../../models/merchant';
import { getWalletBalance } from '../../services/walletServices';
import { getMerchant } from '../../services/accountServices';
import { useRefreshOnFocus, useDebounce } from '../../hooks';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';
import CurrencyInput from '../../components/UI/CurrencyInput';
import { Error500, Loading } from '../../components/common';
import { createPreTransaction } from '../../services/transactionServices';

const PayformScreen = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const { MerchantId } = useAppSelector((state) => state.merchantReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const amountRef = useRef<any>(null);
    const { debounce } = useDebounce();

    const [amount, setAmount] = useState(0);
    const [verifying, setVerifying] = useState(false);

    const {
        isLoading: isMerchantLoading,
        isError: isMerchantError,
        data: merchantData,
        error: merchantError,
        refetch: merchantRefetch
    } = useQuery<TMerchantV2, Error>({
        queryKey: ['merchant'],
        queryFn: () => getMerchant({
            token: token,
            params: {
                id: MerchantId
            }
        })
    });
    useRefreshOnFocus(merchantRefetch);

    const {
        isLoading,
        isSuccess,
        isError,
        data,
        error: walletBalanceError,
        refetch
    } = useQuery<TWallet, Error>({
        queryKey: ['walletBalance'],
        queryFn: () => getWalletBalance({
            token: token
        })
    });
    useRefreshOnFocus(refetch);

    const checkVerification = async () => {
        if (!MerchantId || MerchantId === '') {
            navigation.goBack();
        }

        if (!data?.isOneTimePasswordSet) {
            navigation.navigate('PINOTP', { type: 'register' });
            return;
        }
    }

    useEffect(() => {
        checkVerification();

        setTimeout(() => {
            amountRef?.current?.focus();
        }, 1000);

    }, [MerchantId]);

    const verifyHandler = async () => {
        if (amount === 0 || (data?.amount && amount > data?.amount)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Amount should not be 0 or more than balance',
                autoClose: 2000,
            });

            return;
        }

        try {
            setVerifying(true);

            const payload = {
                token: token,
                params: {
                    // ProductName: `Payment to ${merchantData?.shopName}`,
                    ProductName: `Payment to ${merchantData?.merchantId}`,
                    MerchantId: MerchantId,
                    Amount: amount,
                    PaymentType: 'Ewallet',
                }
            }
            const result = await createPreTransaction(payload);

            setVerifying(false);

            navigation.replace('PayVerify', {
                transactionId: result.transactionId,
                // shopName: merchantData?.shopName || '',
                shopName: merchantData?.merchantId || '',
                productName: result.productName,
                merchantId: result.merchantId,
                amount: result.amount,
            });
        } catch (err: any) {
            setVerifying(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }        
    }

    if (isLoading && !data && isMerchantLoading && !merchantData) {
        return (
            <BackgroundScreen>
                <Loading />
            </BackgroundScreen>
        );
    }

    if (isError && isMerchantError) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: walletBalanceError.message || merchantError.message,
            autoClose: 2000,
        });

        return <Error500 />;
    }

    return (
        <BackgroundScreen>
            <View className='flex-1 justify-center' onStartShouldSetResponder={dismissKeyboard}>
                <KeyboardAvoidingView
                    behavior={IS_ANDROID ? 'height' : 'padding'}
                    onStartShouldSetResponder={dismissKeyboard}
                >
                    <View className='h-[300] w-full justify-between rounded-2xl bg-white p-4'>
                        <View>
                            <Text className=" text-2xl font-semibold text-center p-2 mb-2">
                                {/* {merchantData?.shopName || 'Unknown'} */}
                                {merchantData?.merchantId || 'Unknown'}
                            </Text>
                        </View>
                        <View className='justify-center items-center'>
                            <CurrencyInput ref={amountRef} label='Amount' largeLabel value={amount} onSetAmount={(amount) => setAmount(amount)} />
                        </View>
                        <View className='pb-8'>
                            <PrimaryBtn label='Continue' onPress={() => debounce(verifyHandler)} disabled={verifying} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </BackgroundScreen>
    );
}

export default PayformScreen;