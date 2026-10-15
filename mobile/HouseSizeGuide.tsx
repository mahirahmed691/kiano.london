import { StyleSheet, Text, View } from 'react-native'

import { sizeChart, sizeMeasures, sizeNote } from './catalogue'
import { color, type } from './theme'

export function HouseSizeGuide({ compact }: { compact?: boolean }) {
  return (
    <View>
      <View style={styles.head}>
        <Text style={[styles.cell, styles.label, styles.sizeCol]}>Size</Text>
        <Text style={[styles.cell, styles.label]}>Chest</Text>
        <Text style={[styles.cell, styles.label]}>Length</Text>
        <Text style={[styles.cell, styles.label]}>Shoulder</Text>
      </View>
      {sizeChart.map((row) => (
        <View key={row.size} style={styles.row}>
          <Text style={[styles.cell, styles.size, styles.sizeCol]}>{row.size}</Text>
          <Text style={[styles.cell, styles.value]}>{row.chest}</Text>
          <Text style={[styles.cell, styles.value]}>{row.length}</Text>
          <Text style={[styles.cell, styles.value]}>{row.shoulder}</Text>
        </View>
      ))}
      <View style={styles.measures}>
        {sizeMeasures.map((item) => (
          <View key={item.title} style={styles.measure}>
            <Text style={styles.label}>{item.title}</Text>
            <Text style={styles.copy}>{item.copy}</Text>
          </View>
        ))}
      </View>
      {compact ? null : <Text style={styles.note}>{sizeNote}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.rule,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(212, 203, 184, 0.7)',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
  },
  sizeCol: {
    flex: 0.7,
  },
  label: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  size: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 20,
    fontWeight: '300',
  },
  value: {
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 14,
    fontWeight: '300',
  },
  measures: {
    marginTop: 28,
    gap: 20,
  },
  measure: {
    gap: 8,
  },
  copy: {
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
  },
  note: {
    marginTop: 24,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
    maxWidth: 340,
  },
})
