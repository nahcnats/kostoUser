import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';

const Loading = () => {
    const { t } = useTranslation();

    return (
        <View className='flex-1 justify-center items-center'>
            <View>
                <View style={{ width: 200, height: 200 }}>
                    <LottieView style={{ flex: 1 }} source={require('../../assets/lotties/sand_clock.json')} autoPlay loop />
                </View>
            </View>
            <Text className='text-white text-base font-semibold'>{t('loading')}</Text>
        </View>
    );
}

export default Loading;