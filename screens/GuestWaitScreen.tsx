import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { BackIcon } from '../components/Icons';
import { COLORS } from '../constants/Colors';
import EditScreenInfo from '../components/EditScreenInfo';
import { generalStyles } from '../constants/Styles';
import { Button, makeStyles } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { useRecoilValue } from 'recoil';
import { currentRoomState, roomNumberState } from '../state/atoms/atoms';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { Room } from '../constants/Types';
import { SCREENS } from './constants';

export const GuestWaitScreen = () => {
    const genStyles = generalStyles();
    const waitStyles = useStyles();
    const nav = useNavigation();
    const room = useRecoilValue(currentRoomState);
    const roomCode = useRecoilValue(roomNumberState);

    const db = getFirestore();
    // listener for when the host starts the voting
    const unsub = onSnapshot(doc(db, "Rooms", `${roomCode}`), (doc) => {
        const document = doc.data();
        if(document) {
            if(document.isVoting) {
                unsub();
                nav.navigate(SCREENS.VOTING);
            }
        } else {
            console.log('error');
        }
    });


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
                <Text style={genStyles.title}>In a Room</Text>
                <Image source={require('../assets/images/pikkr-guest-wait.png')} />
                <View style={waitStyles.codeContainer}>
                    <Text style={waitStyles.subtitle}>Your Room Code:</Text>
                    <Text style={genStyles.title}>{roomCode}</Text>
                </View>

                <View style={genStyles.groupContainer}>
                    <Text style={waitStyles.subtitle}>
                        You have successfully joined a room!
                    </Text>
                    <Text style={waitStyles.text}>
                        Please wait until the room owner begins the voting process.
                    </Text>
                </View>
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
        borderRadius: 20,
    },
    codeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_GREY,
        paddingHorizontal: '5%',
        paddingVertical: '7%',
        borderRadius: 20,
        marginTop: 10,
        marginHorizontal: '5%',
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
        padding: '2%'
    },
    dataText: {
        fontSize: 24,
        fontFamily: 'Poppins',
        color: COLORS.GENRE_PURPLE,
        textAlign: 'center',
        flex: 1,
    },
    subtitle: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 24,
        flex: 1,
        alignContent: 'center',
        textAlign: 'center',
    },
    text: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 11,
        flex: 1,
        alignContent: 'center',
        textAlign: 'center',
    },
    dataContainer: { display: 'flex', flexDirection: 'column', width: '100%', alignContent: 'center', justifyContent: 'center', marginTop: '2%' },
    dataRow: { display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginTop: '2%' },
})


