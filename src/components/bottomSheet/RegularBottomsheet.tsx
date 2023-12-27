import React, { forwardRef, useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import colors from 'tailwindcss/colors';
import { Text } from 'react-native';

interface Props {
    title?: string,
    children: React.ReactNode,
    onClose: () => void,
    customSnapPoints?: string[]
}

type Ref = BottomSheet;

const RegularBottomsheet = forwardRef<Ref, Props>(({ title, children, onClose, customSnapPoints }, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />,
        []
    ); 

    return (
        <BottomSheet
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
                backgroundColor: colors.slate[100]
            }}
            handleIndicatorStyle={{
                backgroundColor: colors.green[800]
            }}
            onClose={onClose}
        >
            {title && <Text className="text-colors-new-3 text-base font-bold self-center">{title}</Text>}
            {children}
        </BottomSheet>
    );
});

export default RegularBottomsheet;