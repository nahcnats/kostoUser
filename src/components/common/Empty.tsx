import { View, Text } from 'react-native';
import React from 'react';

interface EmptyProps {
    message: string
}

const Empty = ({ message } : EmptyProps) => {
    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='text-gray-500 text-sm'>{message}</Text>
        </View>
    );
}

export default Empty;