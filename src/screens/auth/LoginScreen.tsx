import { 
    View, 
    Text, 
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    BottomSheetModal,
    useBottomSheetModal,
    BottomSheetFlatList
} from '@gorhom/bottom-sheet';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useDispatch } from 'react-redux';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import AuthHeader from './components/AuthHeader';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';
import TelephoneInput from './components/TelephoneInput';
import ModalBottomsheet from '../../components/bottomSheet/ModalBottomsheet';

import { AuthNavigationParams } from '../../navigators/AuthNavigation';
import { dismissKeyboard } from '../../utils';
import { countryCodes } from './components/countryCodes';
import { signIn } from '../../services/authServices';
import { useDebounce } from '../../hooks';
import { otpSignIn } from '../../store/features/otp-slice';
import { AppDispatch, useAppSelector } from '../../store/store';

const LoginScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const { CountryCode, PhoneNumber } = useAppSelector((state) => state.signUpReducer.value);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const dispatch = useDispatch<AppDispatch>();
    const { debounce } = useDebounce();

    const [phoneNumber, setPhoneNumber] = useState(PhoneNumber || '');
    const [countryCode, setCountryCode] = useState(CountryCode || '+60');
    const [showOptions, setShowOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const closeBottomSheet = useCallback(() => {
        setShowOptions(false);

        dismiss()
    }, [showOptions]);

    const handleBottomSheetChanges = useCallback(() => {
        setShowOptions(v => !v);

        if (showOptions) {
            dismiss()
        } else {
            bottomSheetRef.current?.present();
        }
    }, [showOptions]);

    const renderItem = (item: any) => {
        return (
            <TouchableOpacity
                className='flex-row items-center space-x-2'
                onPress={() => {
                    setCountryCode(item.countryCode);
                    handleBottomSheetChanges();
                }}
            >
                <Text className='text-sm text-black'>{item.country}</Text>
                <Text className='text-sm text-black'>{item.countryCode}</Text>
            </TouchableOpacity>
        );
    };

    const signInHandler = async () => {
        if (phoneNumber.length < 8 || phoneNumber.charAt(0) === '0') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please enter a valid phone number',
                autoClose: 2000,
            });

            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                CountryCode: countryCode,
                PhoneNumber: phoneNumber,
            }

            await signIn(payload);

            dispatch(otpSignIn({
                CountryCode: countryCode,
                PhoneNumber: phoneNumber
            }));

            setIsLoading(false);

            navigation.navigate('Otp');
        } catch (err: any) {
            setIsLoading(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    }

    return (
        <KeyboardAwareScrollView className='flex-1' onStartShouldSetResponder={dismissKeyboard}>
            <BackgroundScreen>
                <SafeAreaView className='flex-1'> 
                    <View className='flex-1 top-10 left-0'>
                        <AuthHeader />
                        <View
                            className='flex-1 bg-white p-8'
                            style={{
                                borderTopLeftRadius: 80,
                                borderTopRightRadius: 80,
                            }}
                        >
                            <View className='flex-1 justify-between'>
                                <View>
                                    <Text className='text-2xl text-black font-bold self-center'>{t('loginScreen.cash_reward')}</Text>
                                    <View className='my-1' />
                                    <Text className='text-xs text-black self-center'>{t('loginScreen.available')}</Text>
                                </View>
                                <View className='pt-8'>
                                    <TelephoneInput
                                        value={phoneNumber}
                                        onChangeText={(text) => setPhoneNumber(text)}
                                        countryCode={countryCode}
                                        onShowCountries={handleBottomSheetChanges}
                                        showOptions={showOptions}
                                    />
                                    <View className='flex-1 mt-24'>
                                        <PrimaryBtn 
                                            label={t('loginScreen.buttons.login')} 
                                            onPress={() => debounce(signInHandler)} 
                                            disabled={isLoading}
                                        />
                                        <View className='pt-4 pb-4'>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('SignUp')}
                                            >
                                                <Text className='text-colors-new-3 text-base font-semibold self-center'>{t('loginScreen.buttons.sign_up')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </BackgroundScreen>
            <ModalBottomsheet
                ref={bottomSheetRef}
                title='Select your country'
                onClose={closeBottomSheet}
            >
                <BottomSheetFlatList
                    data={countryCodes}
                    keyExtractor={(item) => item.countryCode}
                    renderItem={(obj) => renderItem(obj.item)}
                    ItemSeparatorComponent={() => <View className='my-2' /> }
                    contentContainerStyle={{
                        padding: 32
                    }}
                />
            </ModalBottomsheet>
        </KeyboardAwareScrollView>
    );
}


export default LoginScreen;