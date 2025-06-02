export const tokenNames = {
  userToken: 'userToken',
  anonymous: 'anonymous',
  anonymousRefresh: 'anonymousRefresh',
} as const;

export type TokenName = (typeof tokenNames)[keyof typeof tokenNames];
