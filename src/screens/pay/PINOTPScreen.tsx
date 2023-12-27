import { View, Text, KeyboardAvoidingView } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import OtpInput from '../../components/UI/OtpInput';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';
import { Loading } from '../../components/common';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { useAppSelector } from '../../store/store';
import { dismissKeyboard, IS_ANDROID } from '../../utils';
import { useDebounce } from '../../hooks';
import { getResetPINOTP } from '../../services/walletServices';

type Props = StackScreenProps<MainNavigationParams, 'PINOTP'>;

const PINOTPScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const { token, countryCode, phoneNumber } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();

    const { type } = route.params;
    const [counter, setCounter] = useState(60);
    const [otpCode, setOtpCode] = useState('');
    const [clear, setClear] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isloading, setIsLoading] = useState(false);

    const getOTP = async () => {
        try {
            setIsLoading(true);

            await getResetPINOTP({ token: token });
            setIsLoading(false);
        } catch (err: any) {
            setIsLoading(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.response.data ? err.response.data.message : 'Error getting OTP',
                autoClose: 2000,
            });
        }
    }

    useEffect(() => {
        getOTP();
    }, []);

    useEffect(() => {
        counter > 0 && setTimeout(() => {
            setCounter(counter - 1);
        }, 1000);
    }, [counter]);

    const resendHandler = async () => {
        if (isloading) return;

        try {
            setIsLoading(true);
            setClear(true);

            getOTP();
            setIsLoading(false);

        } catch (err: any) {
            setIsLoading(false);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    };

    const submitHandler = async () => {
        if (otpCode.length !== 6) return;

        if (type === 'register') {
            navigation.replace('RegisterPIN', { otpCode: otpCode })
        } else {
            navigation.replace('ForgotPIN', { otpCode: otpCode });
        }
    }

    if (isloading) {
        return (
            <BackgroundScreen>
                <Loading />
            </BackgroundScreen>
        );
    }
    
    return (
        <BackgroundScreen>
            <View className='flex-1 justify-center' onStartShouldSetResponder={dismissKeyboard}>
                <KeyboardAvoidingView
                    behavior={IS_ANDROID ? 'height' : 'padding'}
                    onStartShouldSetResponder={dismissKeyboard}
                >
                    <View
                        className='h-[360] bg-white justify-center p-8 mx-4'
                        style={{
                            borderTopStartRadius: 20,
                            borderTopEndRadius: 20,
                            borderBottomStartRadius: 20,
                            borderBottomEndRadius: 20
                        }}
                    >
                        <View className='flex-1 justify-between'>
                            <View>
                                <Text className="text-gray-800 text-2xl text-center font-semibold">
                                    PIN OTP
                                </Text>
                                <View className='py-1' />
                                <Text className='text-xs text-black self-center'>{t('optScreen.description')} <Text className="text-colors-new-3">{countryCode} {phoneNumber}</Text></Text>
                                <View className='py-6' />
                                <View className='h-[50]'>
                                    <OtpInput
                                        otpCodeChanged={(otpCode) => setOtpCode(otpCode)}
                                        clear={clear}
                                        cleared={() => setClear(true)}
                                        secureTextEntry={false}
                                    />
                                </View>
                                <View className='pt-4'>
                                    {
                                        counter > 0
                                            ? <Text className="text-colors-new-3 text-sm font-semibold self-center">({counter})s</Text>
                                            : <Text className="text-colors-new-3 text-sm font-semibold self-center" onPress={resendHandler}>{t('optScreen.buttons.resend')}</Text>
                                    }
                                </View>
                            </View>
                            <PrimaryBtn
                                label='Confirm'
                                onPress={() => debounce(submitHandler)}
                                disabled={submitting}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView> 
            </View>
        </BackgroundScreen>
    );
}

export default PINOTPScreen;