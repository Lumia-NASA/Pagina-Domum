import { describe, expect, it } from "vitest";
import { coordinate, demoReading, isStale, parseTelemetry } from "./telemetry";

const valid = {
  ...demoReading,
  observedAt: new Date().toISOString(),
  source: "Mission proxy",
  sourceUrl: "https://science.nasa.gov/mars/",
};

describe("external telemetry boundary", () => {
  it("accepts a complete, finite reading with HTTPS provenance", () => {
    expect(parseTelemetry(valid)).toEqual(valid);
  });
  it.each([
    null,
    {},
    { ...valid, temperatureC: NaN },
    { ...valid, pressurePa: -1 },
    { ...valid, latitude: 91 },
    { ...valid, longitude: "77" },
    { ...valid, sol: 1.5 },
    { ...valid, source: "" },
    { ...valid, sourceUrl: "javascript:alert(1)" },
    { ...valid, observedAt: "unknown" },
    { ...valid, observedAt: new Date(Date.now() + 3600000).toISOString() },
  ])("rejects malformed or untrustworthy readings: %j", (value) => {
    expect(() => parseTelemetry(value)).toThrow();
  });
  it("marks measurements older than fifteen minutes as stale", () => {
    const timestamp = Date.parse(valid.observedAt);
    expect(isStale(valid, timestamp + 14 * 60000)).toBe(false);
    expect(isStale(valid, timestamp + 16 * 60000)).toBe(true);
  });
  it("formats both hemispheres without negative coordinate labels", () => {
    expect(coordinate(-14, "latitude")).toBe("14.0000° S");
    expect(coordinate(-133.8, "longitude")).toBe("133.8000° W");
    expect(coordinate(18.4446, "latitude")).toBe("18.4446° N");
  });
});
