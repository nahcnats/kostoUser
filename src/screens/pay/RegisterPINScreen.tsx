import { View, Text, KeyboardAvoidingView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import OtpInput from '../../components/UI/OtpInput';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { useAppSelector } from '../../store/store';
import { dismissKeyboard, IS_ANDROID } from '../../utils';
import { useDebounce } from '../../hooks';
import { resetPIN } from '../../services/walletServices';

type Props = StackScreenProps<MainNavigationParams, 'RegisterPIN'>;

const RegisterPINScreen = ({ route } : Props) => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();

    const { otpCode } = route.params;
    const [counter, setCounter] = useState(60);
    const [PINCode, setPINCode] = useState('');
    const [clear, setClear] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useFocusEffect(useCallback(() => {
        counter > 0 && setTimeout(() => {
            setCounter(counter - 1);
        }, 1000);
    }, [counter]));

    const submitHandler = async () => {
        if (PINCode.length !== 6) return;

        try {
            setSubmitting(true);

            const payload = {
                token: token,
                params: {
                    PinNumber: PINCode,
                    OtpNumber: otpCode,
                }
            }

            await resetPIN(payload);

            setSubmitting(false);

            navigation.replace('Payform');
        } catch (err: any) {
            setSubmitting(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
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
                                    Register PIN
                                </Text>
                                <View className='py-1' />
                                <Text className='text-gray-700 self-center'>For security reasons, please enter the your new 6-digit pin to secure your account.</Text>
                                <View className='py-6' />
                                <View className='h-[50]'>
                                    <OtpInput
                                        otpCodeChanged={(otpCode) => setPINCode(otpCode)}
                                        clear={clear}
                                        cleared={() => setClear(true)}
                                        secureTextEntry={true}
                                    />
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

export default RegisterPINScreen;