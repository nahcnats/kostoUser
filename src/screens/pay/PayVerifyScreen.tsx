import { View, Text, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { ALERT_TYPE, Toast, Dialog } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import OtpInput from '../../components/UI/OtpInput';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';

import { useAppSelector } from '../../store/store';
import { dismissKeyboard, IS_ANDROID } from '../../utils';
import { useDebounce } from '../../hooks';
import { MainNavigationParams } from '../../navigators/MainNavigation';
import { verifyPin, VerifyPINParams } from '../../services/walletServices';
import { payTransaction, PayTransactionParams } from '../../services/transactionServices';

type Props = StackScreenProps<MainNavigationParams, 'PayVerify'>;

const PayVerifyScreen = ({ route } : Props) => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const { MerchantId } = useAppSelector((state) => state.merchantReducer.value);
    const { transactionId, shopName, productName, amount } = route.params;
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();

    const [PINCode, setPINCode] = useState('');
    const [clear, setClear] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const verifyPaymentPassword = async () => {
        if (PINCode.length !== 6) return;

        try {
            setSubmitting(true);

            const payload = {
                token: token,
                params: {
                    OneTimePassword: PINCode
                }
            } as VerifyPINParams;

            const result = await verifyPin(payload);

            if (!result) {
                setSubmitting(false);
                throw Error;
            }

            submit();
        } catch (err: any) {
            setSubmitting(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message || 'PIN incorrect. Please try again',
                autoClose: 2000,
            });
        }
    };

    const submit = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    TransactionId: transactionId,
                    OneTimePassword: PINCode,
                }
            } as PayTransactionParams;

            await payTransaction(payload);

            navigation.replace('PaySuccess', {
                transactionId: transactionId,
            });
        } catch (err: any) {
            setSubmitting(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message || 'Error in payment',
                autoClose: 2000,
            });
        }
    }
    
    return (
        <BackgroundScreen>
            <View className='flex-1 justify-center' onStartShouldSetResponder={dismissKeyboard}>
                <KeyboardAvoidingView
                    behavior={IS_ANDROID ? 'height' : 'padding'}
                    onStartShouldSetResponder={dismissKeyboard}
                >
                    <View
                        className='h-[440] bg-white justify-center p-8 mx-4'
                        style={{
                            borderTopStartRadius: 20,
                            borderTopEndRadius: 20,
                            borderBottomStartRadius: 20,
                            borderBottomEndRadius: 20
                        }}
                    >
                        <View>
                            <View>
                                <Text className="text-black text-2xl font-semibold text-center p-2 mb-2">
                                    shopname
                                </Text>
                            </View>
                            <View>
                                <Text className="text-green-800 text-2xl text-center font-semibold">
                                    RM99.00
                                </Text>
                            </View>
                        </View>
                        <View className='flex-1 justify-between'>
                            <View className='pt-8'>
                                <Text className="text-gray-800 text-2xl text-center font-semibold">
                                    Verification
                                </Text>
                                <View className='py-1' />
                                <Text className='text-gray-700'>For security reasons, please enter 6-digit PIN to verify your identity</Text>
                            </View>
                            <View className='h-[50]'>
                                <OtpInput
                                    otpCodeChanged={(otpCode) => setPINCode(otpCode)}
                                    clear={clear}
                                    cleared={() => setClear(true)}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View>
                                <PrimaryBtn
                                    label='Confirm'
                                    onPress={() => debounce(verifyPaymentPassword)}
                                    disabled={submitting}
                                />
                                <View className="my-2" />
                                <Text
                                    className='self-center text-[#58966F] font-bold'
                                    onPress={() =>
                                        navigation.navigate('PINOTP', {
                                            type: 'forgot'
                                        })
                                    }
                                >
                                    Forgot PIN?
                                </Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView> 
            </View>
        </BackgroundScreen>
    );
}

export default PayVerifyScreen;