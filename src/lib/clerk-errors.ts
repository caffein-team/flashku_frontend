export type AuthErrorField = 'email' | 'password' | 'confirm' | 'code' | 'name'
export type AuthError = { message: string; field?: AuthErrorField }

const KNOWN: Record<string, AuthError> = {
  form_identifier_not_found: { message: 'Email ini belum terdaftar.', field: 'email' },
  form_identifier_exists: { message: 'Email ini sudah terdaftar. Silakan masuk.', field: 'email' },
  form_param_format_invalid: { message: 'Format email atau data belum valid.' },
  form_password_incorrect: {
    message: 'Kata sandi salah. Coba lagi atau atur ulang kata sandimu.',
    field: 'password',
  },
  form_password_pwned: {
    message: 'Kata sandi ini terlalu umum dan pernah bocor. Pakai kata sandi lain.',
    field: 'password',
  },
  form_password_length_too_short: { message: 'Kata sandi minimal 8 karakter.', field: 'password' },
  form_password_not_strong_enough: {
    message: 'Kata sandi kurang kuat. Tambahkan huruf besar, angka, atau simbol.',
    field: 'password',
  },
  form_code_incorrect: { message: 'Kode salah. Periksa lagi kode di emailmu.', field: 'code' },
  verification_expired: { message: 'Kode sudah kedaluwarsa. Kirim ulang kode baru.', field: 'code' },
  verification_failed: {
    message: 'Terlalu banyak kode salah. Kirim ulang kode baru.',
    field: 'code',
  },
  too_many_requests: { message: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.' },
  network_error: { message: 'Tidak ada koneksi internet. Periksa jaringanmu.' },
}

const PARAM_TO_FIELD: Record<string, AuthErrorField> = {
  identifier: 'email',
  email_address: 'email',
  password: 'password',
  code: 'code',
  first_name: 'name',
}

/** Ubah error Clerk menjadi pesan Bahasa Indonesia + field yang bermasalah. */
export function parseClerkError(error: unknown): AuthError {
  const e = error as any
  const first = e?.errors?.[0] ?? e
  const code: string | undefined = first?.code
  const known = code ? KNOWN[code] : undefined
  if (known) return known

  const param: string | undefined = first?.meta?.paramName
  return {
    message: first?.longMessage ?? first?.message ?? 'Terjadi kesalahan. Coba lagi.',
    field: param ? PARAM_TO_FIELD[param] : undefined,
  }
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
