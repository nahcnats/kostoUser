import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
import {
    BottomSheetModal,
    useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import colors from 'tailwindcss/colors';

import { useAppSelector } from '../../../store/store';
import { useRefreshOnFocus } from '../../../hooks';
import {
    Empty,
    Seperator,
    Error500,
    Loading,
    ListLoading
} from '../../../components/common';
import ModalBottomsheet from '../../../components/bottomSheet/ModalBottomsheet';
import { PrimaryBtn } from '../../../components/UI/PrimaryBtn';
import { getTransactions, TransactionsParams } from '../../../services/transactionServices';
import { TTransactions } from '../../../models/transactions';

interface HistoryItemProps {
    itemData: TTransactions
}

const PaymentsScreen = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const [showDetail, setShowDetail] = useState(false);
    const snapPoints = useMemo(() => ['65%'], []);
    const [detailData, setDetailData] = useState<TTransactions | null | undefined>(null);

    const payload = {
        token: token,
        params: {
            PageSize: 5,
            SortOrder: 0
        }
    } as TransactionsParams;

    const {
        data,
        error: transactionsError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isError,
        refetch
    } = useInfiniteQuery({
        queryKey: ['transactions'],
        queryFn: ({ pageParam }) => getTransactions(pageParam, payload),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = Object.keys(lastPage).length === payload.params.PageSize ? allPages.length + 1 : undefined;
            return nextPage;
        }
    });
    useRefreshOnFocus(refetch);

    const closeBottomSheet = useCallback(() => {
        setShowDetail(false);

        dismiss()
    }, [showDetail]);

    const handleBottomSheetChanges = useCallback(() => {
        setShowDetail(v => !v);

        if (showDetail) {
            dismiss()
        } else {
            bottomSheetRef.current?.present();
        }
    }, [showDetail]);

    const PaymentItem = ({ itemData }: HistoryItemProps) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    handleBottomSheetChanges();
                    setDetailData(itemData);
                }}
            >
                <View className='flex-row justify-between items-center gap-4'>
                    <Entypo name='ticket' size={30} color={colors.green[800]} />
                    <View className='flex-1'>
                        <View className='flex-1'>
                            <Text className='text-black text-sm font-bold' numberOfLines={1} ellipsizeMode='tail'>{itemData?.productName}</Text>
                        </View>
                        <View className='flex-row justify-between items-center pt-1'>
                            <Text className='text-slate-400 text-sm'>{moment(itemData?.createdDateTime).format('DD MMM, hh:mmA')}</Text>
                            <Text className='text-green-800 text-sm font-bold'>RM{itemData?.amount.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: transactionsError.message,
            autoClose: 2000,
        });

        return <Error500 />;
    }

    return (
        <View className='flex-1 pb-16'>
            <FlatList
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                data={data?.pages.map(page => page).flat()}
                renderItem={({ item }) => <PaymentItem itemData={item} />}
                initialNumToRender={payload.params.PageSize}
                onEndReached={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                onRefresh={() => refetch()}
                refreshing={isLoading}
                ListFooterComponent={<ListLoading isLoading={isFetching} />}
                ItemSeparatorComponent={() => <Seperator />}
                ListEmptyComponent={<Empty message='No payments found!' />}
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 20
                }}
            />
            <ModalBottomsheet
                ref={bottomSheetRef}
                onClose={closeBottomSheet}
                customSnapPoints={snapPoints}
            >
                <View className='flex-1 justify-between pb-8'>
                    <View className='items-center pt-4'>
                        <Entypo name='ticket' size={80} color={colors.green[800]} />
                        <View className='items-center gap-1 mt-4'>
                            <Text className='text-green-800 text-2xl font-bold'>Transaction Detail</Text>
                            <Text className='text-black text-xs'>Total Payment</Text>
                            <Text className='text-green-700 text-xl font-bold'>RM{detailData?.amount?.toFixed(2)}</Text>
                        </View>
                        <View className='w-full p-4'>
                            <Seperator />
                            <View className='gap-1'>
                                <Text className='text-black text-sm font-bold'>Transaction ID</Text>
                                <Text className='text-green-700'>{detailData?.transactionId}</Text>
                            </View>
                            <Seperator />
                            <View className='flex-row justify-between'>
                                <Text className='text-black text-sm font-bold'>Date and Time</Text>
                                <Text className='text-gray-500 text-ms'>{moment(detailData?.createdDateTime).format('DD MMM, hh:mmA')}</Text>
                            </View>
                            <Seperator />
                            <View className='flex-row justify-between'>
                                <Text className='text-black text-sm font-bold'>Merchant</Text>
                                <Text className='text-gray-500 text-ms'>{detailData?.merchantName}</Text>
                            </View>
                        </View>
                    </View>
                    <View className='w-full p-4'>
                        <PrimaryBtn label='Close' onPress={handleBottomSheetChanges} disabled={false} />
                    </View>
                </View>
            </ModalBottomsheet>
        </View>
    );
}

export default PaymentsScreen;