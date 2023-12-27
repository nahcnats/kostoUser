import {
    View,
    Text,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import AuthHeader from './components/AuthHeader';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';
import OtpInput from '../../components/UI/OtpInput';

import { AuthNavigationParams } from '../../navigators/AuthNavigation';
import { dismissKeyboard, jwtDecrypt } from '../../utils';
import { useDebounce } from '../../hooks';
import { useAppSelector } from "../../store/store";
import { signIn, signInOtp } from '../../services/authServices';
import { logIn } from '../../store/features/auth-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const otpValues = useAppSelector((state) => state.otpReducer.value);
    const [optCode, setOtpCode] = useState('');
    const [counter, setCounter] = useState(60);
    const [clear, setClear] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { debounce } = useDebounce();

    useFocusEffect(useCallback(() => {
        counter > 0 && setTimeout(() => {
            setCounter(counter - 1);
    }   , 1000);
    }, [counter]));

    const resendHandler = async () => {
        try {
            setIsLoading(true);
            setClear(true);

            const payload = {
                CountryCode: otpValues.CountryCode,
                PhoneNumber: otpValues.PhoneNumber,
            }

            await signIn(payload);

            setCounter(60);
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
        try {
            setIsLoading(true);

            const payload = {
                CountryCode: otpValues.CountryCode,
                PhoneNumber: otpValues.PhoneNumber,
                OtpNumber: optCode
            }

            const result = await signInOtp(payload);

            if (!result) return;

            const decoded = jwtDecrypt(result.token);

            if (!decoded) return;

            const dispatchPayload = {
                token: result.token,
                userId: decoded.userId,
                name: decoded.name,
                walletId: decoded.walletId,
                isVerified: decoded.isVerified === 'True' ? true : false,
                countryCode: otpValues.CountryCode,
                phoneNumber: otpValues.PhoneNumber,
            }

            await AsyncStorage.setItem('CREDENTIALS', JSON.stringify(dispatchPayload));

            setIsLoading(false);

            dispatch(logIn(dispatchPayload));
        } catch (err: any) {
            setIsLoading(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Phone number or OTP is incorrect',
                autoClose: 2000,
            });
        }
    }

    return (
        <KeyboardAwareScrollView className='flex-1' onStartShouldSetResponder={dismissKeyboard}>
            <BackgroundScreen>
                <SafeAreaView className='flex-1'>
                    <AuthHeader />
                    <View
                        className='flex-1 bg-white p-8'
                        style={{
                            borderTopLeftRadius: 80,
                            borderTopRightRadius: 80,
                        }}
                    >
                        <View className='justify-between'>
                            <View>
                                <Text className='text-2xl text-black font-bold self-center'>{t('optScreen.verification')}</Text>
                                <View className='my-1' />
                                <Text className='text-xs text-black self-center'>{t('optScreen.description')} <Text className="text-colors-new-3">{otpValues.CountryCode} {otpValues.PhoneNumber}</Text></Text>
                            </View>
                            <View className='mt-8'>
                                <OtpInput 
                                    otpCodeChanged={(otpCode) => setOtpCode(otpCode)} 
                                    clear={clear}
                                    cleared={() => setClear(true)}
                                    secureTextEntry={false}
                                />
                                <View className='pt-4'>
                                    {
                                        counter > 0
                                            ? <Text className="text-colors-new-3 text-sm font-semibold self-center">({counter})s</Text>
                                            : <Text className="text-colors-new-3 text-sm font-semibold self-center" onPress={resendHandler}>{t('optScreen.buttons.resend')}</Text>
                                    }
                                </View>
                                <View className='flex-1 mt-24'>
                                    <PrimaryBtn 
                                        label={t('optScreen.buttons.login')}
                                        onPress={() => debounce(submitHandler)} 
                                        disabled={isLoading}
                                    />
                                    <View className='pt-4'>
                                        <TouchableOpacity
                                            onPress={() => navigation.goBack()}
                                        >
                                            <Text className='text-red-500 text-base font-semibold self-center'>{t('optScreen.buttons.cancel')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </BackgroundScreen>
        </KeyboardAwareScrollView>
    );
}

export default OtpScreen;