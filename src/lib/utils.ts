import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

export function calculateImpact(kg: number) {
  return {
    meals: Math.floor(kg * 2.5), // 1kg approx 2.5 meals
    co2: Math.floor(kg * 2.5), // 1kg approx 2.5kg CO2 avoided
  };
}
