import type { Router } from "expo-router";

/**
 * Dipakai di signIn.finalize / signUp.finalize.
 * Setelah sesi aktif, guard di _layout.tsx otomatis memindahkan user ke (tabs).
 */
export function createNavigate(router: Router) {
  return async ({
    session,
  }: {
    session?: { currentTask?: unknown } | null;
  }) => {
    if (session?.currentTask) {
      // Session task (mis. wajib pilih organisasi) belum ditangani di UI ini.
      // Lihat: https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
      console.warn("Session task belum ditangani:", session.currentTask);
      return;
    }
    router.replace("/");
  };
}
