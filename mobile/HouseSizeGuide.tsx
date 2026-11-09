import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Svg, { Line, Path } from 'react-native-svg'

import type { ThobeSize } from './catalogue'
import {
  formatMeasure,
  measureToCm,
  readCut,
  sizeChart,
  sizeMeasures,
  sizeNote,
  sizeRow,
  type MeasureKey,
  type MeasureUnit,
} from './catalogue'
import { color, type } from './theme'

const plate = {
  width: 160,
  height: 320,
  shoulder: { x1: 58, x2: 102, y: 46 },
  chest: { x1: 46, x2: 114, y: 118 },
  length: { x: 80, y1: 62, y2: 300 },
}

function displayNumber(cm: number, unit: MeasureUnit): string {
  if (unit === 'in') return (cm / 2.54).toFixed(1)
  const rounded = Math.round(cm * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function parseDraft(raw: string, unit: MeasureUnit): number | null {
  const trimmed = raw.trim().replace(',', '.')
  if (!trimmed) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value) || value <= 0) return null
  const cm = measureToCm(value, unit)
  return cm >= 20 ? cm : null
}

export function HouseSizeGuide({
  compact,
  chosen,
  onChoose,
}: {
  compact?: boolean
  chosen?: ThobeSize | ''
  onChoose?: (size: ThobeSize) => void
}) {
  const [unit, setUnit] = useState<MeasureUnit>('cm')
  const [active, setActive] = useState<MeasureKey>('chest')
  const [cm, setCm] = useState<Partial<Record<MeasureKey, number>>>({})
  const [draft, setDraft] = useState<Record<MeasureKey, string>>({
    chest: '',
    length: '',
    shoulder: '',
  })
  const reading = useMemo(() => readCut(cm), [cm])
  const tape = reading?.size ?? null
  const [view, setView] = useState<{
    held: ThobeSize
    tape: ThobeSize | null
    kept: ThobeSize | '' | undefined
  }>(() => ({ held: chosen || 56, tape: null, kept: chosen }))

  const nextHeld = tape ?? (chosen || 56)
  if (view.tape !== tape) {
    setView({ held: nextHeld, tape, kept: chosen })
  } else if (view.kept !== chosen) {
    setView({ held: chosen || view.held, tape, kept: chosen })
  }

  const held = view.tape !== tape ? nextHeld : view.kept !== chosen ? chosen || view.held : view.held
  const row = sizeRow(held)
  const activeMeasure = sizeMeasures.find((item) => item.key === active) ?? sizeMeasures[0]

  function hold(size: ThobeSize) {
    setView({ held: size, tape, kept: chosen })
    onChoose?.(size)
  }

  function switchUnit(next: MeasureUnit) {
    setUnit(next)
    setDraft({
      chest: cm.chest == null ? '' : displayNumber(cm.chest, next),
      length: cm.length == null ? '' : displayNumber(cm.length, next),
      shoulder: cm.shoulder == null ? '' : displayNumber(cm.shoulder, next),
    })
  }

  function onDraft(key: MeasureKey, raw: string) {
    setActive(key)
    setDraft((current) => ({ ...current, [key]: raw }))
    const next = parseDraft(raw, unit)
    setCm((current) => {
      if (next == null) {
        if (current[key] == null) return current
        const cleared = { ...current }
        delete cleared[key]
        return cleared
      }
      if (current[key] === next) return current
      return { ...current, [key]: next }
    })
  }

  const lines = [
    {
      key: 'length' as const,
      x1: plate.length.x,
      y1: plate.length.y1,
      x2: plate.length.x,
      y2: plate.length.y2,
    },
    {
      key: 'chest' as const,
      x1: plate.chest.x1,
      y1: plate.chest.y,
      x2: plate.chest.x2,
      y2: plate.chest.y,
    },
    {
      key: 'shoulder' as const,
      x1: plate.shoulder.x1,
      y1: plate.shoulder.y,
      x2: plate.shoulder.x2,
      y2: plate.shoulder.y,
    },
  ]

  return (
    <View>
      <View style={compact ? styles.compactPlate : styles.plateRow}>
        <View style={compact ? styles.plateCompact : styles.plate}>
          <Svg viewBox={`0 0 ${plate.width} ${plate.height}`} width="100%" height="100%">
            <Path
              d="M58 58 L28 70 L18 152 L38 146 L48 92 L46 304 L114 304 L112 92 L122 146 L142 152 L132 70 L102 58 L94 70 L80 76 L66 70 Z"
              fill="none"
              stroke={color.ink}
              strokeWidth={1}
            />
            <Path d="M68 60 Q80 74 92 60" fill="none" stroke={color.ink} strokeWidth={1} />
            {lines.map((line) => {
              const on = line.key === active
              const stroke = on ? color.ink : 'rgba(111, 103, 92, 0.45)'
              const width = on ? 1.25 : 0.75
              return (
                <Line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={stroke}
                  strokeWidth={width}
                  onPress={() => setActive(line.key)}
                />
              )
            })}
            {lines.map((line) => {
              const on = line.key === active
              const horizontal = line.y1 === line.y2
              const stroke = on ? color.ink : 'rgba(111, 103, 92, 0.45)'
              const width = on ? 1.25 : 0.75
              if (horizontal) {
                return (
                  <Line
                    key={`${line.key}-a`}
                    x1={line.x1}
                    y1={line.y1 - 3.5}
                    x2={line.x1}
                    y2={line.y1 + 3.5}
                    stroke={stroke}
                    strokeWidth={width}
                  />
                )
              }
              return (
                <Line
                  key={`${line.key}-a`}
                  x1={line.x1 - 3.5}
                  y1={line.y1}
                  x2={line.x1 + 3.5}
                  y2={line.y1}
                  stroke={stroke}
                  strokeWidth={width}
                />
              )
            })}
            {lines.map((line) => {
              const on = line.key === active
              const horizontal = line.y1 === line.y2
              const stroke = on ? color.ink : 'rgba(111, 103, 92, 0.45)'
              const width = on ? 1.25 : 0.75
              if (horizontal) {
                return (
                  <Line
                    key={`${line.key}-b`}
                    x1={line.x2}
                    y1={line.y1 - 3.5}
                    x2={line.x2}
                    y2={line.y1 + 3.5}
                    stroke={stroke}
                    strokeWidth={width}
                  />
                )
              }
              return (
                <Line
                  key={`${line.key}-b`}
                  x1={line.x1 - 3.5}
                  y1={line.y2}
                  x2={line.x1 + 3.5}
                  y2={line.y2}
                  stroke={stroke}
                  strokeWidth={width}
                />
              )
            })}
          </Svg>
          {(Object.keys({ chest: 1, length: 1, shoulder: 1 }) as MeasureKey[]).map((key) => {
            const spot =
              key === 'shoulder'
                ? { x: (plate.shoulder.x1 + plate.shoulder.x2) / 2, y: plate.shoulder.y }
                : key === 'chest'
                  ? { x: (plate.chest.x1 + plate.chest.x2) / 2, y: plate.chest.y }
                  : { x: plate.length.x, y: (plate.length.y1 + plate.length.y2) / 2 }
            return (
              <Text
                key={key}
                style={[
                  styles.mark,
                  { left: `${(spot.x / plate.width) * 100}%`, top: `${(spot.y / plate.height) * 100}%` },
                  active === key ? styles.markOn : null,
                ]}
              >
                {key === 'chest'
                  ? formatMeasure(row.chest, unit)
                  : key === 'length'
                    ? formatMeasure(row.length, unit)
                    : formatMeasure(row.shoulder, unit)}
              </Text>
            )
          })}
        </View>
        <View style={styles.read}>
          <View style={styles.readHead}>
            <Text style={styles.size}>{held}</Text>
            <View style={styles.units}>
              {(['cm', 'in'] as const).map((value) => (
                <Pressable key={value} onPress={() => switchUnit(value)} accessibilityRole="button" accessibilityState={{ selected: unit === value }}>
                  <Text style={[styles.unit, unit === value && styles.unitOn]}>{value}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Text style={styles.figures}>
            {`${formatMeasure(row.chest, unit)} chest  /  ${formatMeasure(row.length, unit)} length  /  ${formatMeasure(row.shoulder, unit)} shoulder`}
          </Text>
          <View style={styles.measures}>
            {sizeMeasures.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setActive(item.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active === item.key }}
              >
                <Text style={[styles.measureTitle, active === item.key && styles.measureOn]}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.copy}>{activeMeasure.copy}</Text>
          <Text style={styles.note}>
            {reading?.copy ?? 'Measure a thobe you own, or choose a size to read the cut.'}
          </Text>
          {onChoose && reading?.size && reading.size !== chosen ? (
            <Pressable onPress={() => onChoose(reading.size as ThobeSize)} accessibilityRole="button">
              <Text style={styles.keep}>{`Keep ${reading.size}`}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={[styles.label, styles.legend]}>From a thobe you own</Text>
      <View style={compact ? styles.fieldsStack : styles.fields}>
        {sizeMeasures.map((item) => (
          <View key={item.key} style={styles.field}>
            <Text style={styles.label}>{item.title}</Text>
            <TextInput
              value={draft[item.key]}
              onChangeText={(value) => onDraft(item.key, value)}
              onFocus={() => setActive(item.key)}
              keyboardType="decimal-pad"
              placeholder={displayNumber(row[item.key], unit)}
              placeholderTextColor="rgba(111, 103, 92, 0.45)"
              accessibilityLabel={`${item.title}, from a thobe you own`}
              style={styles.input}
            />
          </View>
        ))}
      </View>

      <View style={styles.head}>
        <Text style={[styles.cell, styles.label, styles.sizeCol]}>Size</Text>
        {sizeMeasures.map((item) => (
          <Pressable key={item.key} style={styles.cell} onPress={() => setActive(item.key)} accessibilityRole="button">
            <Text style={[styles.label, active === item.key && styles.measureOn]}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
      {sizeChart.map((entry) => {
        const onPiece = chosen === entry.size
        const readingRow = held === entry.size
        return (
          <Pressable
            key={entry.size}
            onPress={() => hold(entry.size)}
            accessibilityRole="button"
            accessibilityState={{ selected: readingRow }}
            style={styles.row}
          >
            <Text style={[styles.cell, styles.sizeCol, styles.rowSize, onPiece && styles.rowKept, !onPiece && readingRow && styles.rowHeld]}>
              {entry.size}
            </Text>
            <Text style={[styles.cell, styles.value]}>{formatMeasure(entry.chest, unit)}</Text>
            <Text style={[styles.cell, styles.value]}>{formatMeasure(entry.length, unit)}</Text>
            <Text style={[styles.cell, styles.value]}>{formatMeasure(entry.shoulder, unit)}</Text>
          </Pressable>
        )
      })}
      {compact ? null : <Text style={styles.note}>{sizeNote}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  plateRow: {
    gap: 28,
  },
  compactPlate: {
    gap: 20,
  },
  plate: {
    width: 168,
    height: 336,
  },
  plateCompact: {
    width: 132,
    height: 264,
  },
  mark: {
    position: 'absolute',
    backgroundColor: color.ivory,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 10,
    fontWeight: '300',
    transform: [{ translateX: -18 }, { translateY: -7 }],
  },
  markOn: {
    color: color.ink,
  },
  read: {
    gap: 12,
  },
  readHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  size: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 48,
    fontWeight: '300',
    lineHeight: 48,
  },
  units: {
    flexDirection: 'row',
    gap: 16,
  },
  unit: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  unitOn: {
    color: color.ink,
  },
  figures: {
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
  },
  measures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 4,
  },
  measureTitle: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  measureOn: {
    color: color.ink,
  },
  copy: {
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
  },
  legend: {
    marginTop: 28,
  },
  fields: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
    marginBottom: 28,
  },
  fieldsStack: {
    marginTop: 8,
    marginBottom: 28,
    gap: 8,
  },
  field: {
    flex: 1,
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.rule,
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 28,
    fontWeight: '300',
    paddingVertical: 6,
  },
  head: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.rule,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  rowSize: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 20,
    fontWeight: '300',
  },
  rowKept: {
    backgroundColor: color.ink,
    color: color.ivory,
    textAlign: 'center',
    overflow: 'hidden',
  },
  rowHeld: {
    backgroundColor: color.ivoryDeep,
    textAlign: 'center',
    overflow: 'hidden',
  },
  value: {
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 14,
    fontWeight: '300',
  },
  note: {
    marginTop: 8,
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
  },
  keep: {
    color: color.ink,
    fontFamily: type.sansRegular,
    fontSize: 10,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
})
