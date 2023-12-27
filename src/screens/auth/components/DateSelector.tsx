import React, { useState } from 'react';
import {
    Pressable,
    TextInput as RNTextInput,
    Text,
    TextInputProps,
    View,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import { IS_ANDROID } from '../../../utils';

interface Props extends TextInputProps {
    label: string,
    value: string,
    onPressCalendar: () => void,
    errorMessage?: string,
}

export const DateSelector = ({ label, value, onPressCalendar, errorMessage, ...textInputProps } : Props) => {
    return (
        <View className='flex-1 justify-start mb-6'>
            <View className='flex-row justify-between items-center space-x-2 bg-gray-100 rounded-2xl'>
                <View className='rounded-2xl bg-green-700 opacity-80 w-[100] p-2'>
                    <Text className='text-white text-sm font-medium self-center'>{label}</Text>
                </View>
                <View className='flex-row flex-1 justify-between items-center'>
                    <Text className='text-black text-sm'>{value}</Text>
                    {/* <RNTextInput
                        className={`flex-1 ${IS_ANDROID ? 'py-[2] px-[6]' : 'p-[6]'}`}
                        autoCorrect={false}
                        autoCapitalize="none"
                        {...textInputProps}
                    /> */}
                    <Pressable
                        className='mr-4'
                        onPress={onPressCalendar}
                    >
                        <AntDesign name='calendar' size={18} color={colors.green[700]} />
                    </Pressable>
                </View>
            </View>
            
            {!!errorMessage && (
                <Text className='text-red-500 text-sm'>{errorMessage}</Text>
            )}
        </View>
    )
}