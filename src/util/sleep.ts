import { slog } from "./Logger";

export function sleep(ms) {
  slog(`Sleeping for ${ms}ms`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
