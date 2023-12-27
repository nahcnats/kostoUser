import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { PrimaryBtn } from '../UI/PrimaryBtn';

interface Error500Props {
    message?: string
}

const Error500 = ({ message } : Error500Props) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    return (
        <View className='flex-1 justify-center items-center bg-white p-4'>
            <View style={{ width: 200, height: 200 }}>
                <LottieView style={{ flex: 1 }} source={require('../../assets/lotties/error500.json')} autoPlay loop />
            </View>
            <Text className='flex flex-wrap text-red-500 text-base font-semibold'>{message ? message : t('error500')}</Text>
            <View className='w-full mt-4'>
                <PrimaryBtn label='Close' onPress={() => navigation.replace('BottomTab')} disabled={false} />
            </View>
        </View>
    );
}

export default Error500;