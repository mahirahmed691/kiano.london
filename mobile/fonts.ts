import {
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular,
} from '@expo-google-fonts/cormorant-garamond'
import { Jost_300Light, Jost_400Regular } from '@expo-google-fonts/jost'
import { useFonts } from 'expo-font'

export function useHouseFonts() {
  const [loaded, error] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular,
    Jost_300Light,
    Jost_400Regular,
  })
  return loaded || Boolean(error)
}
