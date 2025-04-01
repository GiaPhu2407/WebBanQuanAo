"use client";

import { useEffect } from "react";

interface ZaloChatProps {
  oaId: string;
  welcomeMessage?: string;
  size?: number;
  position?: "left" | "right";
  color?: string;
}

export function ZaloChat({
  oaId,
  welcomeMessage = "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
  size = 60,
  position = "right",
  color = "#008fe5",
}: ZaloChatProps) {
  useEffect(() => {
    // Ensure the Zalo SDK is loaded
    if (typeof window !== "undefined" && (window as any).ZaloSocialSDK) {
      (window as any).ZaloSocialSDK.reload();
    }
  }, []);

  return (
    <div
      className="zalo-chat-widget"
      data-oaid={oaId}
      data-welcome-message={welcomeMessage}
      data-size={size}
      data-position={position}
      data-color={color}
    />
  );
}
