import { View, Text } from 'react-native';
import React from 'react';

interface InputContainerProps {
    label: string,
    children: React.ReactNode
}

const InputContainer = ({ label, children }: InputContainerProps) => {
    return (
        <View className="flex-row justify-between items-center space-x-4 my-1">
            <Text className="text-teal-900 text-sm font-bold">{label}</Text>
            {children}
        </View>
    );
}

export default InputContainer;