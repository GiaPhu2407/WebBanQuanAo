export class Cron {
  private timers: NodeJS.Timeout[] = [];

  schedule(cronExpression: string, callback: () => void | Promise<void>) {
    // Parse cron expression
    const [minute, hour, dayOfMonth, month, dayOfWeek] =
      cronExpression.split(" ");

    // For simplicity, we'll implement a basic interval-based scheduler
    // This example handles "* * * * *" (every minute) pattern
    if (
      minute === "*" &&
      hour === "*" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek === "*"
    ) {
      const timer = setInterval(async () => {
        try {
          await callback();
        } catch (error) {
          console.error("Error in cron job:", error);
        }
      }, 60000); // Run every minute

      this.timers.push(timer);
      return timer;
    }

    throw new Error('Only "* * * * *" cron expression is supported');
  }

  // Clean up method to clear all scheduled jobs
  cleanup() {
    this.timers.forEach((timer) => clearInterval(timer));
    this.timers = [];
  }
}
