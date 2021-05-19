import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button, makeStyles } from 'react-native-elements';
import { SCREENS } from './constants';
import { COLORS } from '../constants/Colors'


const useStyles = makeStyles(() => ({
    layout: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        zIndex: 0,    
    },
    image: {
        position: 'absolute',
        zIndex: 1,
    },
    mainContainer: {
        backgroundColor: COLORS.LIGHT_BLACK,
        borderRadius: 20,
        marginTop: '20%',
    }

}));



export const HomeScreen = (): JSX.Element => {
    const nav = useNavigation();
    const homeStyles = useStyles();
    return (
        <View style={homeStyles.layout}>
            {/* <Image style={homeStyles.image} source={require()}/> */}
            <View style={homeStyles.mainContainer}>
                <View>

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

