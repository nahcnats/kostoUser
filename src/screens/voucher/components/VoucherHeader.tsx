import { View, Text } from 'react-native';
import React from 'react';

import Artboard_2 from '../../../assets/svg/Artboard_23.svg'

const artboardSize = 200;

const VoucherHeader = () => {
    return (
        <View className='justify-center items-center top-4 h-[230]'>
            <Artboard_2 width={artboardSize} height={artboardSize} />
        </View>
    );
}

export default VoucherHeader;