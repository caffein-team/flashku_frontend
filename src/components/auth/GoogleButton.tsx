import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

import { APP_SCHEME } from "@/lib/app-scheme";
import { createNavigate } from "@/lib/finalize";
import { colors } from "@/theme/colors";
import { OutlineButton } from "./Buttons";

// Wajib agar sesi browser OAuth ditutup saat app dibuka kembali lewat deep link.
WebBrowser.maybeCompleteAuthSession();

// Memanaskan browser di Android supaya OAuth lebih cepat terbuka.
function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

/**
 * Google lewat OAuth connection Clerk (useSSO).
 * Satu alur untuk Masuk dan Daftar: jika akun belum ada, Clerk otomatis membuatnya (transfer).
 */
export function GoogleButton({ label }: { label: string }) {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    try {
      setLoading(true);
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: APP_SCHEME,
        path: "continue",
      });
      if (__DEV__) console.log("[OAuth] redirectUrl:", redirectUrl);

      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl,
        });

      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
          navigate: createNavigate(router),
        });
        return;
      }

      // Sesi belum terbentuk: cek apa yang kurang.
      if (signUp?.status === "missing_requirements") {
        router.push("/continue");
      } else if (
        signIn?.status === "needs_second_factor" ||
        signIn?.status === "needs_client_trust"
      ) {
        Alert.alert(
          "Verifikasi tambahan diperlukan",
          "Akun ini membutuhkan verifikasi tambahan yang belum didukung untuk masuk dengan Google. Coba masuk dengan email dan kata sandi.",
        );
      }
      // Selain itu: pengguna menutup jendela Google, tidak perlu tindakan.
    } catch (err) {
      console.error("Google OAuth error:", JSON.stringify(err, null, 2));
      Alert.alert("Gagal masuk dengan Google", "Coba lagi beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OutlineButton
      title={label}
      onPress={onPress}
      loading={loading}
      leading={
        <View style={styles.badge}>
          <Text style={styles.g}>G</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ECECF0",
    alignItems: "center",
    justifyContent: "center",
  },
  g: { fontSize: 12, fontWeight: "800", color: colors.ink },
});
