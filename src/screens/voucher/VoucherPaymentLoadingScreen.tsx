import { 
    SafeAreaView,
    ScrollView,
    View, 
    Text, 
    ActivityIndicator,
    BackHandler,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import WebView from 'react-native-webview';
import { ALERT_TYPE, Toast, Dialog } from 'react-native-alert-notification';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector } from '../../store/store';
import { MainNavigationParams } from '../../navigators/MainNavigation';
import { BASE_URL, IS_ANDROID } from '../../utils';
import { walletTopUp } from '../../services/walletServices';

import { Error500 } from '../../components/common';

type Props = StackScreenProps<MainNavigationParams, 'VoucherPaymentLoading'>;

const VoucherPaymentLoadingScreen = ({ route } : Props) => {
    const { token, userId } = useAppSelector((state) => state.authReducer.value);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const webViewRef = useRef<WebView>(null);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [webviewSource, setWebviewSource] = useState<{uri: string}>();
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const { amount } = route.params;

    const goBack = () => {
        navigation.goBack();
        Dialog.hide();
    }

    const onPressLeft = () => {
        if (canGoBack) {
            webViewRef.current?.goBack();
        } else {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: 'Are you sure you want to leave this page? You might lose your progress',
                button: 'Yes',
                onPressButton: () => goBack()
            });
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                onPressLeft();
                return true;
            }
        );
        return () => backHandler.remove();
    }, [canGoBack]);

    useEffect(() => {
        let socketVar = null as Socket | null;
        if (userId) {
            if (socket) {
                console.log(
                    'socket already initialized',
                    socket,
                    socket.connected
                );
                if (!socket.connected) {
                    console.log('socket disconnected!!!');
                }
            }
            if (!socket) {
                console.log('initing socket');
                let _socket = io(BASE_URL);
                setSocket(_socket);
                socketVar = _socket;
            }
        }

        return () => {
            socketVar?.disconnect();
        };
    }, []);

    const getSocket = () => {
        try {
            if (socket) {
                // socket.on('connect', () => {
                //     console.log('socket connected', socket.id); // x8WIv7-mJelg7on_ALbx
                // });

                socket.emit('user:join', { userId: userId });

                socket.on('wallet-transaction:created', (message) => {
                    let transactionId = message.TransactionId;

                    navigation.replace('VoucherPurchaseSuccess', {
                        walletTransactionId: transactionId,
                    });
                });
            }
        } catch (err: any) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err,
                autoClose: 2000,
            });

            return <Error500 />;
        }
    }

    useEffect(() => {
        getSocket();
    }, [socket, userId]);

    const submit = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    Amount: amount,
                    TransactionType: 4,
                    AttachmentId: '',
                    ToWalletId: '',
                    FromType: 0,
                    ToType: 0,
                    ActionBankInfo: 'Top Up',
                }
            };
            
            const result = await walletTopUp(payload);

            if (!result) return;

            setWebviewSource({uri: result?.redirectUrl});
        } catch (err: any) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: err.message,
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        submit();
    }, []);

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView
                className='w-full'
                contentContainerStyle={{ flexGrow: 1}}
            >
                <View className={`w-full h-[60px] flex flex-row justify-between items-center ${IS_ANDROID && 'mt-8'}`}>
                    <TouchableOpacity onPress={onPressLeft}>
                        <Ionicons
                            style={{ marginLeft: 12, marginRight: 12 }}
                            name="arrow-back"
                            size={30}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
                {
                    !webviewSource
                        ? <>
                            <ActivityIndicator />
                            <Text className='text-lg text-gray-600 self-center'>Processing</Text>
                        </> : null
                }
                {
                    webviewSource
                        ? <WebView
                            ref={webViewRef}
                            style={{ flex: 1 }}
                            source={webviewSource}
                            onMessage={(event) => {
                            }}
                            onNavigationStateChange={(event) => {
                                if (event.canGoBack) {
                                    setCanGoBack(true);
                                } else {
                                    setCanGoBack(false);
                                }
                            }}
                            originWhitelist={['*']}
                            allowsInlineMediaPlayback
                            allowsBackForwardNavigationGestures
                            javaScriptEnabled
                            scalesPageToFit
                            mediaPlaybackRequiresUserAction={false}
                            // javaScriptEnabledAndroid
                            // useWebkit
                            startInLoadingState={true}
                        /> : null
                }
            </ScrollView>
        </SafeAreaView>
    );
}

export default VoucherPaymentLoadingScreen;