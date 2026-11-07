import type { ReactNode } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

type ButtonProps = {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  leading?: ReactNode
}

export function PrimaryButton({ title, onPress, loading, disabled }: ButtonProps) {
  const off = disabled || loading
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      style={({ pressed }) => [styles.base, styles.primary, off && styles.off, pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryText}>{title}</Text>}
    </Pressable>
  )
}

export function OutlineButton({ title, onPress, loading, disabled, leading }: ButtonProps) {
  const off = disabled || loading
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      style={({ pressed }) => [styles.base, styles.outline, off && styles.off, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View style={styles.row}>
          {leading}
          <Text style={styles.outlineText}>{title}</Text>
        </View>
      )}
    </Pressable>
  )
}

export function OrDivider() {
  return (
    <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={styles.dividerText}>atau</Text>
      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({
  base: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.primary },
  primaryText: { fontSize: 16, fontWeight: '700', color: colors.white },
  outline: { borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bg },
  outlineText: { fontSize: 16, fontWeight: '600', color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  off: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dividerText: { fontSize: 12, color: colors.muted },
})
