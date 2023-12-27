import { 
    Text, 
    View, 
    ScrollView, 
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Image
} from "react-native"
import { useNavigation } from "@react-navigation/native";

import BackgroundScreen from "../../components/common/BackgroundScreen";
import { 
    HomeHeader,
    MerchantsWidget 
} from "./components";
import { BlockWidget } from '../../components/widget';

import { useAppSelector } from "../../store/store";
import { useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainNavigationParams } from "../../navigators/MainNavigation";

import Artboard_23 from '../../assets/svg/Artboard_23.svg';

export const HomeScreen = () => {
    const auth = useAppSelector((state) => !!state.authReducer.value.token);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    return (
        <BackgroundScreen>
            <HomeHeader />
            <View className="flex-1 bg-white rounded-t-3xl py-6">
                <SafeAreaView className="flex-1">
                    <Image
                        source={require('../../assets/images/spendearn.png')}
                        style={{
                            height: 60,
                            width: '100%'
                        }}
                    />
                    <View className="flex-1 py-4">
                        <BlockWidget />
                        <MerchantsWidget />
                    </View>
                </SafeAreaView>
            </View>
        </BackgroundScreen>
    );
}