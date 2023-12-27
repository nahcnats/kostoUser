import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Artboard_1 from '../../../assets/svg/Artboard_2.svg';

const artboardSize = 260;

const AuthHeader = () => {
    const { t } = useTranslation();
    return (
        <View className='justify-center items-center'>
            <Text className='text-2xl text-white font-semibold self-center'>{t('auth_header.greeting')}</Text>
            <Artboard_1 width={artboardSize} height={artboardSize} />
        </View>
    );
}

export default AuthHeader;