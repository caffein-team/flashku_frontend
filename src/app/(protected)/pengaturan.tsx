import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OutlineButton } from "@/components/auth/Buttons";
import { colors } from "@/theme/colors";

type ThemeMode = "light" | "dark" | "system";
const THEMES: { key: ThemeMode; label: string }[] = [
  { key: "light", label: "Terang" },
  { key: "dark", label: "Gelap" },
  { key: "system", label: "Sistem" },
];

export default function PengaturanScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { user } = useUser();

  // TODO: sambungkan ke theme provider / penyimpanan preferensi milikmu.
  const [theme, setTheme] = useState<ThemeMode>("light");

  const name = user?.fullName || user?.firstName || "Pengguna";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initial = name.trim().charAt(0).toUpperCase();

  const confirmSignOut = () =>
    Alert.alert(
      "Keluar dari FlashKu?",
      "Kamu perlu masuk lagi untuk melanjutkan belajar.",
      [
        { text: "Batal", style: "cancel" },
        // Setelah sesi berakhir, guard di app/_layout.tsx otomatis membuka layar Masuk.
        { text: "Keluar", style: "destructive", onPress: () => signOut() },
      ],
    );

  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <Text style={styles.headerTitle}>Pengaturan</Text>
          <Text style={styles.headerSub}>Atur akun dan tampilan aplikasi</Text>
        </View>

        <View style={styles.content}>
          {/* Profil */}
          <View style={[styles.card, styles.profile]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName} numberOfLines={1}>
                {name}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {email}
              </Text>
            </View>
            {/* TODO: arahkan ke layar edit profil */}
            <Pressable hitSlop={10} accessibilityRole="button">
              <Text style={styles.edit}>Edit</Text>
            </Pressable>
          </View>

          {/* Tema */}
          <Text style={styles.sectionTitle}>Tema</Text>
          <View style={[styles.card, styles.segment]}>
            {THEMES.map((t) => {
              const active = theme === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTheme(t.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.segmentItem, active && styles.segmentActive]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Umum */}
          <View style={[styles.card, styles.list]}>
            <Text style={styles.listHeader}>Umum</Text>
            <Row label="Bahasa" value="Indonesia" />
            <Row label="Profil" />
            <Row label="Notifikasi" last />
          </View>

          {/* Donasi */}
          <View style={styles.donate}>
            <View style={styles.donateText}>
              <Text style={styles.donateTitle}>Dukung FlashKu</Text>
              <Text style={styles.donateBody}>
                Bantu kami terus mengembangkan aplikasi ini.
              </Text>
            </View>
            <Pressable style={styles.donateBtn} accessibilityRole="button">
              <Text style={styles.donateBtnText}>Donasi</Text>
            </Pressable>
          </View>

          <OutlineButton title="Keluar" onPress={confirmSignOut} />
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <Pressable
      style={[styles.row, !last && styles.rowDivider]}
      accessibilityRole="button"
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingBottom: 32 },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: colors.white },
  headerSub: { marginTop: 4, fontSize: 13, color: "rgba(255,255,255,0.8)" },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  card: { backgroundColor: colors.white, borderRadius: 18 },
  profile: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 17, fontWeight: "800", color: colors.white },
  profileText: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: "800", color: colors.ink },
  profileEmail: { marginTop: 2, fontSize: 13, color: colors.muted },
  edit: { fontSize: 14, fontWeight: "700", color: colors.primaryDark },
  sectionTitle: {
    marginTop: 2,
    marginBottom: -4,
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  segment: { flexDirection: "row", padding: 4 },
  segmentItem: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontSize: 14, fontWeight: "700", color: colors.ink },
  segmentTextActive: { color: colors.white },
  list: { overflow: "hidden" },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 52,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E3E3EA",
  },
  rowLabel: { fontSize: 16, fontWeight: "600", color: colors.ink },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowValue: { fontSize: 14, color: colors.muted },
  donate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.tint,
  },
  donateText: { flex: 1 },
  donateTitle: { fontSize: 15, fontWeight: "800", color: "#1E1B5E" },
  donateBody: { marginTop: 2, fontSize: 13, lineHeight: 18, color: "#2C2985" },
  donateBtn: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  donateBtnText: { fontSize: 14, fontWeight: "700", color: colors.white },
});
