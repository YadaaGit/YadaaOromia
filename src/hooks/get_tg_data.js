// src/hooks/get_tg_data.js
import { useState, useEffect } from "react";

export default function useTelegramUser() {
  const [tgUser, setTgUser] = useState({
    name: "",
    username: "",
    userId: "",
  });

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initDataUnsafe || {};
    const firstName = initData?.user?.first_name || "";
    const lastName = initData?.user?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    setTgUser({
      name: fullName,
      username: initData?.user?.username || "",
      userId: initData?.user?.id || "",
    });
  }, []);

  return tgUser;
}
