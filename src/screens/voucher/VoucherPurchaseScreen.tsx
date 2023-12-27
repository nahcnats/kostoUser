import { 
    View, 
    SafeAreaView, 
    Text,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { StackNavigationProp } from '@react-navigation/stack';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import VoucherHeader from './components/VoucherHeader';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';
import CurrencyInput from '../../components/UI/CurrencyInput';
import { Loading, Error500, Seperator } from '../../components/common';

import { useAppSelector } from '../../store/store';
import { MainNavigationParams } from '../../navigators/MainNavigation';
import { TWallet } from '../../models/wallet';
import { getWalletBalance } from '../../services/walletServices';
import { useRefreshOnFocus, useDebounce } from '../../hooks';
import { dismissKeyboard } from '../../utils';

import MT from '../../assets/svg/mtActive.svg'

const artboardSize = 60;

const amountList = [
    { name: 'RM25', amount: 2500 },
    { name: 'RM50', amount: 5000 },
    { name: 'RM100', amount: 10000 },
    { name: 'RM250', amount: 25000 },
    { name: 'RM500', amount: 50000 },
    { name: 'Other', amount: 0 },
]

const VoucherPurchaseScreen = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();

    const [amount, setAmount] = useState(0);

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
        if (!data?.isOneTimePasswordSet) {
            navigation.navigate('PINOTP', { type: 'register' });
            return;
        }
    }

    useEffect(() => {
        checkVerification();

        setAmount(15000);
    }, [isSuccess]);

    const submitPurchaseVoucher = () => {
        if (amount <= 0) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Amount is required',
                autoClose: 2000,
            });

            return;
        }

        navigation.navigate('VoucherPaymentLoading', {
            amount: amount / 100
        });
    }

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
            <View className='flex-1 justify-center' onStartShouldSetResponder={dismissKeyboard}>
                <VoucherHeader />
                <View
                    className='flex-1 bg-white p-8'
                    style={{
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    }}
                >
                    <SafeAreaView className='flex-1'>
                        <View className='flex-row justify-center items-start gap-x-8'>
                            <MT width={artboardSize} height={artboardSize} />
                            <View>
                                <CurrencyInput label='Purchase Voucher' value={amount} onSetAmount={(amount) => setAmount(amount)} />
                            </View>
                        </View>
                        <Seperator />
                        <View className='flex-1 justify-between mt-4'>
                            <View className="flex-row justify-around items-center gap-2 flex-wrap">
                                {
                                    amountList.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className={`rounded-md bg-sky-700 py-2 px-2 w-[100] ${item.amount === amount ? 'bg-sky-700' : 'opacity-40'} `}
                                            onPress={() => setAmount(item.amount)}
                                        >
                                            <Text className='text-base text-white font-bold self-center'>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                            <View className='pb-8'>
                                <PrimaryBtn label='Confirm' onPress={() => debounce(submitPurchaseVoucher)} disabled={false} />
                            </View>
                        </View>
                    </SafeAreaView>   
                </View>
            </View>
        </BackgroundScreen>
    );
}

export default VoucherPurchaseScreen;