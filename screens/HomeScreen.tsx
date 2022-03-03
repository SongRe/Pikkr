import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { StyleSheet, Text, View, Image, TextInput, ScrollView } from "react-native";
import { Button, makeStyles } from "react-native-elements";
import { SCREENS } from "./constants";
import { COLORS } from "../constants/Colors";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { generalStyles } from './../constants/Styles';

export const HomeScreen = (): JSX.Element => {
    const nav = useNavigation();
    const homeStyles = useStyles();
    const genStyles = generalStyles();

    const [codeError, setCodeError] = useState(false);

    const handleSubmit = () => {
        nav.navigate(SCREENS.HOST_SETUP);
    };

    return (
        <View style={genStyles.layout}>
            <Image
                style={homeStyles.image}
                source={require("../assets/images/PikkrBackgroundVector.png")}
            />
            <View style={genStyles.mainContainer}>
                <Text style={homeStyles.title}>Get Started</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={homeStyles.groupContainer}>
                        <Formik
                            initialValues={{ code: "" }}
                            onSubmit={(values) => {
                                console.log(values);
                                //this is where we will validate the code, and navigate / display error accordingly
                                nav.navigate(SCREENS.HOST_SETUP)
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values }) => (
                                <View style={homeStyles.column}>
                                    <Text style={homeStyles.subtitle}>Have a room?</Text>
                                    <Text style={homeStyles.text}>Enter the 4-digit code obtained by the room host.</Text>
                                    <Text style={homeStyles.errorText}>{codeError ? 'Room does not exist' : ''}</Text>
                                    <View style={homeStyles.codeContainer}>
                                        <TextInput
                                            maxLength={4} // code length    
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

                                    />
                                </View>
                            )}
                        </Formik>
                    </View>

                    <View style={homeStyles.groupContainer}>
                        <Text style={homeStyles.subtitle}>New room</Text>
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
        position: "absolute",
        zIndex: 0,
    },
    title: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 34,
        marginLeft: '5%',
    },
    subtitle: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 24,
    },
    text: {
        fontFamily: 'Poppins',
        color: COLORS.WHITE,
        fontSize: 14,
    },

    errorText: {
        fontFamily: 'Poppins',
        color: COLORS.RED,
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
    groupContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_GREY,
        paddingHorizontal: '5%',
        paddingVertical: '7%',
        borderRadius: 20,
        flex: 1,
        marginTop: 10,
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
