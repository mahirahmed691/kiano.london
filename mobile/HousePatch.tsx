import { StyleSheet, View } from 'react-native'
import Svg, { Rect } from 'react-native-svg'

import { HouseMonogram } from './HouseMonogram'
import { clothSwatch, clothThread, type ProductColour } from './catalogue'

type Props = {
  colour?: ProductColour
  size?: number
}

export function HousePatch({ colour = 'Cream', size = 52 }: Props) {
  const cloth = clothSwatch[colour]
  const thread = clothThread
  const inset = size * 0.09
  const inner = size - inset * 2

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.patch, { width: size, height: size, backgroundColor: cloth }]}
    >
      <Svg
        width={inner}
        height={inner}
        viewBox="0 0 100 100"
        style={[styles.stitch, { top: inset, left: inset }]}
      >
        <Rect
          x="0.7"
          y="0.7"
          width="98.6"
          height="98.6"
          fill="none"
          stroke={thread}
          strokeWidth="1.15"
          strokeDasharray="2.3 2.8"
          strokeLinecap="butt"
        />
      </Svg>
      <HouseMonogram size={size * 0.52} fill={thread} />
    </View>
  )
}

const styles = StyleSheet.create({
  patch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stitch: {
    position: 'absolute',
  },
})
