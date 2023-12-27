import { Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors = require('tailwindcss/colors');

interface OptionSelectorProps {
    onPress: () => void,
    showOptions: boolean
}

const OptionSelector = ({onPress, showOptions }: OptionSelectorProps) => {
    return (
        <Pressable
            className='mr-4'
            onPress={onPress}
        >
            <Ionicons name={!showOptions ? 'caret-down' : 'caret-up'} size={18} color={colors.green[700]} />
        </Pressable>
    );
}

export default OptionSelector;