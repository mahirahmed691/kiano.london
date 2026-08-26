import * as SplashScreen from 'expo-splash-screen'
import { registerRootComponent } from 'expo'

import App from './App'

void SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({ duration: 560, fade: true })

registerRootComponent(App)
