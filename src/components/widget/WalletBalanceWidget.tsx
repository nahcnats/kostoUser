import { 
    View, 
    Text,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import { useAppSelector } from '../../store/store';
import { getWalletBalance } from '../../services/walletServices';
import { useRefreshOnFocus } from '../../hooks';
import { TWallet } from '../../models/wallet';

interface WalletBalanceProps {
    onPress: () => void
}

const WalletBalanceWidget = ({ onPress } : WalletBalanceProps) => {
    const { token } = useAppSelector((state) => state.authReducer.value);
    const initialBalance = 0;
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

    if (isLoading && !data) {
        return null;
    }

    if (isError) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: walletBalanceError.message,
            autoClose: 2000,
        });

        return null;
    }

    return (
        <TouchableOpacity
            className='flex-row bg-colors-new-6 items-center space-x-3 py-3 px-4'
            style={{
                borderTopLeftRadius: 25,
                borderBottomRightRadius: 25,
            }}
            onPress={onPress}
        >
            <Text className='text-white text-sm font-bold'>RM{data?.amount ? data.amount.toFixed(2) : initialBalance.toFixed()}</Text>
            <View className='rounded-full justify-center items-center bg-white h-6 w-6'>
                <Text 
                    className='text-green-800 text-xs font-bold'

                >
                    +
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default WalletBalanceWidget;