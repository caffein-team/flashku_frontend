import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  AuthScreen,
  FooterLink,
  ScreenTitle,
} from "@/components/auth/AuthScreen";
import { PrimaryButton } from "@/components/auth/Buttons";
import { OtpForm } from "@/components/auth/OtpForm";
import { TextField } from "@/components/auth/TextField";
import {
  type AuthError,
  isValidEmail,
  parseClerkError,
} from "@/lib/clerk-errors";
import { createNavigate } from "@/lib/finalize";
import { colors } from "@/theme/colors";

/**
 * Tiga langkah dalam satu layar (state Clerk disimpan di hook useSignIn):
 *   1) email -> kirim kode   2) OTP   3) kata sandi baru
 */
export default function ForgotPasswordScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const loading = fetchStatus === "fetching";
  const fieldError = (f: AuthError["field"]) =>
    error?.field === f ? error?.message : null;

  const step =
    signIn.status === "needs_new_password"
      ? "password"
      : codeSent
        ? "code"
        : "email";

  // Langkah 1
  const sendCode = async () => {
    setError(null);
    if (!isValidEmail(email))
      return setError({
        message: "Masukkan email yang valid.",
        field: "email",
      });

    const { error: createErr } = await signIn.create({
      identifier: email.trim(),
    });
    if (createErr) return setError(parseClerkError(createErr));

    const { error: sendErr } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendErr) return setError(parseClerkError(sendErr));

    setCodeSent(true);
  };

  // Langkah 2
  const verifyCode = async () => {
    setError(null);
    const { error: e } = await signIn.resetPasswordEmailCode.verifyCode({
      code,
    });
    if (e) {
      setCode("");
      setError(parseClerkError(e));
    }
    // Jika sukses, signIn.status berubah menjadi 'needs_new_password' dan layar berganti.
  };

  // Langkah 3
  const submitNewPassword = async () => {
    setError(null);
    if (password.length < 8) {
      return setError({
        message: "Kata sandi minimal 8 karakter.",
        field: "password",
      });
    }
    if (password !== confirm) {
      return setError({
        message: "Konfirmasi kata sandi tidak cocok.",
        field: "confirm",
      });
    }

    const { error: e } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (e) return setError(parseClerkError(e));

    if (signIn.status === "complete") {
      const { error: fe } = await signIn.finalize({
        navigate: createNavigate(router),
      });
      if (fe) setError(parseClerkError(fe));
    } else if (signIn.status === "needs_second_factor") {
      setError({
        message:
          "Akun ini memakai verifikasi dua langkah, yang belum didukung di aplikasi.",
      });
    } else {
      setError({ message: "Proses belum selesai. Coba lagi." });
    }
  };

  const startOver = () => {
    setCode("");
    setPassword("");
    setConfirm("");
    setError(null);
    setCodeSent(false);
    signIn.reset();
  };

  if (step === "code") {
    return (
      <OtpForm
        email={email.trim()}
        code={code}
        onChangeCode={setCode}
        onSubmit={verifyCode}
        onResend={async () => {
          await signIn.resetPasswordEmailCode.sendCode();
        }}
        onBack={startOver}
        loading={loading}
        error={error?.message}
      />
    );
  }

  if (step === "password") {
    return (
      <AuthScreen onBack={startOver}>
        <ScreenTitle
          title="Buat kata sandi baru"
          subtitle="Gunakan minimal 8 karakter yang belum pernah kamu pakai di tempat lain."
        />
        <TextField
          label="Kata sandi baru"
          placeholder="Minimal 8 karakter"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          error={fieldError("password")}
        />
        <TextField
          label="Ulangi kata sandi"
          placeholder="Ketik ulang kata sandi"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          error={fieldError("confirm")}
          onSubmitEditing={submitNewPassword}
          returnKeyType="go"
        />
        {error && !error.field ? (
          <Text style={styles.banner}>{error.message}</Text>
        ) : null}
        <View style={styles.cta}>
          <PrimaryButton
            title="Simpan & masuk"
            onPress={submitNewPassword}
            loading={loading}
          />
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      onBack={() => router.back()}
      footer={
        <FooterLink
          text="Ingat kata sandimu?"
          linkText="Masuk"
          href="/sign-in"
        />
      }
    >
      <ScreenTitle
        title="Lupa kata sandi?"
        subtitle="Masukkan email akunmu. Kami akan mengirim kode untuk mengatur ulang kata sandi."
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
        onSubmitEditing={sendCode}
        returnKeyType="send"
      />
      {error && !error.field ? (
        <Text style={styles.banner}>{error.message}</Text>
      ) : null}
      <View style={styles.cta}>
        <PrimaryButton
          title="Kirim kode"
          onPress={sendCode}
          loading={loading}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: 12, fontSize: 13, color: colors.danger },
  cta: { marginTop: 4 },
});
