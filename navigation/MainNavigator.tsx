import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from '../screens/constants';
import { HomeScreen, HostSetupScreen, HostWaitScreen } from './../screens/index';

export type RootStackParamList = {
    NotFound: undefined;
    Home: undefined;
    HostSetup: undefined;
    HostWait: undefined;
    GuestWait: undefined;
    GuestSetup: undefined;
    Voting: undefined;
    Ending: undefined;
  };
  

const Stack = createNativeStackNavigator<RootStackParamList>();

export const HomeNavigator = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={SCREENS.HOME} component={HomeScreen} options={{headerShown: false, }} />
                <Stack.Screen name={SCREENS.HOST_SETUP} component={HostSetupScreen} />
                <Stack.Screen name={SCREENS.HOST_WAIT} component={HostWaitScreen} />
            </Stack.Navigator>
        </NavigationContainer>

    )

}
