import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
import { Button, makeStyles, Image } from "react-native-elements";
import { SCREENS } from "./constants";
import { COLORS } from "../constants/Colors";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { generalStyles } from './../constants/Styles';
import { createGenreObjects, getRoomByCode, incrementConnectedUsers } from './../utils/utils';
import { useSetRecoilState } from 'recoil';
import { currentRoomState, roomNumberState } from "../state/atoms";
import { loadedGenresState, movieState } from "../state/atoms/atoms";
import { fetchGenres } from './../utils/movie_api';

export const HomeScreen = () => {
    const nav = useNavigation();
    const homeStyles = useStyles();
    const genStyles = generalStyles();

    const [codeError, setCodeError] = useState(false);
    const setRoom = useSetRecoilState(currentRoomState);
    const setRoomNumber = useSetRecoilState(roomNumberState);
    const setMovies = useSetRecoilState(movieState);
    const setLoadedGenres = useSetRecoilState(loadedGenresState);

    const handleCode = async (values: any) => {
        const res = await getRoomByCode(values.code);
        const genres = await fetchGenres();
        if (res != null) {
            if (res.connectedUsers < 1) {
                setCodeError(true);
            } else {
                setRoom(res);
                setRoomNumber(values.code);
                setCodeError(false);
                setMovies(res.movies);
                nav.navigate(SCREENS.GUEST_WAIT);
                incrementConnectedUsers(values.code); //1 more connected user
            }
        } else {
            setCodeError(true);
        }
        if (genres != null) {
            setLoadedGenres(createGenreObjects(genres));
        }
    };

    return (
        <View style={genStyles.layout}>
            <Image
                style={{
                    height: 400,
                    width: 400,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                    padding: 200,
                }}
                source={{ uri: require('../assets/images/PikkrBackgroundVector.png') }}
            />
            <View style={genStyles.mainContainer}>
                <Text style={genStyles.title}>Get Started</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={genStyles.groupContainer}>
                        <Formik
                            initialValues={{ code: "" }}
                            onSubmit={async (values) => {
                                await handleCode(values);
                                //this is where we will validate the code, and navigate / display error accordingly
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values }) => (
                                <View style={homeStyles.column}>
                                    <Text style={genStyles.subtitle}>Have a room?</Text>
                                    <Text style={homeStyles.text}>Enter the 4-digit code obtained by the room host.</Text>
                                    <Text style={genStyles.errorText}>{codeError ? 'Room does not exist' : ''}</Text>
                                    <View style={homeStyles.codeContainer}>
                                        <TextInput
                                            maxLength={5} // code length    
                                            onChangeText={handleChange("code")}
                                            onBlur={handleBlur("code")}
                                            autoCapitalize='characters'
                                            underlineColorAndroid='transparent'
                                            value={values.code}
                                            style={homeStyles.codeText}

                                        />

                                    </View>
                                    <Button
                                        onPress={() => {
                                            handleSubmit();
                                        }}
                                        title="Connect"
                                        titleStyle={homeStyles.buttonText}
                                        buttonStyle={homeStyles.createButton}
                                        containerStyle={homeStyles.createButtonContainer}
                                        disabled={values.code.length <= 0}

                                    />
                                </View>
                            )}
                        </Formik>
                    </View>

                    <View style={genStyles.groupContainer}>
                        <Text style={genStyles.subtitle}>New room</Text>
                        <Text style={homeStyles.text}>Create a room for a set amount of people and become the room owner.</Text>
                        <Button titleStyle={homeStyles.buttonText}
                            title='Create'
                            buttonStyle={homeStyles.createButton}
                            containerStyle={homeStyles.createButtonContainer}
                            onPress={() => {
                                nav.navigate(SCREENS.HOST_SETUP)
                            }}
                        />

                    </View>
                </ScrollView>

            </View>
        </View>
    );
};

const useStyles = makeStyles(() => ({
    column: {
        display: 'flex',
        flexDirection: 'column',
    },

    image: {
        height: 400,
        width: 400,
    },
    text: {
        fontFamily: 'Poppins',
        color: COLORS.WHITE,
        fontSize: 14,
    },
    codeContainer: {
        display: "flex",
        flexDirection: "row",
        // alignItems: "center",
        // alignContent: "center",
        justifyContent: "center",
        backgroundColor: COLORS.TEXT_INPUT,
        borderRadius: 20,

    },

    codeText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Poppins',
        backgroundColor: COLORS.TEXT_INPUT,
        textAlign: 'center',
        padding: '3%',
        paddingHorizontal: 'auto',
    },

    createButton: {
        borderRadius: 30,
        width: '35%',
    },

    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: COLORS.WHITE
    },

    createButtonContainer: {
        marginTop: '5%',
    },
}));
