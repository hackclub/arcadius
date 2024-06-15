export type Identifier =
  | { slackId: string; email?: undefined; internalId?: undefined }
  | { email: string; slackId?: undefined; internalId?: undefined }
  | { internalId: string; slackId?: undefined; email?: undefined };