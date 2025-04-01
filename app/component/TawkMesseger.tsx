"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function TawkMessenger() {
  useEffect(() => {
    // Thay thế YOUR_PROPERTY_ID và YOUR_WIDGET_ID bằng ID từ tài khoản Tawk của bạn
    var s1 = document.createElement("script");
    var s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/67ebc56fada1c61917d77a48/1inofmeuk";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode?.insertBefore(s1, s0);

    return () => {
      // Cleanup khi component unmount
      if (window.Tawk_API?.onLoaded) {
        window.Tawk_API.onLoaded = null;
      }
    };
  }, []);

  return null;
}
