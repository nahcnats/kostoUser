import { SafeAreaView, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from "@react-navigation/stack";

import { WalletBalanceWidget } from "../../components/widget";
import { 
    VouchersScreen,
    PaymentsScreen,
    RewardsScreen
} from "./tabs";
import { MainNavigationParams } from "../../navigators/MainNavigation";
import { IS_ANDROID } from "../../utils";

type TopTabNavigationParams = {
    Vouchers: undefined,
    Payments: undefined,
    Rewards: undefined,
}

const TopTab = createMaterialTopTabNavigator();

export const HistoryScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    return (
        <SafeAreaView className="flex-1 ml-2 mr-2">
            <View className={`flex-row justify-between items-center p-4 ${IS_ANDROID && 'mt-8'}`}>
                <View><Text className="text-green-900 text-xl font-bold">History</Text></View>
                <WalletBalanceWidget onPress={() => navigation.push('VoucherPurchase')} />
            </View>
            <TopTab.Navigator
                initialRouteName='Vouchers'
                backBehavior='none'
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: '#58966F',
                        height: 10,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomWidth: 0,
                        borderBottomColor: 'transparent'
                    }
                }}
            >
                <TopTab.Screen
                    name='Vouchers'
                    component={VouchersScreen}
                    options={{
                        tabBarLabel: ({ focused }) => {
                            return <Text className={`text-sm font-bold ${focused ? 'text-green-800' : 'opacity-50'}`}>{t('history.vouchersTab.tabName')}</Text>
                        },
                    }}
                />
                <TopTab.Screen
                    name='Payments'
                    component={PaymentsScreen}
                    options={{
                        tabBarLabel: ({ focused }) => {
                            return <Text className={`text-sm font-bold ${focused ? 'text-green-800' : 'opacity-50'}`}>{t('history.paymentsTab.tabName')}</Text>
                        },
                    }}
                />
                <TopTab.Screen
                    name='Rewards'
                    component={RewardsScreen}
                    options={{
                        tabBarLabel: ({ focused }) => {
                            return <Text className={`text-sm font-bold ${focused ? 'text-green-800' : 'opacity-50'}`}>{t('history.rewardsTab.tabName')}</Text>
                        },
                    }}
                />
            </TopTab.Navigator>
        </SafeAreaView>
    );
}