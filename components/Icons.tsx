import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";

interface iconProps {
    onPress: () => void;
    size: number;
    color: string;
    style?: StyleProp<ViewStyle>
}

export const BackIcon = (props: iconProps) => {
    const iconRef = React.useRef();
    return (
        <Icon type='font-awesome-5' name='angle-left' size={props.size} color={props.color} onPress={props.onPress} />
    );
};
