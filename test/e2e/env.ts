// Fail closed: a missing value fails the test that reads it.
export function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}
