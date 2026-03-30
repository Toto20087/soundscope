import "server-only";

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Add it to .env.local or your deployment environment.`
    );
  }
  return value;
}

export const env = {
  LASTFM_API_KEY: getRequiredEnv("LASTFM_API_KEY"),
};
