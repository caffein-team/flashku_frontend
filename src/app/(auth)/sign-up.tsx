import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  AuthScreen,
  FooterLink,
  ScreenTitle,
} from "@/components/auth/AuthScreen";
import { OrDivider, PrimaryButton } from "@/components/auth/Buttons";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { OtpForm } from "@/components/auth/OtpForm";
import { TextField } from "@/components/auth/TextField";
import {
  isValidEmail,
  parseClerkError,
  type AuthError,
} from "@/lib/clerk-errors";
import { createNavigate } from "@/lib/finalize";
import { colors } from "@/theme/colors";

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [editing, setEditing] = useState(false); // kembali dari OTP ke form
  const [error, setError] = useState<AuthError | null>(null);

  const loading = fetchStatus === "fetching";
  const fieldError = (f: AuthError["field"]) =>
    error?.field === f ? error?.message : null;

  // Kondisi persis seperti di dokumentasi Clerk: email dibuat, tinggal diverifikasi.
  const needsEmailCode =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const handleSubmit = async () => {
    setError(null);
    const fullName = name.trim();
    if (!fullName)
      return setError({ message: "Nama wajib diisi.", field: "name" });
    if (!isValidEmail(email))
      return setError({
        message: "Masukkan email yang valid.",
        field: "email",
      });
    if (password.length < 8) {
      return setError({
        message: "Kata sandi minimal 8 karakter.",
        field: "password",
      });
    }

    const [firstName, ...rest] = fullName.split(/\s+/);
    const { error: e } = await signUp.password({
      emailAddress: email.trim(),
      password,
      firstName,
      lastName: rest.join(" ") || undefined,
    });
    if (e) return setError(parseClerkError(e));

    const { error: sendErr } = await signUp.verifications.sendEmailCode();
    if (sendErr) return setError(parseClerkError(sendErr));
    setEditing(false);
  };

  const handleVerify = async () => {
    setError(null);
    const { error: e } = await signUp.verifications.verifyEmailCode({ code });
    if (e) {
      setCode("");
      return setError(parseClerkError(e));
    }

    if (signUp.status === "complete") {
      const { error: fe } = await signUp.finalize({
        navigate: createNavigate(router),
      });
      if (fe) setError(parseClerkError(fe));
    } else {
      setError({ message: "Pendaftaran belum selesai. Coba lagi." });
    }
  };

  if (needsEmailCode && !editing) {
    return (
      <OtpForm
        email={email.trim()}
        code={code}
        onChangeCode={setCode}
        onSubmit={handleVerify}
        onResend={async () => {
          await signUp.verifications.sendEmailCode();
        }}
        onBack={() => {
          setCode("");
          setError(null);
          setEditing(true);
        }}
        loading={loading}
        error={error?.message}
        submitLabel="Verifikasi & masuk"
      />
    );
  }

  return (
    <AuthScreen
      footer={
        <FooterLink text="Sudah punya akun?" linkText="Masuk" href="/sign-in" />
      }
    >
      <ScreenTitle
        title="Buat akun baru"
        subtitle="Mulai belajar bahasa Jepang dari lagu favoritmu."
      />

      <TextField
        label="Nama"
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        error={fieldError("name")}
      />
      <TextField
        label="Email"
        placeholder="nama@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        error={fieldError("email")}
      />
      <TextField
        label="Kata sandi"
        placeholder="Minimal 8 karakter"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        error={fieldError("password")}
        onSubmitEditing={handleSubmit}
        returnKeyType="go"
      />

      {error && !error.field ? (
        <Text style={styles.banner}>{error.message}</Text>
      ) : null}

      <View style={styles.cta}>
        <PrimaryButton
          title="Daftar"
          onPress={handleSubmit}
          loading={loading}
        />
      </View>
      <OrDivider />
      <GoogleButton label="Daftar dengan Google" />

      {/* Wajib untuk web jika memakai legacy bot protection; native iOS/Android melewati CAPTCHA. */}
      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: 12, fontSize: 13, color: colors.danger },
  cta: { marginTop: 4 },
});
