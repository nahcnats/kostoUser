import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { forwardRef} from 'react';
import { MaskedTextInput } from 'react-native-mask-text';

interface CurrencyInputProps {
    label: string,
    largeLabel?: boolean,
    value: number,
    onSetAmount: (amount: number) => void,
}

type Ref = TextInput;

const CurrencyInput = forwardRef<Ref, CurrencyInputProps>(({ label, largeLabel, value, onSetAmount}, ref) => {
    return (
        <View className='w-[200] justify-start items-start'>
            <Text className={`text-black text-sm font-bold ${largeLabel && 'text-green-900 text-lg font-bold self-center'}`}>{label}</Text>
            <MaskedTextInput
                ref={ref}
                style={styles.input}
                type='currency'
                options={{
                    prefix: "RM",
                    decimalSeparator: ".",
                    groupSeparator: ",",
                    precision: 2,
                }}
                onChangeText={(text, rawText) => {
                    onSetAmount(parseFloat(rawText));
                }}
                value={value.toString()}
                keyboardType='numeric'
            />
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        color: "#58966F",
        fontSize: 30,
        fontWeight: 'bold',
        height: 60,
        // margin: 4,
        marginBottom: 2,
        textAlign: "center",
    },
});

export default CurrencyInput;