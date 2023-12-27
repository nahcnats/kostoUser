import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { IS_ANDROID } from '../utils';
import { 
    HomeScreen,
    MTScreen,
    ScanScreen,
    HistoryScreen,
    ProfileScreen
} from '../screens';
import { MainNavigationParams } from './MainNavigation';
import MTActive from '../assets/svg/mtActive.svg';
import MTInactive from '../assets/svg/mtInactive.svg';

type BottomTabNavigationParams = {
    HomeTab: undefined,
    MTTab: undefined,
    ScanTab: undefined,
    // QrCodeTab: undefined,
    HistoryTab: undefined,
    ProfileTab: undefined,
}

const BottomTab = createBottomTabNavigator<BottomTabNavigationParams>();
const iconSize = 24;
const iconActive = colors.green[700];
const iconInactive = colors.gray[300];

const BottomNavigation = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    return (
        <BottomTab.Navigator
            initialRouteName='HomeTab'
            backBehavior='history'
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: [
                    {
                        position: 'absolute',
                        borderTopWidth: 0,
                        borderTopColor: "transparent",
                        backgroundColor: 'white',
                        overflow: 'hidden',
                    },
                    IS_ANDROID && { height: 55, paddingBottom: 5 },
                ],
                tabBarLabelPosition: 'below-icon',
                headerShown: false
            }}
        >
            <BottomTab.Screen 
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (<Entypo name="home" size={iconSize} color={focused ? iconActive : iconInactive} />),
                    tabBarLabel: ({ focused }) => {
                        return <Text className={`text-xs ${focused ? 'text-green-800 font-medium' : 'opacity-50'}`}>{t('bottomNavigation.home')}</Text>
                    },
                }}
            />
            <BottomTab.Screen 
                name="MTTab"
                component={MTScreen}
                options={{
                    tabBarIcon: ({ focused }) => (focused ? <MTActive width={iconSize} height={iconSize} /> : <MTInactive width={iconSize} height={iconSize} />),
                    tabBarLabel: ({ focused }) => {
                        return <Text className={`text-xs ${focused ? 'text-green-800 font-medium' : 'opacity-50'}`}>{t('bottomNavigation.mt')}</Text>
                    }
                }}
            />
            <BottomTab.Screen 
                name="ScanTab"
                component={ScanScreen}
                options={{
                    tabBarButton: () => (
                        <Pressable onPress={
                            () => navigation.navigate('ScanScreen')
                        }>
                            <LinearGradient
                                colors={['#B6E26B', '#287071']}
                                start={{ x: 0.2, y: 0.3 }}
                                style={{
                                    borderTopLeftRadius: 25,
                                    borderBottomRightRadius: 25,
                                    width: 100,
                                    height: 55,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <AntDesign name="scan1" size={iconSize + 2} color='white' />
                                <Text className="text-xs text-white font-medium">{t('bottomNavigation.scan')}</Text>
                            </LinearGradient>
                        </Pressable>
                    )
                }}
            />
            <BottomTab.Screen 
                name="HistoryTab"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ focused }) => (<FontAwesome name="history" size={iconSize} color={focused ? iconActive : iconInactive} />),
                    tabBarLabel: ({ focused }) => {
                        return <Text className={`text-xs ${focused ? 'text-green-800 font-medium' : 'opacity-50'}`}>{t('bottomNavigation.history')}</Text>
                    }
                }}
            />
            <BottomTab.Screen 
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (<FontAwesome name="user" size={iconSize} color={focused ? iconActive : iconInactive} />),
                    tabBarLabel: ({ focused }) => {
                        return <Text className={`text-xs ${focused ? 'text-green-800 font-medium' : 'opacity-50'}`}>{t('bottomNavigation.profile')}</Text>
                    }
                }}
            />
        </BottomTab.Navigator>
    );
}

export default BottomNavigation;