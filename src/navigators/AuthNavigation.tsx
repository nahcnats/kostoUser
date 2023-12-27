import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { 
    LoginScreen,
    OtpScreen,
    SignUpScreen
} from "../screens/auth";

import { BackHeader } from "../components/common";

export type AuthNavigationParams = {
    Login: undefined,
    Otp: undefined,
    SignUp: undefined
}

const Stack = createStackNavigator<AuthNavigationParams>();

export default function () {
    const defaultNavOptions = {
        headerStyle: {
            backgroundColor: 'transparent'
        },
        headerShadowVisible: false,
        ...TransitionPresets.SlideFromRightIOS
    }

    return (
        <Stack.Navigator
            initialRouteName='Login'
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='Otp'
                component={OtpScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='SignUp'
                component={SignUpScreen}
                options={{
                    headerTitle: "",
                    headerLeft: () => <BackHeader inverted={true} />,
                    headerBackTitleVisible: false,
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
}