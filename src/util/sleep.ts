import { blog } from "../util/Logger";

export function sleep(ms) {
  try {
    blog(`Sleeping for ${ms}ms`, "info");
    return new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    blog(`Error in sleep: ${error}`, "error");
  }
}
