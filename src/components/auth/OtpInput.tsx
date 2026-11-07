import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/theme/colors";

type Props = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  hasError?: boolean;
  autoFocus?: boolean;
};

/** 6 kotak digit; satu TextInput transparan di atasnya menangani ketikan & paste. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  hasError,
  autoFocus = true,
}: Props) {
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.box,
              focused && i === activeIndex && styles.boxActive,
              hasError && styles.boxError,
            ]}
          >
            <Text style={styles.char}>{value[i] ?? ""}</Text>
          </View>
        ))}
      </View>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hiddenInput}
        accessibilityLabel={`Kode verifikasi ${length} digit`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 60 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  box: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  boxActive: { borderColor: colors.primary, backgroundColor: "#F3F2FE" },
  boxError: { borderColor: colors.danger },
  char: { fontSize: 24, fontWeight: "700", color: colors.ink },
  hiddenInput: { ...StyleSheet.absoluteFill, opacity: 0, color: "transparent" },
});
