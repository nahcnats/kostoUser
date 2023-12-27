import { Text } from 'react-native';
import React, { useEffect, useState } from 'react';

interface VoucherPaymentHeaderProps {
    isSubmmitted: boolean
}

const VoucherPaymentHeader = ({ isSubmmitted }: VoucherPaymentHeaderProps) => {
    const [title, setTitle] = useState('Set your payment code');

    useEffect(() => {
        if (isSubmmitted) {
            setTitle('Confirm your payment code');
        }
    }, [isSubmmitted]);
    
    return (
        <Text className='text-black text-xl self-center'>{title}</Text>
    );
}

export default VoucherPaymentHeader;