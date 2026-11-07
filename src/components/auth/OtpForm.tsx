import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors } from '@/theme/colors'
import { PrimaryButton } from './Buttons'
import { AuthScreen, ScreenTitle } from './AuthScreen'
import { OtpInput } from './OtpInput'

type Props = {
  email: string
  code: string
  onChangeCode: (v: string) => void
  onSubmit: () => void
  onResend: () => Promise<void> | void
  onBack: () => void
  loading?: boolean
  error?: string | null
  submitLabel?: string
}

const RESEND_SECONDS = 60

/** Layar kode OTP yang dipakai bersama: verifikasi daftar, reset sandi, dan Device Trust. */
export function OtpForm({
  email,
  code,
  onChangeCode,
  onSubmit,
  onResend,
  onBack,
  loading,
  error,
  submitLabel = 'Verifikasi',
}: Props) {
  const [seconds, setSeconds] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  // Kirim otomatis begitu 6 digit terisi.
  useEffect(() => {
    if (code.length === 6 && !loading) onSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const resend = async () => {
    await onResend()
    onChangeCode('')
    setSeconds(RESEND_SECONDS)
  }

  const mm = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <AuthScreen onBack={onBack}>
      <ScreenTitle
        title="Masukkan kode"
        subtitle={
          <>
            Kami mengirim kode 6 digit ke <Text style={styles.email}>{email}</Text>
          </>
        }
      />

      <OtpInput value={code} onChange={onChangeCode} hasError={!!error} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.cta}>
        <PrimaryButton
          title={submitLabel}
          onPress={onSubmit}
          loading={loading}
          disabled={code.length < 6}
        />
      </View>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Belum menerima kode? </Text>
        {seconds > 0 ? (
          <Text style={styles.resendWait}>Kirim ulang ({mm})</Text>
        ) : (
          <Pressable onPress={resend} hitSlop={8} accessibilityRole="button">
            <Text style={styles.resendLink}>Kirim ulang</Text>
          </Pressable>
        )}
      </View>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  email: { fontWeight: '700', color: colors.ink },
  error: { marginTop: 10, fontSize: 13, color: colors.danger },
  cta: { marginTop: 24 },
  resendRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendText: { fontSize: 14, color: colors.muted },
  resendWait: { fontSize: 14, color: colors.muted },
  resendLink: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
})
