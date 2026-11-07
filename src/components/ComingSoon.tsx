import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { PageHeader } from "./PageHeader";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

/** Layar sementara untuk tab yang isinya belum dibuat. Ganti dengan layar aslimu. */
export function ComingSoon({ title, subtitle, icon }: Props) {
  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <PageHeader title={title} subtitle={subtitle} />
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={32} color={colors.primary} />
        </View>
        <Text style={styles.text}>Segera hadir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 15, fontWeight: "600", color: colors.muted },
});
