import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { BackIcon } from '../components/Icons';
import { COLORS } from '../constants/Colors';
import { generalStyles } from '../constants/Styles';
import { Button, makeStyles } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentRoomState, roomNumberState } from '../state/atoms/atoms';
import { onSnapshot, getFirestore, doc } from 'firebase/firestore';
import { Room } from '../constants/Types';
import { SCREENS } from './constants';
import { updateRoomField } from './../utils/utils';

export const HostWaitScreen = () => {
    const genStyles = generalStyles();
    const waitStyles = useStyles();
    const nav = useNavigation();

    const backgroundImage = require('../assets/images/PikkrBackgroundVector.png')

    const [room, setRoom] = useRecoilState(currentRoomState);
    const roomCode = useRecoilValue(roomNumberState);
    const db = getFirestore();

    const handleSubmit = () => {
        unsub(); //unsubscribe from the room update count
        updateRoomField(roomCode.toString(), 'isVoting', true);
        nav.navigate(SCREENS.VOTING);
    }

    // call unsub() to unsubscribe
    const unsub = onSnapshot(doc(db, "Rooms", `${roomCode}`), (doc) => {
        const document = doc.data();
        if(document) {
            const room: Room = {
                size: document.size,
                isVoting: document.isVoting,
                selectedGenres: document.selectedGenres ? document.selectedGenres : null,
                connectedUsers: document.connectedUsers ? document.connectedUsers : null,
                movies: document.movies ? document.movies : null,
                movieVotes: document.movieVotes ? document.movieVotes : null,
            }
            setRoom(room);
        } else {
            console.log('error');
        }
    });

    return (
        <View style={genStyles.layout}>
            <Image
                style={genStyles.bkgImg}
                source={backgroundImage}
            />
            <View style={genStyles.mainContainer}>
                <View style={waitStyles.iconContainer}>
                    <BackIcon onPress={() => { nav.goBack() }} size={40} color={COLORS.WHITE} />
                </View>
                <Text style={genStyles.title}>Your Room</Text>
                <View style={waitStyles.dataContainer}>
                    <View style={waitStyles.dataRow}>
                        <Text style={waitStyles.subtitle}>Genres</Text>
                        <Text style={waitStyles.subtitle}>In Room</Text>
                        <Text style={waitStyles.subtitle}>People Set</Text>
                    </View>
                    <View style={waitStyles.dataRow}>
                        <Text style={waitStyles.dataText}>{room.selectedGenres?.length}</Text>
                        <Text style={waitStyles.dataText}>{room.connectedUsers? room.connectedUsers : 0}</Text>
                        <Text style={waitStyles.dataText}>{room.size}</Text>
                    </View>
                    <View style={{
                        marginTop: '5%',
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.WHITE
                    }} />
                </View>
                <View style={waitStyles.codeContainer}>
                    <Text style={waitStyles.subtitle}>Your Room Code:</Text>
                    <Text style={genStyles.title}>{roomCode}</Text>
                </View>
                <Button titleStyle={waitStyles.buttonText}
                    title='Start'
                    disabled={room.connectedUsers < room.size}
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
    dataContainer: { display: 'flex', flexDirection: 'column', width: '100%', alignContent: 'center', justifyContent: 'center', marginTop: '2%' },
    dataRow: { display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginTop: '2%' },
})


