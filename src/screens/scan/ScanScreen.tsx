import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from "tailwindcss/colors";
import { AntDesign } from '@expo/vector-icons';

import { IS_ANDROID } from '../../utils';
import { Text } from 'react-native';
import { ScanCodeScreen, ShowCodeScreen } from './tabs';

export type ScanTabParams = {
    ScanCode: undefined,
    ShowCode: undefined,
}

const Tab = createBottomTabNavigator<ScanTabParams>();
const iconSize = 24;
const iconActive = colors.green[700];
const iconInactive = colors.gray[400];

export const ScanScreen = () => {
    return (
        <Tab.Navigator
            initialRouteName='ScanCode'
            backBehavior='history'
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: [
                    {
                        position: 'absolute',
                        borderTopWidth: 0,
                        borderTopColor: 'transparent',
                        borderTopStartRadius: 20,
                        borderTopEndRadius: 20,
                        backgroundColor: colors.green[100],
                        overflow: 'hidden',
                    },
                    IS_ANDROID ? { height: 55, paddingBottom: 5 } : { height: 90, paddingTop: 2 },
                ],
                tabBarLabelPosition: 'below-icon',
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: {
                    borderBottomWidth: 0,
                    borderBottomColor: 'transparent',
                    backgroundColor: 'transparent',
                },
                headerTitleStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#347780',
                },
                headerTitleAlign: 'center'
            }}
        >
            <Tab.Screen
                name='ScanCode'
                component={ScanCodeScreen}
                options={{
                    headerTitle: "Scan QR",
                    tabBarIcon: ({ focused }) => (<AntDesign name="scan1" size={iconSize} color={focused ? iconActive : iconInactive} />),
                    tabBarLabel: ({ focused }) => {
                        return <Text className={`text-xs ${focused ? 'text-green-800 font-medium' : 'opacity-50'}`}>Scan QR</Text>
                    }
                }}
            />
            <Tab.Screen
                name='ShowCode'
                component={ShowCodeScreen}
                options={{
                    headerTitle: "Show QR",
                    tabBarIcon: ({ focused }) => (<AntDesign name="qrcode" size={iconSize} color={focused ? iconActive : iconInactive} />),
                    tabBarLabel: ({ focused }) => {
                        return <Text className={`text-xs ${focused ? 'text-green-800 font-medium' : 'opacity-50'}`}>Show QR</Text>
                    }
                }}
            />
        </Tab.Navigator>
    );
}