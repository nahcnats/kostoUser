import React from 'react';
import {
    TextInput as RNTextInput,
    Text,
    TextInputProps,
    View,
} from 'react-native';
import { IS_ANDROID } from '../../../utils';

interface Props extends TextInputProps {
    errorMessage?: string;
}

export const CustomTextInput = ({ errorMessage, ...textInputProps } : Props) => {
    return (
        <View className='flex-1 ml-16 justify-end'>
            <RNTextInput
                className={`flex-1 border border-gray-200 rounded-md ${IS_ANDROID ? 'py-[2] px-[6]' : 'p-[6]'}`}
                autoCorrect={false}
                autoCapitalize="none"
                {...textInputProps}
            />
            {!!errorMessage && (
                <Text className='text-red-500 text-sm'>{errorMessage}</Text>
            )}
        </View>
    )
}