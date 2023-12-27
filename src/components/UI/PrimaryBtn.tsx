import { 
    View, 
    Text, 
    Pressable,
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface PrimaryBtnProps {
    label: string,
    onPress: () => void,
    disabled: boolean
}

export const PrimaryBtn = ({ label, onPress, disabled } : PrimaryBtnProps) => {
    return (
        <View className='w-full'>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                className={`${disabled && 'opacity-70'}`}
            >
                <LinearGradient
                    colors={['#B6E26B', '#287071']}
                    start={{ x: 0.2, y: 0.3 }}
                    style={styles.button}
                >
                    <Text className="self-center font-semibold text-white text-base">{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>  
    );
}

const styles = StyleSheet.create({
    button: {
        borderTopLeftRadius: 35,
        borderBottomRightRadius: 35,
        paddingVertical: 16
    }
});