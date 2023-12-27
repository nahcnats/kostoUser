import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import * as SplashScreen from 'expo-splash-screen';

import { persistor, store } from './src/store/store';
import { queryClient, IS_ANDROID } from './src/utils';
import RootNavigation from './src/navigators/RootNavigator';

SplashScreen.preventAutoHideAsync();

function App(): JSX.Element {
  const init = async () => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}> 
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <SafeAreaProvider>
                <GestureHandlerRootView className='flex-1'>
                    <StatusBar translucent backgroundColor={'transparent'} barStyle='dark-content' />
                    <AlertNotificationRoot toastConfig={{ titleStyle: { color: 'red' } }}>
                      <RootNavigation />
                    </AlertNotificationRoot>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
}

export default App;
