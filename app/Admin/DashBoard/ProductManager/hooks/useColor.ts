import { useState, useEffect } from "react";
import { Color } from "@/app/Admin/type/product";

export function useColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch("/api/color");
        const data = await response.json();
        if (data.data) {
          setColors(data.data);
        }
      } catch (err) {
        setError("Failed to fetch colors");
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  return { colors, loading, error };
}
