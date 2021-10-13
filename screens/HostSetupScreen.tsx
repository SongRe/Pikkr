import { Formik } from 'formik';
import * as React from 'react';
import { Text, View, Image, TextInput } from 'react-native';
import { Button, makeStyles, } from 'react-native-elements';
import { COLORS } from '../constants/Colors';
import { SCREENS } from './constants';
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';
import { BackIcon } from '../components/Icons';
import { FlatGrid } from 'react-native-super-grid';

//TODO: setup selectable grid for genres and update the atom accordingly
//TODO: Setup async api call for movie data objects
//TODO: Typing for the movie data objects that come in
const sampleData = [{ label: 'Action'} , {label: 'Horror'}, {label: 'Family'}, {label: 'Comedy'}]

export const HostSetupScreen = () => {
    const setupStyles = useStyles();
    const nav = useNavigation();

    const [numError, setNumError] = useState(false);
    return (
        <View style={setupStyles.layout}>
            <Image
                style={setupStyles.image}
                source={require("../assets/images/PikkrBackgroundVector.png")}
            />
            <View style={setupStyles.mainContainer}>
                <View style={setupStyles.iconContainer}>
                    <BackIcon onPress={() => { nav.goBack() }} size={40} color={COLORS.WHITE} />
                </View>
                <Text style={setupStyles.title}>New Room</Text>

                <View>
                    <Formik
                        initialValues={{ code: "" }}
                        onSubmit={(values) => {
                            console.log(values);
                            //this is where we will validate the people input, and navigate / display error accordingly
                            nav.navigate(SCREENS.HOST_WAIT)
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={setupStyles.formContainer}>
                                <View style={setupStyles.groupContainer}>
                                    <View style={setupStyles.column}>
                                        <Text style={setupStyles.subtitle}>Number of People</Text>
                                        <Text style={setupStyles.errorText}>{numError ? 'Room does not exist' : ''}</Text>
                                        <View style={setupStyles.codeContainer}>
                                            <TextInput
                                                maxLength={4} // code length    
                                                onChangeText={handleChange("code")}
                                                onBlur={handleBlur("code")}
                                                autoCapitalize='characters'
                                                underlineColorAndroid='transparent'
                                                value={values.code}
                                                style={setupStyles.codeText}
                                                keyboardType='number-pad'
                                            />

                                        </View>
                                    </View>
                                </View>

                                <View style={setupStyles.groupContainer}>
                                    <Text style={setupStyles.subtitle}>Preference</Text>
                                    <Text style={setupStyles.text}>Filter by genre:</Text>
                                    <FlatGrid
                                        itemDimension={130}
                                        data={sampleData}
                                        renderItem={({item}) =>  {
                                            return (
                                                <View> 
                                                    {item.label}
                                                </View>
                                            )
                                      
                                        }}
                                    />


                                </View>
                                <Button titleStyle={setupStyles.buttonText}
                                    title='Create'
                                    buttonStyle={setupStyles.createButton}
                                    containerStyle={setupStyles.createButtonContainer}
                                    onPress={() => {
                                        handleSubmit();
                                    }}
                                />
                            </View>
                        )}
                    </Formik>
                </View>


            </View>
        </View>
    )
}

const useStyles = makeStyles(() => ({
    layout: {
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        zIndex: 0,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    iconContainer: {
        position: 'absolute',
        top: '3.5%',
        left: '7%',
    },

    image: {
        position: "absolute",
        zIndex: 0,
    },
    mainContainer: {
        backgroundColor: COLORS.BLACK,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        zIndex: 1,
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        height: '90%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'absolute',
        bottom: 0,
    },

    formContainer: {
        height: '97%',
    },

    title: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 34,
        textAlign: 'center',
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
        justifyContent: "center",
        backgroundColor: COLORS.TEXT_INPUT,
        borderRadius: 20,
        padding: '3%',
    },
    groupContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_GREY,
        padding: '7%',
        borderRadius: 20,
        marginTop: '5%',
    },
    codeText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Poppins',
        backgroundColor: COLORS.TEXT_INPUT,
        textAlign: 'center',
    },

    createButton: {
        borderRadius: 30,
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
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '35%',
    },
}));
