import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

interface PermissionsProps {
    message: string
}

const PermissionsRequest = ({ message }: PermissionsProps) => {
    return (
        <View className='flex-1 justify-center items-center'>
            <View className='justify-center items-center space-y-4'>
                <ActivityIndicator size={16} />
                <Text className='text-black text-sm self-center'>
                    {message}
                </Text>
            </View>
        </View>
    );
}

export default PermissionsRequest;