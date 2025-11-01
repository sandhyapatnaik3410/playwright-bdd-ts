import * as fs from "fs";
import * as path from "path";

/**
 * Reads a named payload (like "login" or "register") from apiPayloads.json.
 */
export function getPayload<T>(key: string): T {
  const filePath = path.resolve("Data/apiPayloads.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(rawData);

  if (!jsonData[key]) {
    throw new Error(`Payload '${key}' not found in apiPayloads.json`);
  }

  return jsonData[key] as T;
}
