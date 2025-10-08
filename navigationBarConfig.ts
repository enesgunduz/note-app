import { useEffect } from 'react';
import { Platform } from 'react-native';

// Only import if running on Expo/React Native 48+
let NavigationBar: any = null;
if (Platform.OS === 'android') {
  try {
    NavigationBar = require('expo-navigation-bar').NavigationBar;
  } catch {}
}

export function useHideNavigationBar() {
  useEffect(() => {
    if (NavigationBar && NavigationBar.setVisibilityAsync) {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('immersive'); // immersive: tam ekran
    }
  }, []);
}
