import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
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
  type AuthError,
  isValidEmail,
  parseClerkError,
} from "@/lib/clerk-errors";
import { createNavigate } from "@/lib/finalize";
import { colors } from "@/theme/colors";

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<AuthError | null>(null);

  const loading = fetchStatus === "fetching";
  const fieldError = (f: AuthError["field"]) =>
    error?.field === f ? error?.message : null;

  const finish = async () => {
    const { error: e } = await signIn.finalize({
      navigate: createNavigate(router),
    });
    if (e) setError(parseClerkError(e));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!isValidEmail(email))
      return setError({
        message: "Masukkan email yang valid.",
        field: "email",
      });
    if (!password)
      return setError({
        message: "Kata sandi wajib diisi.",
        field: "password",
      });

    const { error: e } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });
    if (e) return setError(parseClerkError(e));

    if (signIn.status === "complete") {
      await finish();
    } else if (signIn.status === "needs_client_trust") {
      // Device Trust: perangkat baru -> Clerk minta kode OTP dari email.
      const { error: sendErr } = await signIn.mfa.sendEmailCode();
      if (sendErr) setError(parseClerkError(sendErr));
    } else if (signIn.status === "needs_second_factor") {
      setError({
        message:
          "Akun ini memakai verifikasi dua langkah, yang belum didukung di aplikasi.",
      });
    } else {
      setError({ message: "Proses masuk belum selesai. Coba lagi." });
    }
  };

  const handleVerify = async () => {
    setError(null);
    const { error: e } = await signIn.mfa.verifyEmailCode({ code });
    if (e) {
      setCode("");
      return setError(parseClerkError(e));
    }
    if (signIn.status === "complete") await finish();
    else setError({ message: "Verifikasi belum selesai. Coba lagi." });
  };

  // OTP untuk perangkat baru
  if (signIn.status === "needs_client_trust") {
    return (
      <OtpForm
        email={email.trim()}
        code={code}
        onChangeCode={setCode}
        onSubmit={handleVerify}
        onResend={async () => {
          await signIn.mfa.sendEmailCode();
        }}
        onBack={() => {
          setCode("");
          setError(null);
          signIn.reset();
        }}
        loading={loading}
        error={error?.message}
      />
    );
  }

  return (
    <AuthScreen
      variant="hero"
      subtitle="Belajar bahasa Jepang lewat lagu favoritmu"
      footer={
        <FooterLink
          text="Belum punya akun?"
          linkText="Daftar"
          href="/sign-up"
        />
      }
    >
      <ScreenTitle
        title="Selamat datang kembali"
        subtitle="Masuk untuk melanjutkan belajarmu."
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
        placeholder="Masukkan kata sandi"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        error={fieldError("password")}
        onSubmitEditing={handleSubmit}
        returnKeyType="go"
      />

      <View style={styles.forgotRow}>
        <Link href="/forgot-password" style={styles.forgot}>
          Lupa kata sandi?
        </Link>
      </View>

      {error && !error.field ? (
        <Text style={styles.banner}>{error.message}</Text>
      ) : null}

      <PrimaryButton title="Masuk" onPress={handleSubmit} loading={loading} />
      <OrDivider />
      <GoogleButton label="Lanjutkan dengan Google" />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  forgotRow: { alignItems: "flex-end", marginTop: -4, marginBottom: 20 },
  forgot: { fontSize: 13, fontWeight: "700", color: colors.primaryDark },
  banner: { marginBottom: 12, fontSize: 13, color: colors.danger },
});
