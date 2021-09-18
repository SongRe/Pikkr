import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { Button, makeStyles } from 'react-native-elements';
import { SCREENS } from './constants';
import { COLORS } from '../constants/Colors'
import { Formik } from 'formik';

export const HomeScreen = (): JSX.Element => {
    const nav = useNavigation();
    const homeStyles = useStyles();
    return (
        <View style={homeStyles.layout}>
            <Image style={homeStyles.image} source={require('../assets/images/PikkrBackgroundVector.png')}/>
            <View style={homeStyles.mainContainer}>
                <View>
                    <Text style={homeStyles.title}>Hello</Text>
                    <Formik
                        initialValues={{ num1: '', num2: '', num3: '', num4: '' }}
                        onSubmit={values => console.log(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View>
                                <TextInput
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.num1}
                                />
                                <TextInput
                                    value={values.num2} 
                                />
                                <Button onPress={() => {
                                    handleSubmit();
                                }} title="Submit" />
                            </View>
                        )}
                    </Formik>

                </View>

                <View>

                </View>
            </View>
            <Button title={"Host Wait"} onPress={() => {
                nav.navigate(SCREENS.HOST_WAIT)
            }}>
                to host wait screen
            </Button>
        </View>
    )
}

const useStyles = makeStyles(() => ({
    layout: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        zIndex: 0,
    },
    image: {
        position: 'absolute',
        zIndex: 0,
    },
    mainContainer: {
        backgroundColor: COLORS.LIGHT_BLACK,
        borderRadius: 20,
        marginTop: '20%',
        zIndex: 1,
    },

    title: {
        fontFamily: 'Poppins',
        color: COLORS.TITLE_TEXT,
        fontSize: 34,
    }

}));


