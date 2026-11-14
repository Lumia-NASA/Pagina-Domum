// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useTelemetry } from "./hooks/useTelemetry";

vi.mock("./components/MarsGlobe", () => ({
  default: ({
    zoom = 1,
    grid,
    region,
  }: {
    zoom?: number;
    grid?: boolean;
    region?: { name: string };
  }) => (
    <div data-testid="globe" data-zoom={zoom} data-grid={grid}>
      {region?.name}
    </div>
  ),
}));

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  window.history.replaceState(null, "", "/");
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

async function click(selector: string) {
  const element = container.querySelector<HTMLElement>(selector);
  expect(element, selector).not.toBeNull();
  await act(async () => element!.click());
}

describe("landing and explorer interactions", () => {
  it("opens and closes mobile navigation with accessible state", async () => {
    await act(async () => root.render(<App />));
    await click('[aria-label="Open navigation"]');
    expect(
      container
        .querySelector('[aria-controls="mobile-navigation"]')
        ?.getAttribute("aria-expanded"),
    ).toBe("true");
    await act(async () =>
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })),
    );
    expect(container.querySelector("#mobile-navigation")).toBeNull();
  });
  it("switches the surface preview and pauses the ticker", async () => {
    await act(async () => root.render(<App />));
    const inspect = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Inspect the surface"),
    )!;
    await act(async () => inspect.click());
    expect(inspect.textContent).toContain("Return to panorama");
    await click('[aria-label="Pause mission ticker"]');
    expect(
      container
        .querySelector('[aria-label="Resume mission ticker"]')
        ?.getAttribute("aria-pressed"),
    ).toBe("true");
  });
  it("loads explorer, selects a region, zooms, resets, and preserves skip-link navigation", async () => {
    await act(async () => root.render(<App />));
    await act(async () => {
      window.history.pushState(null, "", "#explorer/olympus");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await import("./components/Explorer");
    });
    await vi.waitFor(() =>
      expect(container.querySelector('[data-testid="globe"]')).not.toBeNull(),
    );
    expect(container.querySelector('[data-testid="globe"]')?.textContent).toBe(
      "Olympus Mons",
    );
    await click('input[value="olympus"]');
    expect(container.querySelector('[data-testid="globe"]')?.textContent).toBe(
      "Olympus Mons",
    );
    await click('[aria-label="Zoom in"]');
    expect(
      container
        .querySelector('[data-testid="globe"]')
        ?.getAttribute("data-zoom"),
    ).toBe("1.15");
    await click('[aria-label="Toggle coordinate mesh"]');
    expect(
      container
        .querySelector('[data-testid="globe"]')
        ?.getAttribute("data-grid"),
    ).toBe("false");
    await click('[aria-label="Reset globe view"]');
    expect(
      container
        .querySelector('[data-testid="globe"]')
        ?.getAttribute("data-zoom"),
    ).toBe("1");
    await click('a[href="#main"]');
    expect(window.location.hash).toBe("#explorer/olympus");
    expect(document.activeElement?.id).toBe("main");
    await act(async () => {
      window.history.pushState(null, "", "#home");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(container.querySelector("#hero-title")?.textContent).toBe(
      "MARSVIEW",
    );
  });
});

function TelemetryProbe() {
  const state = useTelemetry();
  return (
    <div>
      <output>
        {JSON.stringify({
          reading: state.reading,
          error: state.error,
          loading: state.loading,
          isDemo: state.isDemo,
          stale: state.stale,
        })}
      </output>
      <button onClick={state.refresh}>Refresh</button>
    </div>
  );
}
const readState = () =>
  JSON.parse(container.querySelector("output")!.textContent!);

describe("telemetry lifecycle", () => {
  it("does not make a network request in demo mode", async () => {
    vi.stubEnv("VITE_TELEMETRY_URL", "");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await act(async () => root.render(<TelemetryProbe />));
    expect(fetcher).not.toHaveBeenCalled();
    expect(readState().isDemo).toBe(true);
  });
  it("retains the last sourced reading after a failed refresh", async () => {
    vi.stubEnv("VITE_TELEMETRY_URL", "/api/telemetry");
    const reading = {
      temperatureC: -60,
      pressurePa: 620,
      latitude: 18,
      longitude: 77,
      sol: 1000,
      source: "Verified source",
      sourceUrl: "https://science.nasa.gov/mars/",
      observedAt: "2020-01-01T00:00:00Z",
    };
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => reading })
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetcher);
    await act(async () => root.render(<TelemetryProbe />));
    expect(readState().reading.temperatureC).toBe(-60);
    expect(readState().stale).toBe(true);
    await click("button");
    expect(readState().error).toContain("could not be refreshed");
    expect(readState().reading.source).toBe("Verified source");
    expect(readState().isDemo).toBe(false);
    expect(readState().loading).toBe(false);
  });
});
