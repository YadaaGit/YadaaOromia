import { useMemo } from 'react';
import {
  initDataRaw as _initDataRaw,
  initDataState as _initDataState,
  useSignal,
  retrieveLaunchParams,
} from '@telegram-apps/sdk-react';

/**
 * Hook to get reactive init data: user, chat, receiver, raw init data
 * Includes optional fallback for local dev
 */
export function useTelegramInitData({ enableLocalFallback = true } = {}) {
  let initDataRaw = useSignal(_initDataRaw);
  let initDataState = useSignal(_initDataState);

  // Fallback if not running inside Telegram (e.g., during local dev)
  if ((!initDataRaw || !initDataState || !initDataState.user) && enableLocalFallback) {
    console.warn("⚠️ Using fallback init data (not running inside Telegram)");
    initDataRaw = "mock_init_data_raw_string";
    initDataState = {
      user: {
        id: 123456,
        first_name: "LocalDev",
        username: "local_dev",
        language_code: "en",
      },
      chat: {
        id: 654321,
        type: "private",
        title: "Local Chat"
      }
    };
  }

  return { initDataRaw, initDataState };
}

/**
 * Hook to get static launch params once
 */
export function useTelegramLaunchParams() {
  const launchParams = useMemo(() => retrieveLaunchParams(), []);
  return launchParams;
}
