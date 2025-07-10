import { useEffect, useState } from "react";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

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
