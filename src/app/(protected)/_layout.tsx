import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: "index", title: "Beranda", icon: "home-outline" },
  { name: "lagu", title: "Lagu", icon: "musical-notes-outline" },
  { name: "peringkat", title: "Peringkat", icon: "trophy-outline" },
  { name: "riwayat", title: "Riwayat", icon: "time-outline" },
  { name: "pengaturan", title: "Pengaturan", icon: "options-outline" },
];

export default function ProtectedLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          height: 72 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
          backgroundColor: colors.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#E3E3EA",
          elevation: 0,
        },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.pill, focused && styles.pillActive]}>
                <Ionicons name={t.icon} size={24} colors={color} />
              </View>
            ),
          }}
        />
      ))}

      {/* Rute di dalam (protected) yang bukan tab: disembunyikan dari tab bar. */}
      <Tabs.Screen name="log-out" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 64,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: { backgroundColor: colors.tint },
  label: { fontSize: 12, fontWeight: "600" },
});
