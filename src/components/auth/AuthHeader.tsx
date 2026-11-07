import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  /** hero = Masuk (logo besar + tagline), compact = Daftar / Lupa sandi / OTP */
  variant?: "hero" | "compact";
  subtitle?: string;
  onBack?: () => void;
};

export function AuthHeader({ variant = "compact", subtitle, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const hero = variant === "hero";
  const logo = hero ? 64 : 48;

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + (hero ? 40 : 24),
          paddingBottom: hero ? 36 : 26,
        },
      ]}
    >
      <Text
        style={styles.kanji}
        accessible={false}
        importantForAccessibility="no"
      >
        歌
      </Text>

      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={[styles.back, { top: insets.top + 12 }]}
        >
          <Ionicons name="chevron-back" size={26} color={colors.white} />
        </Pressable>
      ) : null}
      {/* Logo */}
      <View
        style={[
          styles.logo,
          { width: logo, height: logo, borderRadius: hero ? 14 : 14 },
        ]}
      >
        {/* <Ionicons
          name="copy-outline"
          size={hero ? 30 : 24}
          color={colors.primary}
        /> */}
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text style={[styles.brand, hero && styles.brandHero]}>FlashKu</Text>
      {hero && subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    alignItems: "center",
  },
  kanji: {
    position: "absolute",
    right: -28,
    top: -34,
    fontSize: 200,
    lineHeight: 230,
    fontWeight: "700",
    color: "rgba(255,255,255,0.13)",
  },
  back: { position: "absolute", left: 16, zIndex: 2 },
  logo: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "800",
    color: colors.white,
  },
  brandHero: { marginTop: 14, fontSize: 30 },
  subtitle: {
    marginTop: 8,
    paddingHorizontal: 24,
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
  },
});
