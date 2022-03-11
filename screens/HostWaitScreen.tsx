import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { BackIcon } from '../components/Icons';
import { COLORS } from '../constants/Colors';
import EditScreenInfo from '../components/EditScreenInfo';
import { generalStyles } from '../constants/Styles';
import { Button, makeStyles } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { useRecoilValue } from 'recoil';
import { roomNumberState } from '../state/atoms/atoms';

//TODO: Make this page.

export const HostWaitScreen = () => {
    const genStyles = generalStyles();
    const waitStyles = useStyles();
    const nav = useNavigation();

    const handleSubmit = () => {
        
    }

    const roomCode = useRecoilValue(roomNumberState);

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
                <View style={genStyles.groupContainer}>
                    <Text style={genStyles.subtitle}>Your Room Code:</Text>
                    <Text style={genStyles.title}>{roomCode}</Text>
                </View>
                <View style={genStyles.groupContainer}><Text>Group 2</Text></View>
                <Button titleStyle={waitStyles.buttonText}
                    title='Start'
                    buttonStyle={waitStyles.createButton}
                    containerStyle={waitStyles.createButtonContainer}
                    onPress={() => {
                        handleSubmit();
                    }}
                />



            </View>
        </View>
    )
}

const useStyles = makeStyles({
    iconContainer: {
        position: 'absolute',
        top: '3.5%',
        left: '7%',
    },
    createButton: {
        borderRadius: 20    ,
        width: '100%',

    },

    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: COLORS.WHITE
    },

    createButtonContainer: {
        marginTop: '5%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '35%',
    },
})


