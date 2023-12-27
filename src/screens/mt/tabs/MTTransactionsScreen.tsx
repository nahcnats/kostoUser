import {
    View,
    Text,
    FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import moment from 'moment';

import { useAppSelector } from '../../../store/store';
import { useRefreshOnFocus } from '../../../hooks';
import {
    Empty,
    Seperator,
    Error500,
    Loading,
    ListLoading
} from '../../../components/common';
import MTActive from '../../../assets/svg/mtActive.svg';

import { TBlock } from '../../../models/block';
import { GetMTTransactionsParam, getMTTransactions } from '../../../services/blockServices';

interface HistoryItemProps {
    itemData: TBlock
}

const MTTransactionsScreen = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.authReducer.value);

    const payload = {
        token: token,
        params: {
            PageSize: 5,
            SortOrder: 0
        }
    } as GetMTTransactionsParam;

    const {
        data,
        error: blockTransactionsError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isError,
        refetch
    } = useInfiniteQuery({
        queryKey: ['mtTransactions'],
        queryFn: ({ pageParam }) => getMTTransactions(pageParam, payload),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = Object.keys(lastPage).length === payload.params.PageSize ? allPages.length + 1 : undefined;
            return nextPage;
        }
    });
    useRefreshOnFocus(refetch);

    const MTItem = ({ itemData }: HistoryItemProps) => {
        const futureDate = moment(itemData.createdDateTime).add(180, 'days').format('DD MMM YYYY');

        return (
            <View>
                <View className='flex-row justify-between items-center gap-4'>
                    <MTActive width={30} height={30} />
                    <View className='flex-1'>
                        <View className='flex-row flex-wrap items-center gap-1'>
                            <Text className='text-black text-sm font-bold' numberOfLines={1} ellipsizeMode='tail'>MT {itemData?.blockId?.toUpperCase().slice(0, 6)}</Text>
                            <Text className='text-sm' numberOfLines={1} ellipsizeMode='tail'>- {itemData?.merchantName}</Text>
                        </View>
                        <View className='flex-row justify-between items-center pt-1'>
                            <Text className='text-slate-400 text-sm'>{moment(itemData?.createdDateTime).format('DD MMM, hh:mmA')}</Text>
                            <Text className='text-green-800 text-sm'>Expire : {futureDate}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: blockTransactionsError.message,
            autoClose: 2000,
        });

        return <Error500 />;
    }

    return (
        <View className='flex-1 pb-16'>
            <FlatList
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${item.blockId}`}
                data={data?.pages.map(page => page).flat()}
                renderItem={({ item }) => 
                    <MTItem itemData={item} />
                }
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
                ListEmptyComponent={<Empty message='No merchant transaction found!' />}
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 20
                }}
            />
        </View>
    );
}

export default MTTransactionsScreen;