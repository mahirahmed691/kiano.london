import { StyleSheet, Text, View } from 'react-native'

import { HouseLockup } from './HouseLockup'
import { creedJoin, creedMotto, site } from './catalogue'
import { color, type } from './theme'

type Props = {
  quiet?: boolean
}

export function HouseMotto({ quiet = false }: Props) {
  return (
    <View style={styles.band}>
      <HouseLockup tone="bronze" />
      {quiet ? (
        <Text style={styles.creed}>{creedJoin}</Text>
      ) : (
        <>
          <Text style={styles.quote}>{creedMotto}</Text>
          <Text style={styles.creed}>{`${creedJoin} · ${site.note}`}</Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: color.night,
    paddingHorizontal: 24,
    paddingVertical: 72,
    alignItems: 'center',
  },
  quote: {
    marginTop: 28,
    color: color.ivory,
    fontFamily: type.displayItalic,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.3,
    textAlign: 'center',
    maxWidth: 320,
  },
  creed: {
    marginTop: 20,
    color: color.bronze,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
})
