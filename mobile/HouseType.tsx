import { Pressable, StyleSheet, Text, View } from 'react-native'

import { color, type } from './theme'

export function Eyebrow({ children, bronze }: { children: string; bronze?: boolean }) {
  return (
    <Text style={[styles.eyebrow, bronze && styles.bronze]}>{children}</Text>
  )
}

export function Display({
  children,
  ivory,
  size = 40,
}: {
  children: string
  ivory?: boolean
  size?: number
}) {
  return (
    <Text style={[styles.display, { fontSize: size, lineHeight: size * 1.08 }, ivory && styles.ivory]}>
      {children}
    </Text>
  )
}

export function Body({ children, ivory }: { children: string; ivory?: boolean }) {
  return <Text style={[styles.body, ivory && styles.ivorySoft]}>{children}</Text>
}

export function OutlineButton({
  label,
  onPress,
  invert,
}: {
  label: string
  onPress: () => void
  invert?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.outline,
        invert && styles.outlineIvory,
        pressed && (invert ? styles.outlineIvoryPressed : styles.outlinePressed),
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.outlineLabel,
            invert && styles.outlineLabelIvory,
            pressed && (invert ? styles.outlineLabelIvoryPressed : styles.outlineLabelPressed),
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  )
}

export function GhostLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.ghost}>
        <Text style={styles.ghostLabel}>{label}</Text>
        <Text style={styles.ghostArrow}>→</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  eyebrow: {
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  bronze: {
    color: color.bronze,
  },
  display: {
    color: color.ink,
    fontFamily: type.displayLight,
    fontWeight: '300',
    letterSpacing: -0.4,
  },
  ivory: {
    color: color.ivory,
  },
  ivorySoft: {
    color: 'rgba(242, 235, 220, 0.8)',
  },
  body: {
    color: color.inkSoft,
    fontFamily: type.sans,
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 28,
    maxWidth: 340,
  },
  outline: {
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.ink,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  outlineIvory: {
    borderColor: color.ivory,
  },
  outlinePressed: {
    backgroundColor: color.ink,
  },
  outlineIvoryPressed: {
    backgroundColor: color.ivory,
  },
  outlineLabel: {
    color: color.ink,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  outlineLabelIvory: {
    color: color.ivory,
  },
  outlineLabelPressed: {
    color: color.ivory,
  },
  outlineLabelIvoryPressed: {
    color: color.ink,
  },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.ink,
    paddingBottom: 4,
    alignSelf: 'flex-start',
  },
  ghostLabel: {
    color: color.ink,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  ghostArrow: {
    color: color.ink,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.55,
  },
})
