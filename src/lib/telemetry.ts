export interface TelemetryReading {
  temperatureC: number;
  pressurePa: number;
  latitude: number;
  longitude: number;
  sol: number;
  observedAt: string;
  source: string;
  sourceUrl: string;
}

export const demoReading: TelemetryReading = {
  temperatureC: -63.4,
  pressurePa: 610,
  latitude: 18.4446,
  longitude: 77.4509,
  sol: 428,
  observedAt: "2026-01-01T12:00:00Z",
  source: "MarsView demonstration",
  sourceUrl: "",
};

export function parseTelemetry(input: unknown): TelemetryReading {
  if (!input || typeof input !== "object")
    throw new Error("The telemetry response is not an object.");
  const data = input as Record<string, unknown>;
  const ranges: Record<string, [number, number]> = {
    temperatureC: [-160, 50],
    pressurePa: [0, 2000],
    latitude: [-90, 90],
    longitude: [-180, 180],
    sol: [0, 100000],
  };
  for (const [field, [min, max]] of Object.entries(ranges)) {
    const value = data[field];
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    )
      throw new Error(`Invalid telemetry field: ${field}.`);
  }
  if (!Number.isInteger(data.sol))
    throw new Error("The mission sol must be an integer.");
  if (
    typeof data.observedAt !== "string" ||
    !Number.isFinite(Date.parse(data.observedAt)) ||
    Date.parse(data.observedAt) > Date.now() + 300000
  )
    throw new Error("Invalid observation timestamp.");
  if (
    typeof data.source !== "string" ||
    !data.source.trim() ||
    data.source.length > 120
  )
    throw new Error("Missing observation source.");
  if (typeof data.sourceUrl !== "string")
    throw new Error("Missing source URL.");
  const sourceUrl = new URL(data.sourceUrl);
  if (sourceUrl.protocol !== "https:")
    throw new Error("The source URL must use HTTPS.");
  return {
    temperatureC: data.temperatureC as number,
    pressurePa: data.pressurePa as number,
    latitude: data.latitude as number,
    longitude: data.longitude as number,
    sol: data.sol as number,
    observedAt: data.observedAt,
    source: data.source,
    sourceUrl: sourceUrl.href,
  };
}

export function isStale(reading: TelemetryReading, now = Date.now()) {
  return now - Date.parse(reading.observedAt) > 15 * 60 * 1000;
}

export function coordinate(value: number, axis: "latitude" | "longitude") {
  return `${Math.abs(value).toFixed(4)}° ${axis === "latitude" ? (value < 0 ? "S" : "N") : value < 0 ? "W" : "E"}`;
}
