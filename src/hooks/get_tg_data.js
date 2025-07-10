import { useEffect, useState } from "react";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

// Default export hook
export default function useTelegramSdk({ enableLocalFallback = true } = {}) {
  const [tgUser, setTgUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [initDataRaw, setInitDataRaw] = useState(null);

  useEffect(() => {
    try {
      const { initData, initDataRaw } = retrieveLaunchParams();

      if (initData && initData.user) {
        setTgUser(initData.user);
        setInitDataRaw(initDataRaw);
        if (initData.chat) setChatId(initData.chat.id);
        setIsTelegram(true);
      } else {
        console.warn("No Telegram user found");
        if (enableLocalFallback) {
          setTgUser({ id: 123, firstName: "Dev", username: "dev_user" });
          setChatId(456);
        }
      }
    } catch (err) {
      console.error("Failed to retrieve launch params:", err);
      if (enableLocalFallback) {
        console.log("Using fallback data");
        setTgUser({ id: 123, firstName: "Dev", username: "dev_user" });
        setChatId(456);
      }
    }
  }, [enableLocalFallback]);

  return { tgUser, chatId, isTelegram, initDataRaw };
}

// Named export hook
export function useTelegramSdk2({ enableLocalFallback = true } = {}) {
  const [chatId2, setChatId2] = useState(null);
  const [isTelegram2, setIsTelegram2] = useState(false);

  useEffect(() => {
    try {
      const launchParams = retrieveLaunchParams();

      if (launchParams && launchParams.initData && launchParams.initData.chat) {
        setChatId2(launchParams.initData.chat.id);
        setIsTelegram2(true);
      } else {
        console.warn("No Telegram chat found");
        if (enableLocalFallback) {
          setChatId2(456);
        }
      }
    } catch (err) {
      console.error("Failed to retrieve launch params:", err);
      if (enableLocalFallback) {
        console.log("Using fallback data");
        setChatId2(456);
      }
    }
  }, [enableLocalFallback]);

  return { chatId2, isTelegram2 };
}
