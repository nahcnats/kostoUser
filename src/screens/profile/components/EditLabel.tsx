import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

interface EditLabelProps {
    dataValue: string,
    onEditPress: () => void,
    show: boolean,
    isUpperCase?: boolean
}

export const EditLabel = ({ dataValue, onEditPress, show, isUpperCase }: EditLabelProps) => {
    if (!show) return;

    return (
        <View className="flex-row items-center space-x-2">
            <Text className='text-[#58966F] text-sm font-semibold'>
                {isUpperCase ? dataValue.toUpperCase() : dataValue}
            </Text>
            <TouchableOpacity
                onPress={onEditPress}
            >
                <Entypo name='edit' size={14} color={colors.green[800]} />
            </TouchableOpacity>
        </View>
    );
}