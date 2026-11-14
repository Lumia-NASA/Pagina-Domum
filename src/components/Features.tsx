import {
  ArrowUpRight,
  ChevronRight,
  Crosshair,
  Focus,
  Layers3,
  Radio,
  Route,
} from "lucide-react";
import { useState } from "react";
import { links } from "../lib/config";

export function Features() {
  const [surface, setSurface] = useState(false);
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="page-width py-24 sm:py-28 lg:flex lg:min-h-[900px] lg:flex-col lg:justify-center"
    >
      <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <h2
          id="capabilities-title"
          className="max-w-[600px] text-[32px] leading-[1.2] font-light tracking-[-.035em] sm:text-5xl"
        >
          Less distance.
          <br />
          <span className="text-muted">More discovery.</span>
        </h2>
        <p className="max-w-[300px] text-sm leading-7 text-muted">
          From the quiet of orbit to the texture of the terrain. Explore Mars at
          every scale.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[252px_252px]">
        <article className="glass-panel group relative flex min-h-[520px] flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:border-copper/25 lg:row-span-2">
          <div className="relative z-10 flex items-center justify-between px-7 pt-7">
            <Focus className="text-copper" size={23} strokeWidth={1.3} />
            <span className="technical text-muted">Scale without limits</span>
          </div>
          <div className="relative flex min-h-[250px] flex-1 items-center justify-center overflow-hidden">
            <img
              src="/images/jezero-panorama.jpg"
              alt="Rocky terrain at Jezero Crater, photographed by Perseverance's Mastcam-Z"
              loading="lazy"
              width="1600"
              height="600"
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ${surface ? "scale-150" : "scale-100"}`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#0e0d0c] via-transparent to-[#0e0d0c]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-void/35 to-transparent"
            />
            <div className="absolute top-12 left-7 font-mono text-[10px] text-paper/70">
              JEZERO / MASTCAM-Z
              <br />
              <span className="text-copper">
                {surface ? "SURFACE DETAIL" : "PANORAMIC VIEW"}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="relative flex size-32 items-center justify-center rounded-full border border-white/20"
            >
              <div className="size-24 rounded-full border border-dashed border-white/20" />
              <Crosshair
                className="absolute size-5 text-paper/60"
                strokeWidth={1}
              />
            </div>
            <button
              onClick={() => setSurface(!surface)}
              aria-pressed={surface}
              className="absolute right-5 bottom-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-void/70 px-4 text-[10px] backdrop-blur-lg"
            >
              <Layers3 size={13} />
              {surface ? "Return to panorama" : "Inspect the surface"}
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="relative px-7 pt-4 pb-7">
            <h3 className="text-2xl font-medium tracking-[-.025em]">
              Atmospheric Zoom
            </h3>
            <p className="mt-3 max-w-[380px] text-[13px] leading-6 text-muted">
              A closer look, from orbital context to the dust of Jezero.
              Discover the surface behind the coordinates.
            </p>
            <a href="#explorer" className="quiet-link mt-4 text-copper">
              Explore the globe
              <ArrowUpRight size={14} />
            </a>
          </div>
        </article>

        <article className="glass-panel group relative min-h-[290px] overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:border-copper/25 lg:min-h-0">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] bg-[url('/images/mars-color.jpg')] bg-[length:800px] bg-[position:30%_60%] opacity-20 [mask-image:linear-gradient(to_right,transparent,black)]" />
          <svg
            aria-hidden="true"
            className="absolute top-6 right-2 h-[210px] w-[230px] text-copper opacity-25 sm:opacity-60"
            viewBox="0 0 230 210"
            fill="none"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M ${80 + i * 14} -10 C ${30 + i * 8} 60, ${200 - i * 8} 55, ${145 + i * 12} 110 S ${65 + i * 11} 175, ${170 + i * 10} 230`}
                stroke="currentColor"
                strokeWidth=".5"
                opacity=".35"
              />
            ))}
            <path
              d="M55 176 81 156 79 131 112 107 143 108 159 77 189 51"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
            <circle cx="55" cy="176" r="4" fill="currentColor" />
            <circle cx="189" cy="51" r="5" fill="currentColor" />
            <circle
              cx="189"
              cy="51"
              r="12"
              stroke="currentColor"
              opacity=".3"
            />
          </svg>
          <div className="relative z-10 flex h-full flex-col items-start p-7">
            <Route size={22} className="text-copper" strokeWidth={1.3} />
            <h3 className="mt-6 max-w-56 text-[22px] leading-snug font-medium tracking-[-.025em]">
              Rover Routing
              <br />
              Engine
            </h3>
            <p className="mt-3 max-w-[245px] text-xs leading-6 text-muted">
              A terrain-aware navigation concept.
              <br />
              See the path beyond the obstacles.
            </p>
            <span className="technical mt-3 text-copper/80">
              Route concept / preview
            </span>
          </div>
        </article>

        <article className="glass-panel group relative min-h-[275px] overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:border-copper/25 lg:min-h-0">
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-12 size-72 rounded-full bg-copper/[.045] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute top-7 right-7 flex h-10 w-24 items-end justify-between gap-1 opacity-45 sm:h-24 sm:w-32"
          >
            {[
              15, 28, 21, 42, 65, 39, 77, 54, 91, 66, 48, 74, 45, 60, 34, 52,
            ].map((height, index) => (
              <span
                key={index}
                className="w-1.5 rounded-t-sm bg-gradient-to-t from-copper/10 to-copper"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="relative p-7">
            <Radio size={22} className="text-copper" strokeWidth={1.3} />
            <h3 className="mt-6 max-w-64 text-[22px] leading-snug font-medium tracking-[-.025em]">
              Real-time NASA
              <br />
              Telemetry
            </h3>
            <p className="mt-3 max-w-[300px] text-xs leading-6 text-muted">
              A window into mission measurements and rover imagery. Trace every
              reading to its source.
            </p>
            <a
              href={links.images}
              target="_blank"
              rel="noreferrer"
              className="quiet-link mt-1 text-copper"
            >
              Browse rover images
              <ArrowUpRight size={13} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
