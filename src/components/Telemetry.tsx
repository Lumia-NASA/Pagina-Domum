import {
  ArrowUpRight,
  Gauge,
  LocateFixed,
  RefreshCw,
  Thermometer,
  Radio,
} from "lucide-react";
import { useTelemetry } from "../hooks/useTelemetry";
import { coordinate } from "../lib/telemetry";
import { links } from "../lib/config";

export function Telemetry() {
  const { reading, loading, error, refresh, isDemo, stale } = useTelemetry();
  const status = isDemo
    ? "DEMO FEED"
    : error
      ? "CONNECTION INTERRUPTED"
      : loading && !reading
        ? "CONNECTING"
        : stale
          ? "ARCHIVED READING"
          : "SOURCE CONNECTED";
  return (
    <section
      id="telemetry"
      aria-labelledby="telemetry-title"
      className="relative overflow-hidden border-y border-white/[.07] bg-[#090807] py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-950/15 blur-3xl"
      />
      <div className="page-width relative">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2
              id="telemetry-title"
              className="text-[32px] leading-[1.2] font-light tracking-[-.035em] sm:text-5xl"
            >
              A pulse from
              <br />
              <span className="text-muted">another world.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
              The environment. The position. The details that bring a distant
              planet into focus.
            </p>
          </div>
          <div className="technical inline-flex w-fit items-center gap-2.5 rounded-full border border-copper/20 bg-copper/[.04] px-4 py-2.5 text-copper">
            <span className="size-1.5 rounded-full bg-copper" />
            {status}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="glass-panel p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-xs text-muted">Surface temperature</h3>
              <Thermometer
                size={19}
                strokeWidth={1.3}
                className="text-copper"
              />
            </div>
            <p className="mt-10 flex items-baseline gap-2">
              <span className="font-mono text-[44px] leading-none tracking-[-.06em] tabular-nums">
                {reading
                  ? reading.temperatureC.toFixed(1).replace("-", "−")
                  : "—"}
              </span>
              <span className="text-xl text-muted">°C</span>
            </p>
            <div className="mt-9 flex justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-muted">
              <span>
                {isDemo ? "ILLUSTRATIVE READING" : "REPORTED TEMPERATURE"}
              </span>
              <span className="text-copper">MARS</span>
            </div>
          </article>
          <article className="glass-panel p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-xs text-muted">Atmospheric pressure</h3>
              <Gauge size={19} strokeWidth={1.3} className="text-copper" />
            </div>
            <p className="mt-10 flex items-baseline gap-2">
              <span className="font-mono text-[44px] leading-none tracking-[-.06em] tabular-nums">
                {reading ? reading.pressurePa.toFixed(0) : "—"}
              </span>
              <span className="text-xl text-muted">Pa</span>
            </p>
            <div className="mt-9 flex justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-muted">
              <span>
                {isDemo ? "ILLUSTRATIVE READING" : "REPORTED PRESSURE"}
              </span>
              <span className="text-copper">SURFACE</span>
            </div>
          </article>
          <article className="glass-panel p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-xs text-muted">
                {isDemo ? "Observation coordinates" : "Orbital coordinates"}
              </h3>
              <LocateFixed
                size={19}
                strokeWidth={1.3}
                className="text-copper"
              />
            </div>
            <div className="mt-8 space-y-1 font-mono text-[24px] leading-[1.25] tracking-[-.035em] tabular-nums">
              <p>{reading ? coordinate(reading.latitude, "latitude") : "—"}</p>
              <p className="text-muted">
                {reading ? coordinate(reading.longitude, "longitude") : "—"}
              </p>
            </div>
            <div className="mt-6 flex justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-muted">
              <span>
                {isDemo ? "JEZERO REFERENCE POINT" : "SOURCE POSITION"}
              </span>
              <span className="text-copper">
                {reading ? `SOL ${reading.sol}` : "PENDING"}
              </span>
            </div>
          </article>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-4 text-[11px] leading-6 text-muted sm:flex-row sm:items-center">
          <p className="max-w-[650px]">
            {isDemo ? (
              "Demonstration dataset · Values are illustrative, not current measurements. Coordinates mark the Jezero landing site."
            ) : reading ? (
              <>
                Observed{" "}
                <time dateTime={reading.observedAt}>
                  {new Date(reading.observedAt).toLocaleString("en-GB", {
                    timeZone: "UTC",
                  })}{" "}
                  UTC
                </time>{" "}
                · {reading.source}
                {stale && " · Not a current measurement."}
              </>
            ) : (
              "Waiting for a verified source reading."
            )}
          </p>
          {isDemo ? (
            <a
              href={links.nasa}
              target="_blank"
              rel="noreferrer"
              className="quiet-link shrink-0 text-[11px]"
            >
              Explore the science
              <ArrowUpRight size={13} />
            </a>
          ) : (
            <button
              onClick={refresh}
              disabled={loading}
              className="button-secondary shrink-0 px-4 text-[11px]"
            >
              <RefreshCw
                size={13}
                className={
                  loading ? "animate-spin motion-reduce:animate-none" : ""
                }
              />
              {loading ? "Refreshing…" : "Refresh readings"}
            </button>
          )}
        </div>
        {error && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-copper/30 bg-copper/5 p-4 text-sm text-copper"
          >
            {error} {reading && "The last successful reading remains visible."}
          </p>
        )}
        {!isDemo && reading && (
          <a
            href={reading.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="quiet-link"
          >
            View original observation
            <ArrowUpRight size={13} />
          </a>
        )}
        <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6">
          <Radio size={17} className="text-copper/70" />
          <span className="technical text-muted">
            Across the distance, curiosity connects us.
          </span>
        </div>
      </div>
    </section>
  );
}
