import { Cron } from "@/lib/cron";

const cron = new Cron();

// Run every minute to check for products that need to be released
cron.schedule("* * * * *", async () => {
  try {
    const response = await fetch("/api/cron/releaseproducts", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to release products");
    }

    const result = await response.json();
    console.log(`Released ${result.releasedProducts} products`);
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

export default cron;
