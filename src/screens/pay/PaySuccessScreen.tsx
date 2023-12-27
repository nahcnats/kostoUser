import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';

import { useAppSelector } from '../../store/store';
import { MainNavigationParams } from '../../navigators/MainNavigation';

const PaySuccessScreen = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    
    return (
        <BackgroundScreen>
            <View className='flex-1 justify-center'>
                <View className='h-[300] w-full justify-between rounded-2xl bg-white p-4'>
                    <Text>PaySuccess</Text>
                    <View className='pb-8'>
                        <PrimaryBtn label='Home' onPress={() => navigation.replace('BottomTab')} disabled={false} />
                    </View>
                </View>
            </View>
        </BackgroundScreen>
    );
}

export default PaySuccessScreen;