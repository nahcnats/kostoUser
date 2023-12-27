import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from 'tailwindcss/colors';
import { Ionicons } from '@expo/vector-icons';

interface BackHeaderProps {
    inverted: boolean
}

export default function BackHeader({ inverted }: BackHeaderProps) {
    const navigation = useNavigation();

    return (
        <View className="ml-3">
            <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-circle" size={34} color={inverted ? colors.white : colors.green[500]} />
            </Pressable>
        </View>
    );
}