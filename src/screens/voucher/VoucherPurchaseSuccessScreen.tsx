import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import { 
    Loading,
    Error500,
    Seperator
} from '../../components/common';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { IS_ANDROID } from '../../utils';

import MT from '../../assets/svg/mtActive.svg'
import { useAppSelector } from '../../store/store';
import { TWallet, TWalletTransactions } from '../../models/wallet';
import { getWalletBalance, getWalletTransaction } from '../../services/walletServices';
import { useRefreshOnFocus } from '../../hooks';

type Props = StackScreenProps<MainNavigationParams, 'VoucherPurchaseSuccess'>;

const artboardSize = 80;

const VoucherPurchaseSuccessScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const navigation = useNavigation <StackNavigationProp < MainNavigationParams>>()
    const { token } = useAppSelector((state) => state.authReducer.value);
    const { walletTransactionId } = route.params;
    const [fetching, setFetching] = useState(false);
    const [walletTransaction, setWalletTransaction] = useState<TWalletTransactions>();
    const initialBalance = 0;

    const {
        isLoading,
        isSuccess,
        isError,
        data,
        error: walletBalanceError,
        refetch
    } = useQuery<TWallet, Error>({
        queryKey: ['voucherBalance'],
        queryFn: () => getWalletBalance({
            token: token
        })
    });
    useRefreshOnFocus(refetch);

    const fetchWalletTransaction = async () => {
        try {
            setFetching(true);

            const payload = {
                token: token,
                params: {
                    id: walletTransactionId
                }
            }

            const result = await getWalletTransaction(payload);

            if (!result) throw new Error('Transaction not found');

            setWalletTransaction(result);

            setFetching(false);
        } catch (err: any) {
            setFetching(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    }

    useEffect(() => {
        fetchWalletTransaction();
    }, []);


    if (isLoading && !data) {
        return <Loading />;
    }

    if (isError) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: walletBalanceError.message,
            autoClose: 2000,
        });

        return <Error500 />;
    }

    return (
        <BackgroundScreen>
            <View className='flex-1 justify-center items-center'>
                <View className={`justify-center items-center rounded-3xl bg-white w-full ${IS_ANDROID ? 'p-8' : 'p-6'}`}>
                    <MT width={artboardSize} height={artboardSize} />
                    <View className='my-2'>
                        <Text className='self-center text-green-800 text-lg font-bold'>Successful Purchase</Text>
                        <Text className='self-center text-green-800 text-xl font-bold'>RM{walletTransaction?.amount.toFixed(2)}</Text>
                    </View>
                    <Seperator />
                    <View className='w-full items-start'>
                        <Text className='text-black font-bold'>Transaction ID</Text>
                        <Text className='text-green-800 font-semibold'>{walletTransactionId}</Text>
                    </View>
                    <Seperator />
                    <View className='flex-row w-full justify-between items-center'>
                        <Text className='font-bold'>Date & Time</Text>
                        <Text className='opacity-40'></Text>
                    </View>
                    <Seperator />
                    <View>
                        <Text className='self-center text-green-800 text-lg font-bold'>Total Voucher Balance</Text>
                        <Text className='self-center text-green-800 text-lg font-bold'>RM{data?.amount ? data?.amount.toFixed(2) : initialBalance.toFixed(2)}</Text>
                    </View>
                    <View className='w-full my-8'>
                        <PrimaryBtn label='Ok' onPress={() => navigation.replace('BottomTab')} disabled={false} />
                    </View>
                </View>
            </View>
        </BackgroundScreen>
    );
}

export default VoucherPurchaseSuccessScreen;