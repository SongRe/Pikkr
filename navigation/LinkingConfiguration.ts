/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';
import { HomeScreen } from './../screens/HomeScreen';
import { HostWaitScreen } from './../screens/HostWaitScreen';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Home: {
        screen: HomeScreen
      },
      HostWait: {
        screen: HostWaitScreen
      },
      
    },
  },
};
