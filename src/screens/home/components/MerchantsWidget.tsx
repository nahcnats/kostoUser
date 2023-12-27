import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import Carousel from 'react-native-snap-carousel';

import { getMerchants } from '../../../services/accountServices';

const MerchantsWidget = () => {

    const fetchMerchants= async () => {
        const payload = {
            params: {
                CurrentPage: 1,
                PageSize: 10
            }
        }

        await getMerchants(payload);
    }

    useEffect(() => {
        fetchMerchants()
    }, []);

    const _renderItem = () => {
        return (
            <View>
                <Text>123</Text>
            </View>
        )
    }
    return (
        <View className='pt-8 px-4'>
            <Text>MerchantsWidget</Text>
        </View>
    );
}

export default MerchantsWidget