import { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Svg, { Line, Path } from 'react-native-svg'

import type { ThobeSize } from './catalogue'
import {
  formatMeasure,
  measureSpan,
  measureToCm,
  readCut,
  sizeChart,
  sizeMeasures,
  sizeNote,
  sizeRow,
  sketchOf,
  type MeasureKey,
  type MeasureUnit,
} from './catalogue'
import { color, type } from './theme'

function tapeSpan(key: MeasureKey, unit: MeasureUnit) {
  const span = measureSpan[key]
  if (unit === 'cm') return { min: span.min, max: span.max, step: 1 }
  return {
    min: Math.round((span.min / 2.54) * 10) / 10,
    max: Math.round((span.max / 2.54) * 10) / 10,
    step: 0.1,
  }
}

function HouseTape({
  min,
  max,
  step,
  value,
  label,
  onChange,
  onGive,
}: {
  min: number
  max: number
  step: number
  value: number
  label: string
  onChange: (value: number) => void
  onGive: () => void
}) {
  const width = useRef(1)
  const fill = ((value - min) / (max - min)) * 100

  function fromX(x: number) {
    const ratio = Math.min(1, Math.max(0, x / width.current))
    const raw = min + ratio * (max - min)
    const stepped = Math.round(raw / step) * step
    onChange(Math.min(max, Math.max(min, Math.round(stepped * 10) / 10)))
  }

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      onLayout={(event) => {
        width.current = event.nativeEvent.layout.width
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => fromX(event.nativeEvent.locationX)}
      onResponderMove={(event) => fromX(event.nativeEvent.locationX)}
      onResponderRelease={onGive}
      style={styles.trackHit}
    >
      <View style={styles.track} />
      <View style={[styles.trackOn, { width: `${fill}%` }]} />
      <View style={[styles.thumb, { left: `${fill}%` }]} />
    </View>
  )
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
  const [anchor, setAnchor] = useState(() => sizeRow(chosen || 56))
  const [moved, setMoved] = useState<Partial<Record<MeasureKey, number>>>({})
  const touched = moved.chest != null || moved.length != null || moved.shoulder != null
  if (!touched && anchor.size !== (chosen || 56)) setAnchor(sizeRow(chosen || 56))
  const tapeCm = {
    chest: moved.chest ?? anchor.chest,
    length: moved.length ?? anchor.length,
    shoulder: moved.shoulder ?? anchor.shoulder,
  }
  const tapeRef = useRef(tapeCm)
  const movedRef = useRef(moved)
  const reading = touched ? readCut(tapeCm) : null
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

  function onSlide(key: MeasureKey, displayValue: number) {
    const asCm = measureToCm(displayValue, unit)
    const next = { ...moved, [key]: asCm }
    tapeRef.current = {
      chest: next.chest ?? anchor.chest,
      length: next.length ?? anchor.length,
      shoulder: next.shoulder ?? anchor.shoulder,
    }
    movedRef.current = next
    setMoved(next)
    setActive(key)
  }

  function give() {
    const hasTape =
      movedRef.current.chest != null ||
      movedRef.current.length != null ||
      movedRef.current.shoulder != null
    if (!hasTape) return
    const named = readCut(tapeRef.current)?.size
    if (named && onChoose && named !== chosen) onChoose(named)
  }

  const sketch = sketchOf(tapeCm)
  const lines = sketch.lines

  return (
    <View>
      <View style={compact ? styles.compactPlate : styles.plateRow}>
        <View style={compact ? styles.plateCompact : styles.plate}>
          <Svg viewBox={`0 0 ${sketch.width} ${sketch.height}`} width="100%" height="100%">
            <Path d={sketch.body} fill="none" stroke={color.ink} strokeWidth={1} />
            <Path d={sketch.collar} fill="none" stroke={color.ink} strokeWidth={1} />
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
            const line = lines.find((item) => item.key === key) ?? lines[0]
            const spot = { x: (line.x1 + line.x2) / 2, y: (line.y1 + line.y2) / 2 }
            return (
              <Text
                key={key}
                style={[
                  styles.mark,
                  { left: `${(spot.x / sketch.width) * 100}%`, top: `${(spot.y / sketch.height) * 100}%` },
                  active === key ? styles.markOn : null,
                ]}
              >
                {formatMeasure(tapeCm[key], unit)}
              </Text>
            )
          })}
        </View>
        <View style={styles.read}>
          <View style={styles.readHead}>
            <Text style={styles.size}>{held}</Text>
            <View style={styles.units}>
              {(['cm', 'in'] as const).map((value) => (
                <Pressable key={value} onPress={() => setUnit(value)} accessibilityRole="button" accessibilityState={{ selected: unit === value }}>
                  <Text style={[styles.unit, unit === value && styles.unitOn]}>{value}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Text style={styles.cut}>The cut</Text>
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
            {reading?.copy ?? 'Move the tape to a thobe you own.'}
          </Text>
          {onChoose && reading?.size && reading.size !== chosen ? (
            <Pressable onPress={() => onChoose(reading.size as ThobeSize)} accessibilityRole="button">
              <Text style={styles.keep}>{`Keep ${reading.size}`}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={[styles.label, styles.legend]}>From a thobe you own</Text>
      <View style={styles.tapes}>
        {sizeMeasures.map((item) => {
          const span = tapeSpan(item.key, unit)
          const shown = unit === 'cm' ? tapeCm[item.key] : Number((tapeCm[item.key] / 2.54).toFixed(1))
          return (
            <View key={item.key} style={styles.tape}>
              <View style={styles.tapeHead}>
                <Text style={styles.label}>{item.title}</Text>
                <Text style={styles.tapeValue}>{formatMeasure(tapeCm[item.key], unit)}</Text>
              </View>
              <HouseTape
                min={span.min}
                max={span.max}
                step={span.step}
                value={shown}
                label={`${item.title}, ${formatMeasure(tapeCm[item.key], unit)}`}
                onChange={(value) => onSlide(item.key, value)}
                onGive={give}
              />
              <View style={styles.ticks}>
                {sizeChart.map((entry) => {
                  const mark = unit === 'cm' ? entry[item.key] : entry[item.key] / 2.54
                  const left = ((mark - span.min) / (span.max - span.min)) * 100
                  const nearest = sizeChart.reduce((best, candidate) =>
                    Math.abs(candidate[item.key] - tapeCm[item.key]) <
                    Math.abs(best[item.key] - tapeCm[item.key])
                      ? candidate
                      : best,
                  )
                  const display =
                    unit === 'cm' ? entry[item.key] : Number((entry[item.key] / 2.54).toFixed(1))
                  return (
                    <Pressable
                      key={entry.size}
                      accessibilityRole="button"
                      accessibilityLabel={`Set ${item.title.toLowerCase()} to size ${entry.size}, ${formatMeasure(entry[item.key], unit)}`}
                      onPress={() => {
                        onSlide(item.key, display)
                        give()
                      }}
                      style={[styles.tick, { left: `${left}%` }]}
                    >
                      <Text style={[styles.tickText, nearest.size === entry.size && styles.tickOn]}>
                        {entry.size}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          )
        })}
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
    aspectRatio: 160 / 348,
  },
  plateCompact: {
    width: 132,
    aspectRatio: 160 / 348,
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
  cut: {
    marginTop: 14,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  figures: {
    marginTop: 6,
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
  tapes: {
    marginTop: 16,
    marginBottom: 28,
    gap: 22,
  },
  tape: {
    gap: 4,
  },
  tapeHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tapeValue: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  trackHit: {
    height: 28,
    justifyContent: 'center',
  },
  track: {
    height: 1,
    backgroundColor: color.rule,
  },
  trackOn: {
    position: 'absolute',
    left: 0,
    height: 1,
    backgroundColor: color.ink,
  },
  thumb: {
    position: 'absolute',
    width: 11,
    height: 11,
    marginLeft: -5,
    backgroundColor: color.ink,
  },
  ticks: {
    position: 'relative',
    height: 16,
  },
  tick: {
    position: 'absolute',
    transform: [{ translateX: -10 }],
  },
  tickText: {
    color: color.stone,
    fontFamily: type.sans,
    fontSize: 10,
    fontWeight: '300',
  },
  tickOn: {
    color: color.ink,
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
