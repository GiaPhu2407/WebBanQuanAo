import { useState, useCallback } from "react";

interface UseProductBehaviorProps {
  userId: number;
}

export const useProductBehavior = ({ userId }: UseProductBehaviorProps) => {
  const [loading, setLoading] = useState(false);

  const trackBehavior = useCallback(
    async (productId: number, action: "view" | "add_to_cart" | "purchase") => {
      if (!userId || !productId) {
        console.error("Missing required parameters:", { userId, productId });
        return;
      }

      try {
        setLoading(true);
        console.log("Sending behavior tracking request:", {
          userId,
          productId,
          action,
        });

        const response = await fetch("/api/product-behavior", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
            action,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to track behavior: ${errorData.error}`);
        }

        const data = await response.json();
        console.log("Behavior tracked successfully:", data);
        return data;
      } catch (error) {
        console.error("Error tracking behavior:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { trackBehavior, loading };
};
