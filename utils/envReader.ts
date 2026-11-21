/** Returns a required environment variable, or fails with a clear error if it is missing. */
export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Did you create .env from .env.example?`);
  }
  return value;
}