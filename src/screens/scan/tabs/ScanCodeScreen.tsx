import { 
    View, 
    SafeAreaView, 
    Pressable,
    StyleSheet,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { 
    Code,
    Camera, 
    useCameraDevice, 
    useCameraPermission, 
    useCodeScanner 
} from 'react-native-vision-camera';
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import DocumentPicker, { types } from 'react-native-document-picker';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { useDispatch } from 'react-redux';

import { Error500, PermissionsRequest } from '../../../components/common';

import { MainNavigationParams } from '../../../navigators/MainNavigation';
import { useAppSelector } from '../../../store/store';
import { VoucherSimple } from '../../../components/widget';
import { getMerchant } from '../../../services/accountServices';
import { setMerchantId } from '../../../store/features/merchant-slice';


const ScanCodeScreen = () => {
    const device = useCameraDevice('back')
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const { MerchantId } = useAppSelector((state) => state.merchantReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { hasPermission, requestPermission } = useCameraPermission();
    const dispatch = useDispatch();

    const [torch, setTorch] = useState(false)
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes: Code[]) => {
            handleBarCodeScanned(codes)
        },
    });

    const validMerchant = async (merchantId: string) => {
        try {
            const payload = {
                token: token,
                params: {
                    id: merchantId,
                }
            }

            const result = await getMerchant(payload);

            return result.merchantId;
        } catch (err: any) {
            setScanned(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    }

    const handleBarCodeScanned = useCallback(async (codes: Code[]) => {
        if (scanned) return;

        const value = codes[0]?.value;
        
        if (value == null) return;

        const isMerchant = await validMerchant(value.split('merchant=')[1]);

        if (!isMerchant || isMerchant === undefined) return;

        dispatch(setMerchantId({
            MerchantId: value.split('merchant=')[1]
        }));

        setScanned(true);
    }, []);

    const documentPickerHandler = async () => {
        try {
            setScanned(true);

            const pickerResult = await DocumentPicker.pickSingle({
                type: [types.images, types.pdf]
            });

            if (!pickerResult) {
                setScanned(false);
                return;
            }

            const value = await BarCodeScanner.scanFromURLAsync(pickerResult.uri);
            const isMerchant = await validMerchant(value[0].data.split('merchant=')[1]);

            if (!isMerchant || isMerchant === undefined) {
                setScanned(false);
                return;
            }

            dispatch(setMerchantId({
                MerchantId: value[0].data.split('merchant=')[1]
            }));

            setScanned(false);
        } catch (err: any) {
            setScanned(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err,
                autoClose: 2000
            });
        }
    }

    useEffect(() => {
        if (!scanned) return;

        if (MerchantId === '' || MerchantId === null || MerchantId === undefined) return;

        navigation.navigate('Payform');
        
    }, [scanned]);

    if (!hasPermission) return <Error500 message='No access to camera' />;

    return (
        <SafeAreaView className="flex-1">
            <View className='flex-1 justify-center items-center m-4'>
                {
                    device
                        ? <Camera
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                            codeScanner={codeScanner}
                            torch={torch ? 'on' : 'off'}
                            enableZoomGesture={true}
                        />
                        : <PermissionsRequest message='No access to camera' />
                } 
            </View>
            <View className={`flex-row ${hasPermission ? 'justify-around' : 'justify-center'} items-center mb-8`}>
                {
                    hasPermission && <Pressable
                        onPress={() => setTorch(v => !v)}
                        style={styles.icons}
                    >
                        <Ionicons name={torch ? 'flash-off' : 'flash'} size={24} color={styles.icons.color} />
                    </Pressable>
                }
                <Pressable
                    onPress={documentPickerHandler}
                    style={styles.icons}
                >
                    <Ionicons name="image" size={24} color={styles.icons.color} />
                </Pressable>
            </View>
            <View className='pb-20'>
                <VoucherSimple title='Total Voucher' />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    icons: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 35,
        borderBottomRightRadius: 35,
        height: 46,
        width: 80,
        backgroundColor: colors.green[700],
        color: 'white'
    }
});

export default ScanCodeScreen;