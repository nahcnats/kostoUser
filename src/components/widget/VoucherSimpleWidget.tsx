import { View, Text } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import { useAppSelector } from '../../store/store';
import { getVoucherBalance } from '../../services/walletServices';
import { useRefreshOnFocus } from '../../hooks';
import { TWallet } from '../../models/wallet';

interface VoucherSimpleProps {
    title?: string
}

const VoucherSimpleWidget = ({ title } : VoucherSimpleProps) => {
    const initialBalance = 0;
    const { token } = useAppSelector((state) => state.authReducer.value);
    const {
        isLoading,
        isSuccess,
        isError,
        data,
        error: voucherBalanceError,
        refetch
    } = useQuery<TWallet, Error>({
        queryKey: ['voucherBalance'],
        queryFn: () => getVoucherBalance({
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
            textBody: voucherBalanceError.message,
            autoClose: 2000,
        });

        return null;
    }

    return (
        <View>
            {
                title && <Text className='text-green-900 text-sm self-center font-medium'>{title}</Text>
            }
            <Text className='text-2xl text-white font-semibold self-center'>
                RM{data?.amount ? data?.amount.toFixed(2) : initialBalance.toFixed()}
            </Text>
        </View>
    );
}

export default VoucherSimpleWidget;