import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'

import { colors } from '@/theme/colors'

type Props = TextInputProps & { label: string; error?: string | null }

export function TextField({ label, error, secureTextEntry, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(true)
  const isPassword = !!secureTextEntry

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.focused, !!error && styles.invalid]}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && hidden}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { marginBottom: 16 },
  label: { marginBottom: 8, fontSize: 14, fontWeight: '700', color: colors.ink },
  field: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  focused: { borderColor: colors.primary },
  invalid: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 16, color: colors.ink, paddingVertical: 0 },
  error: { marginTop: 6, fontSize: 12, color: colors.danger },
})
