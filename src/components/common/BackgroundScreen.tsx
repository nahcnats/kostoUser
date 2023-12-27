import { View, Text, ImageBackground } from 'react-native'
import React from 'react'

interface BackgroundScreenProps {
    children: React.ReactNode
}

const BackgroundScreen = ({ children } : BackgroundScreenProps) => {
    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            resizeMode='cover'
            className='flex-1'
        >
            {children}
        </ImageBackground>
    );
}

export default BackgroundScreen;