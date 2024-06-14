import * as dotenv from "dotenv";
import { client } from "../index";
dotenv.config();

import colors from "colors";

async function slog(logMessage) {
  if (process.env.NODE_ENV === "production") {
    await client.chat.postMessage({
      channel: "C077F5AVB38",
      text: logMessage,
    });
  } else {
    await client.chat.postMessage({
      channel: "C069N64PW4A",
      text: `:warning: *TESTING* :warning: ${logMessage}`,
    });
  }
}

type LogType = "info" | "start" | "cron" | "error";

export const clog = async (logMessage, type: LogType) => {
  switch (type) {
    case "info":
      console.log(colors.blue(logMessage));
      break;
    case "start":
      console.log(colors.bgBlue(logMessage));
      break;
    case "cron":
      console.log(colors.magenta(`[CRON]: ${logMessage}`));
      break;
    case "error":
      console.error(colors.red.bold(`[ERROR]: ${logMessage}`));
      break;
    default:
      console.log(logMessage);
  }
};

export { clog as default, slog };

// # LOG_CHANNEL= "C077F5AVB38", # Prod Logging
// LOG_CHANNEL= "C069N64PW4A", # secret testing of secret things
