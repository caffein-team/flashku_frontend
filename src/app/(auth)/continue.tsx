import { useSignUp } from '@clerk/expo'
import { Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { AuthScreen, ScreenTitle } from '@/components/auth/AuthScreen'
import { PrimaryButton } from '@/components/auth/Buttons'
import { TextField } from '@/components/auth/TextField'
import { type AuthError, parseClerkError } from '@/lib/clerk-errors'
import { createNavigate } from '@/lib/finalize'
import { colors } from '@/theme/colors'

/**
 * Layar "Lengkapi akunmu" untuk alur OAuth (Google).
 * Muncul hanya jika Clerk meminta data tambahan (sign-up status 'missing_requirements'),
 * mis. nama wajib tapi tidak dikirim Google. Pengguna yang mencoba Masuk tapi belum punya akun
 * juga berakhir di sini, karena Clerk otomatis mentransfer alurnya ke sign-up.
 */
export default function ContinueScreen() {
  const { signUp, fetchStatus } = useSignUp()
  const router = useRouter()

  const [name, setName] = useState('')
  const [error, setError] = useState<AuthError | null>(null)
  const loading = fetchStatus === 'fetching'

  // Tidak ada yang perlu dilengkapi -> kembali ke Masuk.
  if (signUp.status !== 'missing_requirements') return <Redirect href="/sign-in" />

  const needsName = signUp.missingFields.some((f) => f === 'first_name' || f === 'last_name')
  const unsupported = signUp.missingFields.filter((f) => f !== 'first_name' && f !== 'last_name')

  const handleSubmit = async () => {
    setError(null)
    const fullName = name.trim()
    if (!fullName) return setError({ message: 'Nama wajib diisi.', field: 'name' })

    const [firstName, ...rest] = fullName.split(/\s+/)
    const { error: e } = await signUp.update({ firstName, lastName: rest.join(' ') || firstName })
    if (e) return setError(parseClerkError(e))

    if (signUp.status === 'complete') {
      const { error: fe } = await signUp.finalize({ navigate: createNavigate(router) })
      if (fe) setError(parseClerkError(fe))
    } else {
      setError({ message: 'Pendaftaran belum selesai. Coba lagi.' })
    }
  }

  return (
    <AuthScreen onBack={() => router.replace('/sign-in')}>
      <ScreenTitle
        title="Lengkapi akunmu"
        subtitle="Satu langkah lagi untuk menyelesaikan pendaftaran."
      />

      {needsName ? (
        <>
          <TextField
            label="Nama"
            placeholder="Nama lengkap"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            error={error?.field === 'name' ? error.message : null}
            onSubmitEditing={handleSubmit}
            returnKeyType="go"
          />
          {error && error.field !== 'name' ? <Text style={styles.banner}>{error.message}</Text> : null}
          <View style={styles.cta}>
            <PrimaryButton title="Lanjutkan" onPress={handleSubmit} loading={loading} />
          </View>
        </>
      ) : (
        <Text style={styles.banner}>
          Pengaturan akun memerlukan data tambahan ({unsupported.join(', ')}) yang belum didukung
          di layar ini.
        </Text>
      )}
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  banner: { marginBottom: 12, fontSize: 13, color: colors.danger },
  cta: { marginTop: 4 },
})
