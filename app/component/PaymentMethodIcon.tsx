import React from "react";

interface PaymentMethodIconProps {
  type: "cash" | "bank" | "stripe";
  className?: string;
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({
  type,
  className = "w-5 h-5",
}) => {
  switch (type) {
    case "cash":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      );
    case "bank":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="9" width="18" height="12" rx="2" />
          <path d="M3 5h18M7 15h.01M11 15h.01M15 15h.01" />
        </svg>
      );
    case "stripe":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.48 5.62c-.42-.16-1.12-.33-2.05-.33-2.25 0-3.84 1.14-3.84 3.01 0 1.47 1.14 2.24 2.01 2.73.9.5 1.19.84 1.19 1.29 0 .62-.5.97-1.42.97-.84 0-1.64-.22-2.12-.45l-.33 1.45c.45.22 1.34.42 2.25.42 2.38 0 3.94-1.16 3.94-3.08 0-1.03-.62-1.94-1.99-2.59-.83-.42-1.33-.7-1.33-1.29 0-.42.36-.85 1.23-.85.73 0 1.29.17 1.72.36l.32-1.41.42-.25z"
            fill="#635bff"
          />
          <path
            d="M16.3 5.45L14.94 12c-.05.3-.17.4-.38.4h-1.6l-.28 1.66h2.24c.74 0 1.25-.59 1.38-1.52l1.33-7.09H16.3zM8.94 5.45L7.27 13.4h1.72l1.67-7.95H8.94z"
            fill="#635bff"
          />
        </svg>
      );
    default:
      return null;
  }
};
