import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

interface InputContainerProps {
    label: string,
    children: React.ReactNode
}

const InputContainer = ({ label, children }: InputContainerProps) => {
    return (
        <View className="w-full max-w-[500px] h-13 flex flex-row justify-between space-x-4 items-center rounded-full bg-red-300 overflow-hidden mb-4 shadow-md" >
            <View className="flex-row space-x-2 w-[120] p-4 rounded-full bg-teal-800">
                <Text className={`w-full rounded-full text-center text-white`}>{label}</Text>
            </View>
            <View className="flex-1 flex-row justify-between items-center pr-3 text-xl bg-green-300">
                {children}
            </View>
        </View >
    );
}

export default InputContainer;