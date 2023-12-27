import { 
    View, 
    SafeAreaView, 
    Text, 
    TouchableOpacity,
     Linking 
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    BottomSheetModal,
    useBottomSheetModal,
    BottomSheetFlatList
} from '@gorhom/bottom-sheet';
import { ALERT_TYPE, Toast, Dialog } from 'react-native-alert-notification';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Controller,
    FormProvider,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import { Entypo, Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Checkbox from 'expo-checkbox';

import BackgroundScreen from '../../components/common/BackgroundScreen';
import { PrimaryBtn } from '../../components/UI/PrimaryBtn';
import { RegisterTextInput } from './components/RegisterTextInput';
import { DateSelector } from './components/DateSelector';
import OptionSelector from './components/OptionSelector';
import InputContainer from './components/InputContainer';
import ModalBottomsheet from '../../components/bottomSheet/ModalBottomsheet';

import { AuthNavigationParams } from '../../navigators/AuthNavigation';
import { IS_ANDROID, dismissKeyboard } from '../../utils';
import { countryCodes } from './components/countryCodes';
import { genderCodes } from '../profile/components';
import { useDebounce } from '../../hooks';
import { AppDispatch, useAppSelector } from '../../store/store';
import { registerFormSchema } from './components/registerFormSchema';
import { register, registerParams } from '../../services/authServices'
import { registerUser } from '../../store/features/signUp-slice';

type TRegisterFormSchema = z.infer<typeof registerFormSchema>;
type TOptions = {
    code: string,
    name: string,
}

interface OptionProps {
    itemcurrentUser: TOptions,
}

const SignUpScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const { debounce } = useDebounce();
    const dispatch = useDispatch<AppDispatch>();

    const [showOptions, setShowOptions] = useState(false);
    const [showCountryOptions, setCountryOptions] = useState(false);
    const [showCountryGender, setGenderOptions] = useState(false);

    const [options, setOptions] = useState<TOptions[]>([]);
    const [showDefault, setShowDefault] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCalendarOpenForAndroid, setIsCalendarOpenForAndroid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<TRegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            countryCode: '+60',
            phoneNumber: '',
            birthday: new Date(),
            gender: 'male',
            referralCode: '',
        }
    });

    const closeBottomSheet = useCallback(() => {
        setCountryOptions(false);
        setGenderOptions(false);

        dismiss();
    }, [showOptions]);

    const handleBottomSheetChanges = useCallback((modalFor: string) => {
        if (modalFor === 'country') {
            setCountryOptions(v => !v);
        } else {
            setGenderOptions(v => !v);
        }
        
        if (showCountryOptions || showCountryOptions) {
            dismiss();
        } else {
            bottomSheetRef.current?.present();
        }
    }, [showOptions]);

    const onSubmit: SubmitHandler<TRegisterFormSchema> = async (data) => {
        if (!isChecked) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please agree to the terms and conditions',
                autoClose: 2000,
            });

            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                params: {
                    Name: data.name,
                    Gender: data.gender === 'male' ? 0 : 1,
                    CountryCode: data.countryCode,
                    PhoneNumber: data.phoneNumber,
                    ReferredBy: data.referralCode,
                    Email: data.email,
                    Birthday: moment(data.birthday).format('YYYY-MM-DD')
                } 
            } as registerParams;

            await register(payload);

            dispatch(registerUser({
                CountryCode: data.countryCode,
                PhoneNumber: data.phoneNumber
            }));
            
            setIsLoading(false);

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Congratulations Register Success',
                textBody: 'Please Login to enjoy Your Reward',
                button: 'Continue',
                onPressButton: () => {
                    Dialog.hide();

                    navigation.navigate('Login');
                },
            });
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

    const OptionItem = ({ itemcurrentUser }: OptionProps) => {
        const defaultCode = showDefault === 'country' ? methods.getValues().countryCode : methods.getValues().gender;

        return (
            <View className='flex-row space-x-2'>
                {
                    defaultCode === itemcurrentUser.code 
                        ? <Entypo name='check' size={16} color={colors.green[700]}  /> 
                        : null
                }
                <TouchableOpacity
                    onPress={() => {
                        showDefault === 'country' 
                            ? methods.setValue('countryCode', itemcurrentUser.code)
                            : methods.setValue('gender', itemcurrentUser.code);
                        handleBottomSheetChanges(showDefault);
                    }}
                >
                    <Text>{itemcurrentUser.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    return ( 
        <BackgroundScreen>
            <SafeAreaView>
                <View className='mt-12 mb-8'>
                    <Text className='text-white text-2xl font-bold self-center'>Welcome</Text>
                </View>
            </SafeAreaView>
            <View 
                className='flex-1 bg-white px-8'
                style={{
                    borderTopLeftRadius: 80,
                    borderTopRightRadius: 80,
                    overflow: 'hidden'
                }}
            >
                <KeyboardAwareScrollView className='flex-1' showsVerticalScrollIndicator={false} onStartShouldSetResponder={dismissKeyboard}>
                    <View>
                        <View className='mt-4 mb-8'>
                            <Text className='text-green-800 text-lg font-bold self-center'>Register</Text>
                        </View>
                        <View className='flex-1 justify-between'>
                            <View>
                                <Controller
                                    control={methods.control}
                                    name='name'
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <RegisterTextInput
                                                label='Name'
                                                autoFocus={true}
                                                placeholder='Your name'
                                                onBlur={onBlur}
                                                value={value}
                                                onChangeText={onChange}
                                                errorMessage={error?.message}
                                            />
                                        )
                                    }}
                                />
                                <Controller
                                    control={methods.control}
                                    name='email'
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <RegisterTextInput
                                                label='Email'
                                                placeholder='Enter valid email'
                                                onBlur={onBlur}
                                                value={value}
                                                onChangeText={onChange}
                                                errorMessage={error?.message}
                                            />
                                        )
                                    }}
                                />
                                <Controller
                                    control={methods.control}
                                    name='phoneNumber'
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <RegisterTextInput
                                                label='Phone'
                                                placeholder='Enter your phone number'
                                                onBlur={onBlur}
                                                value={value}
                                                onChangeText={onChange}
                                                errorMessage={error?.message}
                                            >
                                                <OptionSelector 
                                                    onPress={() => {
                                                        let codes = [] as TOptions[];
                                                        countryCodes.map((item: any) => {
                                                            codes.push({ code: item.countryCode, name: item.country })
                                                        });

                                                        setShowDefault('country');
                                                        handleBottomSheetChanges('country');
                                                        setOptions(codes);
                                                    }}
                                                    showOptions={showOptions}
                                                />
                                            </RegisterTextInput>
                                        )
                                    }}
                                />
                                <Controller
                                    control={methods.control}
                                    name='birthday'
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <View>
                                                <DateSelector
                                                    label='Date of Birth'
                                                    value={moment(value).format('DD-MM-YYYY')}
                                                    onPressCalendar={() => {
                                                        if (IS_ANDROID) {
                                                            setIsCalendarOpenForAndroid(true);
                                                        }
                                                    }}
                                                    errorMessage={error?.message}
                                                />
                                                {
                                                    (isCalendarOpenForAndroid || !IS_ANDROID) && (
                                                        <View className={`${!IS_ANDROID && 'pb-8'}`}>
                                                            <RNDateTimePicker
                                                                value={value}
                                                                mode='date'
                                                                display={!IS_ANDROID ? 'inline' : 'default'}
                                                                onChange={(e) => {
                                                                    if (IS_ANDROID) {
                                                                        setIsCalendarOpenForAndroid(false);
                                                                    }

                                                                    if (e.type === 'set' && e.nativeEvent.timestamp) {
                                                                        const newDate = new Date(e.nativeEvent.timestamp)

                                                                        onChange((new Date(newDate)));
                                                                    }

                                                                    methods.trigger('birthday');

                                                                    if (IS_ANDROID) {
                                                                        dismissKeyboard()
                                                                    }
                                                                }}
                                                            />
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        )
                                    }}
                                />
                                <Controller
                                    control={methods.control}
                                    name='gender'
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <RegisterTextInput
                                                label='Gender'
                                                onBlur={onBlur}
                                                value={genderCodes.filter(item => value === item.code)[0].name}
                                                onChangeText={onChange}
                                                editable={false}
                                                errorMessage={error?.message}
                                            >
                                                <OptionSelector
                                                    onPress={() => {
                                                        setShowDefault('gender');
                                                        handleBottomSheetChanges('gender');
                                                        setOptions(genderCodes);
                                                    }}
                                                    showOptions={showOptions}
                                                />
                                            </RegisterTextInput>
                                        )
                                    }}
                                />
                                <Controller
                                    control={methods.control}
                                    name='referralCode'
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <RegisterTextInput
                                                label='Referral'
                                                placeholder='Enter referral code'
                                                onBlur={onBlur}
                                                value={value}
                                                onChangeText={onChange}
                                                errorMessage={error?.message}
                                            />
                                        )
                                    }}
                                />
                            </View>
                            <View className="flex flex-row justify-start items-center bg-white overflow-hidden mt-4 mb-4 shadow-md">
                                <Checkbox
                                    className="p-3 mr-4"
                                    value={isChecked}
                                    onValueChange={setIsChecked}
                                />
                                <View className="flex-1">
                                    <Text className="text-xs text-new-7">
                                        I agree and accept the <Text className='text-sky-700 text-xs' onPress={() => Linking.openURL('https://kostopremio.com/index.php/privacy-policy')}>Terms & Condition</Text> and <Text className='text-sky-700 text-xs' onPress={() => Linking.openURL('https://kostopremio.com/index.php/privacy-policy-2/')}>Privacy Policy</Text>
                                    </Text>
                                </View>
                            </View>
                            <View className='flex-1 mt-8 mb-12'>
                                <PrimaryBtn
                                    label='Confirm'
                                    disabled={isLoading}
                                    onPress={
                                        () => debounce(methods.handleSubmit(onSubmit))
                                    }
                                />
                            </View>

                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <ModalBottomsheet
                ref={bottomSheetRef}
                onClose={closeBottomSheet}
                customSnapPoints={snapPoints}
            >
                <BottomSheetFlatList
                    data={options}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => <OptionItem itemcurrentUser={item} />}
                    ItemSeparatorComponent={() => <View className='my-2' />}
                    contentContainerStyle={{
                        padding: 32
                    }}
                />
            </ModalBottomsheet>
        </BackgroundScreen> 
    );
}

export default SignUpScreen;