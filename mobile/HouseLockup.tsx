import { StyleSheet, Text, View } from 'react-native'

import { HouseMonogram } from './HouseMonogram'
import { site } from './catalogue'
import { color, type } from './theme'

type Props = {
  compact?: boolean
  tone?: 'bronze' | 'ink'
}

export function HouseLockup({ compact = false, tone = 'ink' }: Props) {
  const fill = tone === 'bronze' ? color.bronze : color.ink
  const mark = compact ? 27 : 44
  const nameSize = compact ? 16 : 22
  const citySize = compact ? 9 : 12
  const estSize = compact ? 8 : 10

  return (
    <View style={styles.stack} accessibilityRole="image" accessibilityLabel={site.fullName}>
      <HouseMonogram size={mark} fill={fill} />
      <Text
        style={[
          styles.name,
          compact ? styles.nameCompact : styles.nameFull,
          { color: fill, fontSize: nameSize, letterSpacing: compact ? 6 : 8 },
        ]}
      >
        {site.name}
      </Text>
      <Text
        style={[
          styles.city,
          compact ? styles.cityCompact : styles.cityFull,
          { color: fill, fontSize: citySize, letterSpacing: compact ? 5 : 6.4 },
        ]}
      >
        {site.lockup}
      </Text>
      <View style={[styles.estRow, compact ? styles.estRowCompact : styles.estRowFull]}>
        <View style={[styles.hair, { backgroundColor: fill }]} />
        <Text style={[styles.est, { color: fill, fontSize: estSize, letterSpacing: compact ? 3.2 : 4 }]}>
          EST. {site.established}
        </Text>
        <View style={[styles.hair, { backgroundColor: fill }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stack: {
    alignItems: 'center',
  },
  name: {
    fontFamily: type.display,
    fontWeight: '400',
    textTransform: 'uppercase',
    paddingLeft: 8,
  },
  nameCompact: {
    marginTop: 8,
  },
  nameFull: {
    marginTop: 12,
  },
  city: {
    fontFamily: type.sansRegular,
    fontWeight: '400',
    textTransform: 'uppercase',
    paddingLeft: 6,
  },
  cityCompact: {
    marginTop: 4,
  },
  cityFull: {
    marginTop: 6,
  },
  estRow: {
    width: '100%',
    minWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estRowCompact: {
    marginTop: 8,
  },
  estRowFull: {
    marginTop: 10,
  },
  hair: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    opacity: 0.55,
  },
  est: {
    fontFamily: type.sans,
    fontWeight: '400',
    textTransform: 'uppercase',
    opacity: 0.7,
  },
})
