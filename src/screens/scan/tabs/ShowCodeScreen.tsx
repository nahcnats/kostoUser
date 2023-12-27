import { 
    SafeAreaView, 
    View, 
    Text,
    Pressable, 
    Image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import {
    ALERT_TYPE,
    Toast,
} from 'react-native-alert-notification';

import { useAppSelector } from '../../../store/store';
import { VoucherSimple } from '../../../components/widget';
import { getWalletToken } from '../../../services/walletServices';

const ShowCodeScreen = () => {
    const { token, userId, name } = useAppSelector((state) => state.authReducer.value);
    const [refreshing, setRefreshing] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState('')
    const [showQr, setShowQr] = useState(false);
    
    const fetchWalletToken = async () => {
        try {
            setRefreshing(true);

            const result = await getWalletToken({ token: token });

            if (!result) return;

            setQrCodeValue(
                JSON.stringify({
                    userId: userId,
                    name: name,
                    token: result.token
                })
            );
            
            setRefreshing(false);
        } catch (err: any) {
            setRefreshing(false); 

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    }

    useEffect(() => {
        fetchWalletToken();
    }, []);

    const refreshQr = () => {
        if (refreshing) return;

        setShowQr(false);
        fetchWalletToken();
        setShowQr(true);
    }

    return (
        <SafeAreaView className="flex-1">
            <View className='flex-1 justify-center items-center  bg-colors-new-6 rounded-2xl m-4'>
                <Pressable
                    className='mb-2'
                    onPress={refreshQr}
                >
                    {
                        showQr
                            ? <View>
                                <View className='pb-4'>
                                    <Text className='text-yellow-500 text-base font-semibold self-center'>{name}</Text>
                                </View>
                                <View className='justify-center items-center'>
                                    <QRCode
                                        value={qrCodeValue}
                                        size={200}
                                    />
                                </View>
                            </View>
                            : 
                            <View>
                                <Image
                                    source={require('../../../assets/images/scanPayIcon.png')}
                                    style={{
                                        height: 80,
                                        width: 80
                                    }}
                                />
                            </View>       
                    }
                </Pressable>
                <View className='pt-4'>
                    <Text className="text-white text-xs">{!showQr ? 'Tab to show Kosto QR' : 'Tab to refresh QR'}</Text>
                </View>
            </View>
            <View className='pb-20'>
                <VoucherSimple title='Total Voucher' />
            </View>
        </SafeAreaView>
    );
}

export default ShowCodeScreen;