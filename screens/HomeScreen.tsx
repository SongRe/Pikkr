import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

import EditScreenInfo from '../components/EditScreenInfo';
import { SCREENS } from './constants';


export const HomeScreen = (): JSX.Element => {
    const nav = useNavigation();

    return (
        <View>
            <Text>
                Home Screen.
            </Text>
            <Button title={"Host Wait"} onPress={() => {
                nav.navigate(SCREENS.HOST_WAIT)
            }}>
                to host wait screen
            </Button>
        </View>
    )
}

