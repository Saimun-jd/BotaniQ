
import "./global.css"

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PlantProvider } from './src/context/PlantContext';
import { getData, storeData } from './src/utils/storage';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainScreen from './src/screens/MainScreen';
import { UserProvider } from "./src/context/UserContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    // Configure notification channels for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('plant-reminders', {
        name: 'Plant Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Request notification permissions
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
    };

    const checkFirstLaunch = async () => {
      const hasLaunched = await getData('hasLaunched');
      if (hasLaunched) {
        setIsFirstLaunch(false);
      } else {
        await storeData('hasLaunched', true);
      }
    };

    registerForPushNotificationsAsync();
    checkFirstLaunch();
    GoogleSignin.configure({
      webClientId: '870973181283-qeu6tqc10rrqif7eblrib2umtj31nr41.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  }, []);

  const handleOnboardingComplete = () => {
    setIsFirstLaunch(false);
  };

  return (
    <SafeAreaProvider>
      <UserProvider>
        <PlantProvider>
          {isFirstLaunch ? (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          ) : (
            <MainScreen/>
          )}
        </PlantProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}