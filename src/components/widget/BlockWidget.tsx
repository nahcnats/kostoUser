import { 
    View, 
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAppSelector } from '../../store/store';
import { useRefreshOnFocus } from '../../hooks';
import { getBlocks, getCurrentBlock } from '../../services/blockServices';
import { TBlock } from '../../models/block';

import MTActive from '../../assets/svg/mtActive.svg';
import { MainNavigationParams } from '../../navigators/MainNavigation';

const BlockWidget = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    
    const {
        isLoading: isLoadingBlocks,
        isSuccess: isSuccessBlocks,
        isError: isErrorBlocks,
        data: blocks,
        error: errorBlocks,
        refetch: refetchBlocks
    } = useQuery<TBlock[], Error>({
        queryKey: ['blocks'],
        queryFn: () => getBlocks({
            token: token
        })
    });
    useRefreshOnFocus(refetchBlocks);

    const {
        isLoading: isLoadingCurrentBlock,
        isSuccess: isSuccessCurrentBlock,
        isError: isErrorCurrentBlock,
        data: currentBlock,
        error: errorCurrentBlock,
        refetch: refetchCurrentBlock
    } = useQuery<TBlock, Error>({
        queryKey: ['currentBlocks'],
        queryFn: () => getCurrentBlock({
            token: token
        })
    });
    useRefreshOnFocus(refetchBlocks);

    const [numBlocks, setNumBlocks] = useState(0);

    useEffect(() => {
        let completedBlocks = blocks?.filter(block => block.status === 'Completed').length || 0;

        if (completedBlocks > 0) {
            setNumBlocks(completedBlocks);
        }
    }, [isSuccessBlocks]);

    if (isLoadingBlocks && !blocks) {
        return null;
    }

    if (isErrorBlocks) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: errorBlocks.message,
            autoClose: 2000,
        });

        return null;
    }

    return (
        <View className='flex-row justify-between items-center px-4 '>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('BottomTab', { screen: 'HistoryTab' })}
            >
                <View className='flex-row justify-between items-center'>
                    <Text className='text-xs text-black'>Current Spending</Text>
                    <Entypo name='ticket' size={20} color={colors.green[700]} />
                </View>

                <Text className='text-xs text-green-700 font-semibold'>
                    RM{currentBlock?.currentAmount?.toFixed(2) || 0} / RM{currentBlock?.totalAmount?.toFixed(2) || 0}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('BottomTab', { screen: 'MTTab' })}
            >
                <View className='flex-row justify-between items-center'>
                    <Text className='text-xs text-black'>MT</Text>
                    <MTActive width={20} height={20} />
                </View>

                <Text className='text-xs text-green-700 font-semibold'>RM3.50</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: colors.gray[300],
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: 170
    }
})

export default BlockWidget;