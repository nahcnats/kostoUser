import React, { forwardRef, useCallback, useMemo } from 'react';
import { 
    BottomSheetBackdrop, 
    BottomSheetBackdropProps, 
    BottomSheetModal, 
} from '@gorhom/bottom-sheet';
import colors from 'tailwindcss/colors';
import { Text } from 'react-native';

interface Props {
    title?: string,
    children: React.ReactNode,
    onClose: () => void,
    customSnapPoints?: string[]
}

type Ref = BottomSheetModal;

const ModalBottomsheet = forwardRef<Ref, Props>(({ title, children, onClose, customSnapPoints }, ref) => {
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
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={customSnapPoints ? customSnapPoints : snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
                backgroundColor: colors.slate[100]
            }}
            handleIndicatorStyle={{
                backgroundColor: colors.green[800]
            }}
            onDismiss={onClose}
        >
            {title && <Text className="text-colors-new-3 text-base font-bold self-center">{ title }</Text>}
            {children}
        </BottomSheetModal>
    );
});

export default ModalBottomsheet;