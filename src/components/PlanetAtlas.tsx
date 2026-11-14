import { ArrowUpRight, Clock3, Gauge, Orbit, Scale } from "lucide-react";
import { links } from "../lib/config";

const measures = [
  {
    label: "Length of a sol",
    value: "24.6597",
    unit: "hours",
    detail: "A Martian solar day is just over 24 hours.",
    icon: Clock3,
  },
  {
    label: "A year on Mars",
    value: "686.98",
    unit: "Earth days",
    detail: "Mars takes nearly 687 Earth days to orbit the Sun.",
    icon: Orbit,
  },
  {
    label: "Surface gravity",
    value: "3.73",
    unit: "m/s²",
    detail: "About 38% of Earth’s mean surface gravity.",
    icon: Scale,
  },
  {
    label: "Mean pressure",
    value: "6.36",
    unit: "mb",
    detail: "Surface pressure changes with elevation and season.",
    icon: Gauge,
  },
] as const;

export function PlanetAtlas() {
  return (
    <section
      id="atlas"
      aria-labelledby="atlas-title"
      className="relative overflow-hidden border-y border-white/[.07] bg-[#0a0908] py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-copper/[.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[.06]"
      />
      <div className="page-width relative">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="technical text-copper">Planetary baseline</p>
            <h2
              id="atlas-title"
              className="mt-5 max-w-[520px] text-[36px] leading-[1.12] font-light tracking-[-.045em] sm:text-6xl"
            >
              Know the planet
              <br />
              <span className="text-muted">before the path.</span>
            </h2>
          </div>
          <p className="max-w-[480px] text-[15px] leading-7 text-muted lg:ml-auto">
            Mapping starts with scale. MarsView keeps the planetary reference
            close to every local observation, so a point on the map never loses
            the world around it.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {measures.map(({ label, value, unit, detail, icon: Icon }) => (
            <article
              key={label}
              className="min-h-[260px] bg-[#0a0908] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <Icon size={19} strokeWidth={1.35} className="text-copper" />
                <span className="technical text-muted">REFERENCE</span>
              </div>
              <h3 className="mt-10 text-[13px] font-medium text-muted">
                {label}
              </h3>
              <p className="mt-3 flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-[34px] tracking-[-.065em] text-paper">
                  {value}
                </span>
                <span className="text-xs text-copper">{unit}</span>
              </p>
              <p className="mt-7 max-w-[210px] text-xs leading-6 text-muted">
                {detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 text-[11px] leading-6 text-muted sm:flex-row sm:items-center">
          <p>
            Static planetary reference. These values are not live mission
            telemetry.
          </p>
          <a
            className="quiet-link shrink-0 text-copper"
            href={links.facts}
            target="_blank"
            rel="noreferrer"
          >
            Open NASA fact sheet <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
