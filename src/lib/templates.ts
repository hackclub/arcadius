import fs from "fs";
import { parse } from "yaml";

type template =
  | "app.startup"
  | "onboarding.welcome_hacker"
  | "onboarding.hedi_intro"
  | "onboarding.shop_prompt"
  | "onboarding.step_three"
  | "onboarding.accept_coc"
  | "onboarding.paridise";

interface data {
  slackId?: string;
  environment?: string;
}

const file = fs.readFileSync("./src/lib/templates.yaml", "utf8");
const templatesRaw = parse(file);

function flatten(obj: any, prefix: string = "") {
  let result: any = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && Array.isArray(obj[key]) === false) {
      result = { ...result, ...flatten(obj[key], `${prefix}${key}.`) };
    } else {
      result[`${prefix}${key}`] = obj[key];
    }
  }

  return result;
}

const templates = flatten(templatesRaw);

const pfpFile = fs.readFileSync("./src/lib/arcadius.yaml", "utf8");
export const pfps = parse(pfpFile);

export function t(template: template, data: data) {
  //    return (randomChoice(templates[template]) as string).replace(/\${(.*?)}/g, (_, key) => (data as any)[key])
  return t_format(t_fetch(template), data);
}

export function t_fetch(template: template) {
  return Array.isArray(templates[template])
    ? (randomChoice(templates[template]) as string)
    : (templates[template] as string);
}

export function t_format(template: string, data: data) {
  return template.replace(/\${(.*?)}/g, (_, key) => (data as any)[key]);
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
