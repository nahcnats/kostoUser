import React, { useState, useRef, useMemo, useCallback } from "react";
import { Text, View, SafeAreaView, Linking, TouchableOpacity } from "react-native";
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { StackNavigationProp } from "@react-navigation/stack";
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Controller,
    FormProvider,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheetFlatList, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import moment from "moment";
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import colors from "tailwindcss/colors";

import { Seperator, Loading, Error500 } from "../../components/common";
import ModalBottomsheet from "../../components/bottomSheet/ModalBottomsheet";
import BackgroundScreen from "../../components/common/BackgroundScreen";
import { 
    InputContainer, 
    EditLabel, 
    CustomTextInput,
    OptionsSelector,
    ProfileHeader,
    formSchema ,
    genderCodes,
    getLanguageCodes
} from "./components";
import { BlockWidget } from "../../components/widget";

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { useAppSelector } from "../../store/store";
import { IS_ANDROID, dismissKeyboard, queryClient } from "../../utils";
import { useRefreshOnFocus, useDebounce } from "../../hooks";
import { TUser } from "../../models/account";
import { 
    getUser, 
    updateUser,
    UpdateUserParams,
    updateEmail,
    UpdateEmailParams,
    updateReferredBy,
    UpdateReferredByParams
} from "../../services/accountServices";
import { logOut } from "../../store/features/auth-slice";

type TFormSchema = z.infer<typeof formSchema>;
type TOptions = {
    code: string,
    name: string
}

interface OptionProps {
    itemcurrentUser: TOptions
}

export const ProfileScreen = () => {
    const { t } = useTranslation();
    const { token,  } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const dispatch = useDispatch();
    const { dismiss } = useBottomSheetModal();
    const [showDetail, setShowDetail] = useState(false);
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const { debounce } = useDebounce()

    const {
        isLoading,
        isSuccess,
        isError,
        data: currentUser,
        error: userError,
        refetch
    } = useQuery<TUser, Error>({
        queryKey: ['user'],
        queryFn: () => getUser({
            token: token
        })
    });
    useRefreshOnFocus(refetch);

    const { mutateAsync: updateUserAsync } = useMutation({
        mutationFn: (payload: UpdateUserParams) : Promise<TUser> => updateUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user']
            });
        },
        onError: (err) => {
            throw err;
        }
    });

    const { mutateAsync: updateEmailAsync } = useMutation({
        mutationFn: (payload: UpdateEmailParams) : Promise<TUser> => updateEmail(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user']
            });
        },
        onError: (err) => {
            throw err;
        }
    });

    const { mutateAsync: updateReferredByAsync } = useMutation({
        mutationFn: (payload: UpdateReferredByParams) : Promise<TUser> => updateReferredBy(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user']
            });
        },
        onError: (err) => {
            throw err;
        }
    });

    const methods = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
        values: {
            name: currentUser?.name || '',
            countryCode: currentUser?.countryCode || '',
            phoneNumber: currentUser?.phoneNumber || '',
            language: currentUser?.language || 'en',
            email: currentUser?.email || '',
            isVerified: currentUser?.isVerified || false,
            birthday: currentUser?.birthday || '',
            gender: currentUser?.gender || '',
            referralCode: currentUser?.referralCode || '',
            referredBy: currentUser?.referredBy || ''
        }
    });

    const [focusField, setFocusField] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [options, setOptions] = useState<TOptions[]>([]);
    const [isCalendarOpenForAndroid, setIsCalendarOpenForAndroid] = useState(false);
    
    const toggleIsEdit = (field: string) => {
        setFocusField(field);
        setIsEdit(v => !v);
    }

    const closeBottomSheet = useCallback(() => {
        setShowDetail(false);

        dismiss()
    }, [showDetail]);

    const handleBottomSheetChanges = useCallback(() => {
        setShowDetail(v => !v);

        if (showDetail) {
            dismiss()
        } else {
            bottomSheetRef.current?.present();
        }
    }, [showDetail]);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(methods.getValues().referralCode);
    }

    const OptionItem = ({ itemcurrentUser }: OptionProps) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    methods.setValue('language', itemcurrentUser.code);
                    handleBottomSheetChanges();
                }}
            >
                <Text>{itemcurrentUser.name}</Text>
            </TouchableOpacity>
        )
    }

    const onLogoutPress = () => {
        Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Warning',
            textBody: t('profile.prompt.logOut'),
            button: t('profile.prompt.logOutConfirm'),
            onPressButton: () => {
                Dialog.hide();
                dispatch(logOut());
            },
        });
    };

    const onAccountDeletePress = () => {
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Warning',
            textBody: t('profile.prompt.deleteAccount'),
            button: t('profile.prompt.deleteAccountConfirm'),
            onPressButton: () => {
                Dialog.hide();
                dispatch(logOut());
            },
        });
    };


    const onSubmit: SubmitHandler<TFormSchema> = async (data) => {
        try {
            setIsSubmitting(true);

            const userPayload = {
                token: token,
                params: {
                    name: data.name,
                    gender: data.gender,
                    birthday: moment(data.birthday).format('YYYY-MM-DD'),
                    language: data.language
                }
            }

            await updateUserAsync(userPayload);

            if (data.isVerified) {
                const emailPayload = {
                    token: token,
                    params: {
                        email: data.email
                    }
                }

                await updateEmailAsync(emailPayload);
            }

            if (data.referredBy === '' || data.referredBy === null) {
                const referredByPayload = {
                    token: token,
                    params: {
                        referredBy: data.referredBy
                    }
                }

                await updateReferredByAsync(referredByPayload);
            }
            
            setIsSubmitting(false);
            setIsEdit(false);
        } catch (err: any) {
            setIsSubmitting(false);

            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    }

    if (isLoading) {
        return (
            <BackgroundScreen>
                <Loading />
            </BackgroundScreen>
        );    
    }

    if (isError) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: userError.message,
            autoClose: 2000,
        });

        return <Error500 />;
    }

    return (
        <SafeAreaView className='flex-1'> 
            <KeyboardAwareScrollView onStartShouldSetResponder={dismissKeyboard}>
                <ProfileHeader />
                <BlockWidget />
                <View className="p-4">
                    <FormProvider {...methods}>
                        <Seperator />
                        <InputContainer label='Name'>
                            {
                                !isEdit 
                                    ? 
                                        <EditLabel 
                                            dataValue={currentUser?.name || ''}
                                            onEditPress={() => toggleIsEdit('name')} 
                                            show={true} 
                                        />
                                    : 
                                        <Controller
                                            control={methods.control}
                                            name='name'
                                            render={({
                                                field: { onChange, onBlur, value },
                                                fieldState: { error },
                                            }) => {
                                                return (
                                                    <CustomTextInput
                                                        autoFocus={focusField === 'name' ? true : false}
                                                        placeholder='Your name'
                                                        onBlur={onBlur}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        errorMessage={error?.message}
                                                    />
                                                )
                                            }}
                                        /> 
                            }
                        </InputContainer>
                        <Seperator />
                        <InputContainer label='Phone No.'>
                            <Text className='text-[#58966F] text-sm font-semibold'>{'phoneNumber'}</Text>
                        </InputContainer>
                        <Seperator />
                        <InputContainer label='Language'>
                            {
                            !isEdit 
                                ?
                                    <EditLabel 
                                        dataValue={currentUser?.language.toUpperCase() || ''} 
                                        onEditPress={() => {
                                            toggleIsEdit('language');
                                            handleBottomSheetChanges();
                                            setOptions(getLanguageCodes());
                                        }} 
                                        show={true} 
                                        isUpperCase={true}
                                    />
                                :
                                <OptionsSelector 
                                    onPressOptions={handleBottomSheetChanges}
                                    value={methods.getValues().language.toUpperCase()}
                                    showDetail={showDetail}
                                />
                        }
                        </InputContainer>
                        <Seperator />
                        <InputContainer label={!methods.getValues().isVerified ? 'Verify Email' : 'Email'}>
                            {
                                !isEdit && currentUser?.email
                                    ? 
                                    <EditLabel 
                                        dataValue={currentUser?.email} 
                                        onEditPress={() => toggleIsEdit('email')} 
                                        show={!currentUser?.isVerified} />
                                    :
                                    <Controller
                                        control={methods.control}
                                        name='email'
                                        render={({
                                            field: { onChange, onBlur, value },
                                            fieldState: { error },
                                        }) => {
                                            return (
                                                <CustomTextInput
                                                    autoFocus={focusField === 'email' ? true : false}
                                                    placeholder='Verify your account'
                                                    onBlur={onBlur}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    errorMessage={error?.message}
                                                />
                                            )
                                        }}
                                    /> 
                            }
                        </InputContainer>
                        <Seperator />
                        <InputContainer label='Date of Birth'>
                            {
                                !isEdit
                                    ?
                                    <EditLabel 
                                        dataValue={moment(currentUser?.birthday).format('DD/MM/YYYY') || ''} 
                                        onEditPress={() => {
                                            setIsEdit(v => !v);
                                            
                                            if (IS_ANDROID) {
                                                setIsCalendarOpenForAndroid(true);
                                            }
                                        }} 
                                        show={true} 
                                    /> 
                                    :
                                    <Controller
                                        control={methods.control}
                                        name='birthday'
                                        render={({
                                            field: { onChange, onBlur, value },
                                            fieldState: { error },
                                        }) => {
                                            return (
                                                <>
                                                    {
                                                        IS_ANDROID && 
                                                            <TouchableOpacity
                                                                className="flex-row items-center space-x-2"
                                                                onPress={() => {
                                                                    if (IS_ANDROID) {
                                                                        setIsCalendarOpenForAndroid(true);
                                                                    }
                                                                }}
                                                            >
                                                                <Text
                                                                    className='text-gray-400 text-sm font-semibold'
                                                                >
                                                                    {moment(methods.getValues().birthday).format('DD/MM/YYYY')}
                                                                </Text>
                                                                <Entypo name='edit' size={14} color={colors.green[800]} />
                                                            </TouchableOpacity> 
                                                    }
                                                    {
                                                        (isCalendarOpenForAndroid || !IS_ANDROID) && (
                                                            <RNDateTimePicker
                                                                value={new Date(moment(currentUser?.birthday).format('YYYY-MM-DD')) || Date.now()}
                                                                mode='date'
                                                                display={!IS_ANDROID ? 'calendar' : 'default'}
                                                                onChange={(e) => {
                                                                    if (IS_ANDROID) {
                                                                        setIsCalendarOpenForAndroid(false);
                                                                    }

                                                                    if (e.type === 'set' && e.nativeEvent.timestamp) {
                                                                        const newDate = new Date(e.nativeEvent.timestamp)

                                                                        onChange(new Date(moment(newDate).format('YYYY-MM-DD')));
                                                                    }

                                                                    methods.trigger('birthday');

                                                                    if (IS_ANDROID) {
                                                                        dismissKeyboard()
                                                                    }
                                                                }}
                                                            />
                                                        )
                                                    }
                                                </>
                                            )
                                        }}
                                    /> 

                            }
                        </InputContainer>
                        <Seperator />
                        <InputContainer label='Gender'>
                            {
                            !isEdit 
                                ?
                                <EditLabel 
                                    dataValue={currentUser?.gender || ''} 
                                    onEditPress={() => {
                                        toggleIsEdit('gender');
                                        handleBottomSheetChanges();
                                        setOptions(genderCodes);
                                    }} 
                                    show={true} 
                                    isUpperCase={true}
                                />
                                :
                                <OptionsSelector 
                                    onPressOptions={handleBottomSheetChanges}
                                    value={methods.getValues().gender}
                                    showDetail={showDetail}
                                />
                        }
                        </InputContainer>
                        <Seperator />
                        <InputContainer label='Referral'>
                            <View className='flex-row items-center space-x-3'>
                                <Text className='text-[#58966F] text-sm font-semibold'>{currentUser?.referralCode}</Text>
                                {
                                    currentUser?.referralCode
                                        ?
                                        <TouchableOpacity
                                            onPress={copyToClipboard}
                                        >
                                            <Ionicons name="copy-outline" size={18} color={colors.green[800]} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                        </InputContainer>
                        {
                            currentUser?.referredBy 
                                && (currentUser?.referredBy === '' || currentUser?.referredBy === null)
                                ? null
                                :
                                <>
                                    <Seperator />
                                    <InputContainer label='Invitation Code'>
                                        {
                                            !isEdit
                                                ?
                                                <EditLabel
                                                    dataValue={''}
                                                    onEditPress={() => toggleIsEdit('referredBy')}
                                                    show={true}
                                                />
                                                :
                                                <Controller
                                                    control={methods.control}
                                                    name='referredBy'
                                                    render={({
                                                        field: { onChange, onBlur, value },
                                                        fieldState: { error },
                                                    }) => {
                                                        return (
                                                            <CustomTextInput
                                                                autoFocus={focusField === 'referredBy' ? true : false}
                                                                placeholder='Referred by'
                                                                onBlur={onBlur}
                                                                value={value}
                                                                onChangeText={onChange}
                                                                errorMessage={error?.message}
                                                            />
                                                        )
                                                    }}
                                                /> 

                                        }
                                    </InputContainer>
                                </>
                        }
                        <Seperator />
                        <View className="space-y-1 my-1">
                            <Text
                                className="text-sky-500 font-bold"
                                onPress={() => Linking.openURL('https://kostopremio.com/index.php/privacy-policy-2')}
                            >
                                Privacy Policy
                            </Text>
                        </View>
                        <Seperator />
                        <View className="space-y-1 my-1">
                            <Text
                                className="text-sky-500 font-bold"
                                onPress={() => Linking.openURL('https://kostopremio.com/index.php/privacy-policy')}
                            >
                                Term & Condition
                            </Text>
                        </View>
                        <View className="items-center pt-12 pb-16">
                            {
                                isEdit
                                    ? 
                                    <View className="flex-row justify-center items-center space-x-8">
                                        <TouchableOpacity
                                            className="w-[120] flex-row justify-center items-center bg-red-500 rounded-lg space-x-2 p-4"
                                            onPress={() => setIsEdit(v => !v)}
                                        >
                                            <Entypo name='squared-cross' size={18} color={colors.white} />
                                            <Text className="text-white text-sm font-semibold">Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className={`w-[120] flex-row justify-center items-center bg-green-600 rounded-lg space-x-2 p-4 ${isSubmitting && 'opacity-50'}`}
                                            disabled={isSubmitting}
                                            onPress={
                                                () => debounce(methods.handleSubmit(onSubmit))
                                            }
                                        >
                                            <AntDesign name='edit' size={18} color={colors.white} />
                                            <Text className="text-white text-sm font-semibold">Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View>
                                        <View className="flex-row justify-evently items-center space-x-8">
                                            <TouchableOpacity
                                                className="w-[160] flex-row justify-center items-center bg-amber-500 rounded-lg space-x-2 p-4"
                                                onPress={onLogoutPress}
                                            >
                                                <AntDesign name='logout' size={18} color={colors.white} />
                                                <Text className="text-white text-sm font-semibold">Sign Out</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className={`w-[160] flex-row justify-center items-center bg-red-500 rounded-lg space-x-2 p-4 ${isSubmitting && 'opacity-50'}`}
                                                onPress={onAccountDeletePress}
                                            >
                                                <AntDesign name='poweroff' size={18} color={colors.white} />
                                                <Text className="text-white text-sm font-semibold">Delete Account</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            }
                        </View>
                    </FormProvider>
                </View>
            </KeyboardAwareScrollView>
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
        </SafeAreaView>
    );
}