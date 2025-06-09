import React, { useState, useEffect } from 'react';

export default function useTelegramData() {
  const [tgData, setTgData] = useState({});

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initDataUnsafe || {};
    setTgData({
      name: initData?.user?.first_name || '',
      username: initData?.user?.username || '',
      userId: initData?.user?.id || '',
    });
  }, []);

  return tgData;
}
