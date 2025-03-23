import { parse, differenceInHours } from "date-fns";

export function calculateShifts(startTime: string, endTime: string): number {
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  const hours = differenceInHours(end, start);
  // Assuming 1 shift = 8 hours
  return Math.ceil(hours / 8);
}

export function calculateTotalSalary(
  basicSalary: number,
  bonus: number,
  numberOfShifts: number
): number {
  const salaryPerShift = basicSalary / 30; // Assuming 30 days per month
  return salaryPerShift * numberOfShifts + bonus;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN").format(date);
}
