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
import { GetWalletTransactionsParams, getRewardTransactions } from '../../../services/walletServices';
import { TWalletTransactions } from '../../../models/wallet';

interface HistoryItemProps {
    itemData: TWalletTransactions
}

const RewardsScreen = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const [showDetail, setShowDetail] = useState(false);
    const snapPoints = useMemo(() => ['65%'], []);
    const [detailData, setDetailData] = useState<TWalletTransactions | null | undefined>(null);

    // const {
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     data,
    //     error: rewardTransactionsError,
    //     refetch
    // } = useQuery<TWalletTransactions[], Error>({
    //     queryKey: ['rewardTransaction'],
    //     queryFn: () => getRewardTransactions({
    //         token: token
    //     })
    // });

    const payload = {
        token: token,
        params: {
            PageSize: 5,
            SortOrder: 0
        }
    } as GetWalletTransactionsParams;

    const {
        data,
        error: rewardTransactionsError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isError,
        refetch
    } = useInfiniteQuery({
        queryKey: ['transactions'],
        queryFn: ({ pageParam }) => getRewardTransactions(pageParam, payload),
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

    const RewardItem = ({ itemData }: HistoryItemProps) => {
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
                        <View className='flex-1 flex-wrap'>
                            <Text className='text-black text-sm font-bold' numberOfLines={1} ellipsizeMode='tail'>
                                Congratulations. You Win Lucky Draw (8888)
                            </Text>
                        </View>
                        <View className='flex-row justify-between items-center pt-1'>
                            <Text className='text-black text-sm font-bold'>From - {itemData?.merchantName}</Text>
                            <Text className='text-slate-400 text-sm'>{moment(itemData?.createdDateTime).format('DD MMM, hh:mmA')}</Text>
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
            textBody: rewardTransactionsError.message,
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
                renderItem={({ item }) => <RewardItem itemData={item} />}
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
                ListEmptyComponent={<Empty message='No rewards found!' />}
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
                            <Text className='text-green-800 text-2xl font-bold'>Reward Amount</Text>
                            <Text className='text-green-700 text-xl font-bold'>RM{detailData?.amount.toFixed(2)}</Text>
                        </View>
                        <View className='w-full p-4'>
                            <Seperator />
                            <View className='gap-1'>
                                <Text className='text-black text-sm font-bold'>Congratulation</Text>
                                <Text className='text-green-700'>Lucky Draw (8888)</Text>
                                <Text>You had Win the Lucky Draw Reward From Koos Image purchased on {moment(detailData?.createdDateTime).format('DD MMM, hh:mmA')}</Text>
                            </View>
                            <Seperator />
                            <View className='gap-1'>
                                <Text className='text-black text-sm font-bold'>Transaction ID</Text>
                                <Text className='text-green-700'>{detailData?.walletTransactionId}</Text>
                            </View>
                            <Seperator />
                            <View className='flex-row justify-between'>
                                <Text className='text-black text-sm font-bold'>Date and Time</Text>
                                <Text className='text-gray-500 text-ms'>{moment(detailData?.createdDateTime).format('DD MMM, hh:mmA')}</Text>
                            </View>
                            <Seperator />
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

export default RewardsScreen;