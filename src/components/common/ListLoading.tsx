import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import colors from 'tailwindcss/colors';

interface ListLoadingProps {
    isLoading: boolean
}

const ListLoading = ({isLoading} : ListLoadingProps) => {
    return (
        <View className='justify-center items-center'>
            <ActivityIndicator animating={isLoading} size='small' color={colors.green[500]} />
        </View>
    )
}

export default ListLoading