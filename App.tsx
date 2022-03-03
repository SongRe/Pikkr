import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { HomeNavigator } from './navigation/MainNavigator';

import { initializeApp } from 'firebase/app';
// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
// Maybe make this part private somehow? 
const firebaseConfig = {
  apiKey: "AIzaSyAvv73Tpw8bE-eUyXzQwCzBC5lz-DfQrwM",
  authDomain: "pikkr-524ca.firebaseapp.com",
  databaseURL: "https://pikkr-524ca-default-rtdb.firebaseio.com",
  projectId: "pikkr-524ca",
  storageBucket: "pikkr-524ca.appspot.com",
  messagingSenderId: "526382489692",
  appId: "1:526382489692:web:440db521cc07a695c68699",
  measurementId: "G-EWHT7V68PL"
};


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  initializeApp(firebaseConfig);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <RecoilRoot>
          <React.Suspense fallback={<div>Loading...</div>}>
            <HomeNavigator />
          </React.Suspense>
        </RecoilRoot>
      </SafeAreaProvider>

    );
  }
}
