export enum flowTriggeredByEnum {
  hedi= "Hedi",
  arcadius= "Arcadius",
  jasper= "Jasper (Manual)",
}

export type flowTriggeredByType = keyof typeof flowTriggeredByEnum;