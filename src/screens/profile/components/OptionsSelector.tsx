import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

interface OptionsSelectorProps {
    onPressOptions: () => void,
    value: string,
    showDetail: boolean

}

const OptionsSelector = ({ onPressOptions, value, showDetail }: OptionsSelectorProps) => {
    return (
        <Pressable
            className='flex-row space-x-2'
            onPress={() => onPressOptions}
        >
            <Text className='text-[#58966F] text-sm font-semibold'>{value}</Text>
            <View>
                <Ionicons name={!showDetail ? 'caret-down' : 'caret-up'} size={18} color={colors.green[700]} />
            </View>
        </Pressable>
    );
}

export default OptionsSelector;