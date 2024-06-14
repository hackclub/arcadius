import Airtable from "airtable";
import { FlowSignals } from "../lib/enums";
import metrics from "../metrics";

const signalBase = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base("app4kCWulfB02bV8Q")("Users");

async function updateSignal(
  signalName: FlowSignals,
  signalValue: boolean,
  slackId: string
) {
  metrics.increment("airtable.update_signal")
  const startTs = performance.now();

  const record = await signalBase
    .select({
      filterByFormula: `{Slack ID} = "${slackId}"`,
    })
    .firstPage();

  if (record.length > 0 && record.length < 2) {
    await signalBase.update(record[0].id, {
      [signalName]: signalValue,
    });
  } else if (record.length > 1) {
    console.error("Multiple records found for user");
  } else {
    console.error("No records found for user");
  }

  metrics.timing("airtable.update_signal", performance.now() - startTs);
}

export { signalBase, updateSignal };
