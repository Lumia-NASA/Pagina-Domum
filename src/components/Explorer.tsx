import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Crosshair,
  Grid2X2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MarsGlobe from "./MarsGlobe";
import { regions, type Region } from "../lib/config";
import { coordinate } from "../lib/telemetry";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Explorer({
  initialRegionId,
}: {
  initialRegionId?: string;
}) {
  const initialRegion =
    regions.find((item) => item.id === initialRegionId) ?? regions[0];
  const [region, setRegion] = useState<Region>(initialRegion);
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(true);
  const [paused, setPaused] = useState(true);
  const [reset, setReset] = useState(0);
  const title = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    title.current?.focus();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const nextRegion = regions.find((item) => item.id === initialRegionId);
    if (nextRegion) {
      setRegion(nextRegion);
      setPaused(true);
    }
  }, [initialRegionId]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-svh flex-col bg-[radial-gradient(ellipse_at_60%_50%,#48211330,transparent_65%)] outline-none"
    >
      <header className="border-b border-white/10">
        <div className="page-width flex min-h-20 flex-wrap items-center justify-between gap-3 py-3">
          <a href="#home" className="quiet-link">
            <ArrowLeft size={16} />
            Back to MarsView
          </a>
          <span className="technical text-copper">
            Planetary explorer / preview
          </span>
        </div>
      </header>
      <div className="page-width grid flex-1 gap-8 py-10 lg:grid-cols-[300px_1fr] lg:items-center">
        <aside className="order-2 lg:order-1">
          <h1
            ref={title}
            tabIndex={-1}
            className="text-3xl font-light outline-none"
          >
            Find your perspective.
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Select a region, rotate the globe, and explore its place on Mars.
          </p>
          <fieldset className="mt-8">
            <legend className="mb-3 text-xs text-muted">
              Regions of interest
            </legend>
            <div className="space-y-2">
              {regions.map((item) => (
                <label
                  key={item.id}
                  className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${region.id === item.id ? "border-copper/50 bg-copper/10" : "border-white/10 hover:border-white/30"}`}
                >
                  <input
                    type="radio"
                    name="region"
                    value={item.id}
                    checked={region.id === item.id}
                    onChange={() => {
                      setRegion(item);
                      setPaused(true);
                    }}
                    className="peer sr-only"
                  />
                  <span className="flex size-5 items-center justify-center rounded-full border border-copper/40 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-copper">
                    {region.id === item.id && (
                      <Check size={12} className="text-copper" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm">{item.name}</span>
                    <span className="mt-1 block text-[10px] text-muted">
                      {item.type}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div
            className="mt-8 border-t border-white/10 pt-6"
            aria-live="polite"
          >
            <p className="text-sm leading-7 text-muted">{region.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-copper">
              <span>{coordinate(region.latitude, "latitude")}</span>
              <span>{coordinate(region.longitude, "longitude")}</span>
            </div>
            <a
              className="quiet-link mt-4"
              href={region.source}
              target="_blank"
              rel="noreferrer"
            >
              Read the NASA field notes
              <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>
        <div className="relative order-1 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[.01] lg:order-2">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-between p-5">
            <span className="technical text-muted">MARS / SURFACE COLOR</span>
            <Crosshair size={17} className="text-copper" />
          </div>
          <MarsGlobe
            key={reset}
            region={region}
            zoom={zoom}
            grid={grid}
            paused={paused}
            className="h-[350px] w-full sm:h-[500px] lg:h-[610px]"
          />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <div className="flex gap-2">
              <button
                className="icon-button"
                onClick={() =>
                  setZoom((value) => Math.max(0.8, +(value - 0.15).toFixed(2)))
                }
                disabled={zoom <= 0.8}
                aria-label="Zoom out"
              >
                <Minus size={16} />
              </button>
              <output
                aria-label="Zoom level"
                className="flex w-12 items-center justify-center font-mono text-xs text-muted"
              >
                {zoom.toFixed(1)}×
              </output>
              <button
                className="icon-button"
                onClick={() =>
                  setZoom((value) => Math.min(1.6, +(value + 0.15).toFixed(2)))
                }
                disabled={zoom >= 1.6}
                aria-label="Zoom in"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className={`icon-button ${grid ? "border-copper/50 text-copper" : ""}`}
                aria-label="Toggle coordinate mesh"
                aria-pressed={grid}
                onClick={() => setGrid(!grid)}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                className="icon-button"
                onClick={() => setPaused(!paused)}
                disabled={reduced}
                aria-pressed={paused || reduced}
                aria-label={
                  paused || reduced
                    ? "Resume globe rotation"
                    : "Pause globe rotation"
                }
              >
                {paused || reduced ? <Play size={15} /> : <Pause size={15} />}
              </button>
              <button
                className="icon-button"
                aria-label="Reset globe view"
                onClick={() => {
                  setZoom(1);
                  setPaused(true);
                  setGrid(true);
                  setReset((value) => value + 1);
                }}
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="page-width border-t border-white/10 py-6 text-[10px] leading-6 text-muted">
        Visualization preview · Surface-color texture, not an elevation model.
        Region locations are approximate. Drag horizontally or focus the globe
        and use the arrow keys.
      </footer>
    </main>
  );
}
