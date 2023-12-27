import { View, Text, TextInput } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { useTimeout } from '../../hooks/useTimeout';
import { IS_ANDROID } from '../../utils';

interface OtpInputProps {
    otpCodeChanged: (otpCode: string) => void;
    clear: boolean,
    cleared: () => void,
    secureTextEntry: boolean,
}

const NUMBER_OF_INPUTS = 6;

const OtpInput = ({ otpCodeChanged, clear, cleared, secureTextEntry }: OtpInputProps) => {
    const isFocused = useIsFocused();
    const [values, setValues] = React.useState<string[]>([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);

    const itemsRef = useRef<Array<TextInput | null>>([]);


    useEffect(() => {
        const firstInput = itemsRef.current[0];        
        if (clear) {
            setValues(['', '', '', '', '', '']);
            firstInput?.focus();
            cleared()
        }
    }, [clear]);

    const applyOTPCodeToInputs = (code: string) => {
        // split up code and apply it to all inputs
        const codeArray = code.split('');
        codeArray.forEach((char, index) => {
            const input = itemsRef.current[index];
            if (input) {
                input.setNativeProps({
                    text: char,
                });
            }
        });
        // focus on last input as a cherry on top
        const lastInput = itemsRef.current[itemsRef.current.length - 1];
        if (lastInput) {
            lastInput.focus();
            otpCodeChanged(code);
        }
    }

    useTimeout(
        () => {
            const firstInput = itemsRef.current[0];
            if (firstInput) {
                firstInput.focus();
            }
        },
        isFocused ? 1000 : null,
    );

    return (
        <View className='flex-1 flex-row justify-around'>
            {
                Array.from({ length: NUMBER_OF_INPUTS }, (_, index) => (
                    <TextInput 
                        className="border border-gray-200 bg-white"
                        style={{
                            fontSize: 20,
                            paddingVertical: 5,
                            paddingLeft: IS_ANDROID ? 10 : 10,
                            paddingRight: IS_ANDROID ? 0 : 10,
                            borderRadius: 10,
                            shadowColor: "#171717",
                            shadowOffset: { width: 0, height: 2, },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 15
                        }}
                        ref={(el) => (itemsRef.current[index] = el)}
                        key={index}
                        keyboardType={'numeric'}
                        secureTextEntry={secureTextEntry}
                        placeholder={'X'}
                        value={values[index]}
                        defaultValue=""
                        // first input can have a length of 6 because they paste their code into it
                        maxLength={index === 0 ? 6 : 1}
                        onChange={(event) => {
                            const { text } = event.nativeEvent;

                            // only continue one if we see a text of length 1 or 6
                            if (text.length === 0 || text.length === 1 || text.length === 6) {
                                if (text.length === 6) {
                                    applyOTPCodeToInputs(text);
                                    return;
                                }
                                // going forward, only if text is not empty
                                if (text.length === 1 && index !== NUMBER_OF_INPUTS - 1) {
                                    const nextInput = itemsRef.current[index + 1];
                                    if (nextInput) {
                                        nextInput.focus();
                                    }
                                }
                            }
                            // determine new value
                            const newValues = [...values];
                            newValues[index] = text;

                            // update state
                            setValues(newValues);
                            // also call callback as a flat string
                            otpCodeChanged(newValues.join(''));
                        }}
                        onKeyPress={(event) => {
                            if (event.nativeEvent.key === 'Backspace') {
                                // going backward:
                                if (index !== 0) {
                                    const previousInput = itemsRef.current[index - 1];
                                    if (previousInput) {
                                        previousInput.focus();
                                        return;
                                    }
                                }
                            }
                        }}
                        textContentType="oneTimeCode"
                    />
                ))
            }
        </View>
    );
}

export default OtpInput;