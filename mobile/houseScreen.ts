import { Dimensions } from 'react-native'

export function houseScreenHeight() {
  const window = Dimensions.get('window')
  const screen = Dimensions.get('screen')
  return Math.round(Math.max(window.height, screen.height))
}
