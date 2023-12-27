import { 
    View, 
    Text,
    TouchableOpacity,
    StyleSheet 
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { MaskedTextInput} from 'react-native-mask-text';
import BottomSheet from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

interface TelephoneInputProps {
    value: string,
    countryCode: string,
    onShowCountries: () => void,
    showOptions: boolean,
    onChangeText: (text: string) => void
}

const TelephoneInput = ({ value, countryCode, onShowCountries, showOptions, onChangeText }: TelephoneInputProps) => {
    const mask = '99-999-9999';
    const [maskedValue, setMaskedValue] = useState("");
    const [unMaskedValue, setUnmaskedValue] = useState("");

    return (
        <View className='flex-row items-center space-x-4'>
            <TouchableOpacity
                className='flex-row justify-center items-center bg-colors-new-3 p-2 rounded-3xl w-24 space-x-2'
                onPress={onShowCountries}
            >
                <Text className='text-white text-lg font-semibold'>{countryCode}</Text>
                <AntDesign name={showOptions ? 'caretup' : 'caretdown'} size={16} color="white" />
            </TouchableOpacity>
            <MaskedTextInput 
                mask={mask}
                value={value}
                onChangeText={(text, rawText) => {
                    // console.log('text', text);
                    // console.log('raw', rawText);
                    onChangeText(rawText)
                }}
                autoFocus={true}
                style={styles.maskedInput}
                placeholder={mask}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    maskedInput: {
        // borderWidth: 1,
        // borderRadius: 24,
        // width: '60%',
        padding: 12,
        color: 'black',
        fontSize: 20
    },
});

export default TelephoneInput;