import { StatusBar } from 'expo-status-bar'
import { Link, type Href } from 'expo-router'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'
import { AuthHeader } from './AuthHeader'

type Props = {
  variant?: 'hero' | 'compact'
  subtitle?: string
  onBack?: () => void
  footer?: ReactNode
  children: ReactNode
}

export function AuthScreen({ variant, subtitle, onBack, footer, children }: Props) {
  const insets = useSafeAreaInsets()
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <AuthHeader variant={variant} subtitle={subtitle} onBack={onBack} />
        <View style={styles.body}>{children}</View>
        {footer ? (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>{footer}</View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export function FooterLink({ text, linkText, href }: { text: string; linkText: string; href: Href }) {
  return (
    <Text style={styles.footerText}>
      {text}{' '}
      <Link href={href} replace style={styles.footerLink}>
        {linkText}
      </Link>
    </Text>
  )
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <View style={styles.titleWrap}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  body: { paddingHorizontal: 28, paddingTop: 28 },
  footer: { marginTop: 'auto', paddingTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14, color: colors.muted },
  footerLink: { fontWeight: '700', color: colors.primaryDark },
  titleWrap: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: colors.ink },
  subtitle: { marginTop: 4, fontSize: 14, lineHeight: 20, color: colors.muted },
})
