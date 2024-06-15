import { slog } from "../util/Logger";

export function sleep(ms) {
  slog(`Sleeping for ${ms}ms`, "info");
  return new Promise((resolve) => setTimeout(resolve, ms));
}
