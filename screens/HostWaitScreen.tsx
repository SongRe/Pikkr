import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { BackIcon } from '../components/Icons';
import { COLORS } from '../constants/Colors';
import EditScreenInfo from '../components/EditScreenInfo';
import { generalStyles } from '../constants/Styles';
import { makeStyles } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

//TODO: Make this page.

export const HostWaitScreen = () => {
    const genStyles = generalStyles();
    const waitStyles = useStyles();
    const nav = useNavigation();

    return (
        <View style={genStyles.layout}>
            <Image
                style={genStyles.bkgImg}
                source={require("../assets/images/PikkrBackgroundVector.png")}
            />
            <View style={genStyles.mainContainer}>
                <View style={waitStyles.iconContainer}>
                    <BackIcon onPress={() => { nav.goBack() }} size={40} color={COLORS.WHITE} />
                </View>
                <Text style={genStyles.title}>Waiting Room</Text>
                <View style={genStyles.groupContainer}><Text>Group 1</Text></View>
                <View style={genStyles.groupContainer}><Text>Group 2</Text></View>

                


            </View>
        </View>
}

const useStyles = makeStyles({
    iconContainer: {
        position: 'absolute',
        top: '3.5%',
        left: '7%',
    },
})
