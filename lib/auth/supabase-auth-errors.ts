const recoverableAuthErrorPatterns = [
  /jwt issued at future/i,
  /invalid jwt/i,
  /jwt expired/i,
  /token has expired/i,
  /refresh token/i,
  /auth session missing/i,
  /invalid claim: iat/i,
];

export function isRecoverableSupabaseAuthErrorMessage(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  return recoverableAuthErrorPatterns.some((pattern) => pattern.test(message));
}