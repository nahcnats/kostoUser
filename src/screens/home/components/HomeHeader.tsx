import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

import { VoucherSimple } from '../../../components/widget';

import Artboard_23 from '../../../assets/svg/Artboard_23.svg';

const HomeHeader = () => {
    return (
        <View className='flex-row items-center gap-x-6 mt-8'>
            <Artboard_23 width={180} height={180} />
            <View className='gap-y-2'>
                <VoucherSimple title='Total Voucher' />
                <TouchableOpacity
                    className='flex-row bg-white justify-center items-center py-2 px-4'
                    style={{
                        borderTopLeftRadius: 25,
                        borderBottomRightRadius: 25,
                    }}
                >
                    <View className='rounded-full justify-center items-center h-6 w-6'>
                        <Text
                            className='text-green-800 text-xs font-bold'

                        >
                            +
                        </Text>
                    </View>
                    <Text className='text-green-800 text-sm font-bold'>Get Voucher</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default HomeHeader;