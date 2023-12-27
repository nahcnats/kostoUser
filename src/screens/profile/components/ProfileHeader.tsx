import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { WalletBalanceWidget } from '../../../components/widget';
import { MainNavigationParams } from '../../../navigators/MainNavigation';

import Artboard_7 from '../../../assets/svg/Artboard_7.svg';
import { IS_ANDROID } from '../../../utils';

const ProfileHeader = () => {
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    
    return (
        <View>
            <View className={`flex-row justify-between items-center p-4 ${IS_ANDROID && 'mt-8'}`}>
                <View><Text className="text-green-900 text-xl font-bold">My Profile</Text></View>
                <WalletBalanceWidget onPress={() => navigation.push('VoucherPurchase')} />
            </View>
            <View className="justify-center items-center py-2">
                <Artboard_7 width={180} height={180} />
            </View>
        </View>
    );
}

export default ProfileHeader;