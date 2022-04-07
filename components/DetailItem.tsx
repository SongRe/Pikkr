import React from "react"
import { View, ViewStyle, Text, TextStyle } from "react-native"
import { makeStyles } from 'react-native-elements';
import { COLORS } from "../constants/Colors";

interface detailProps {
    text?: string,
    style: ViewStyle,
    textStyle: TextStyle,
}
export const DetailItem = (props: detailProps) => {
    return (
        <View style={props.style}>
            <Text style={props.textStyle}>{props.text}</Text>
        </View>
    )
}
