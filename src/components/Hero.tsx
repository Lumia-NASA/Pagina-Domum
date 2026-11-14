import {
  ArrowDown,
  ArrowUpRight,
  Crosshair,
  MoveUpRight,
  Pause,
  Play,
  Scan,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import MarsGlobe from "./MarsGlobe";
import { links } from "../lib/config";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function Hero() {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[850px] flex-col overflow-hidden pt-32 sm:min-h-[100svh] lg:h-svh lg:min-h-[760px] lg:pt-28 [@media(min-width:1024px)_and_(max-height:800px)]:pt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_56%,#5b2a171e_0%,transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 top-[24%] -z-10 size-[450px] rounded-full bg-amber-900/[.06] blur-3xl"
      />
      <div
        className="page-width relative text-center motion-safe:animate-arrive"
        data-enter
      >
        <h1
          id="hero-title"
          className="pl-[.18em] text-[clamp(2rem,9.4vw,9rem)] leading-[1.1] font-light tracking-[.18em] [@media(min-width:1024px)_and_(max-height:800px)]:text-[5.25rem]"
        >
          MARSVIEW
        </h1>
        <p className="mx-auto mt-5 max-w-[300px] text-[9px] leading-5 tracking-[.24em] text-muted uppercase sm:max-w-none sm:text-[10px] sm:tracking-[.36em]">
          Next-generation Martian cartography & exploration
        </p>
      </div>

      <div className="page-width relative mt-8 flex min-h-[340px] flex-1 items-center justify-center sm:mt-3 sm:min-h-[400px] [@media(min-width:1024px)_and_(max-height:800px)]:min-h-[310px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-copper/15 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[260px] w-[min(90vw,780px)] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border border-copper/[.13] sm:h-[330px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[.06] sm:size-[440px]"
        />
        <div className="pointer-events-none absolute inset-x-0 inset-y-6 rounded-2xl border border-white/[.045] bg-white/[.008]">
          <span className="absolute -top-1 -left-1 text-copper/40">
            <Crosshair size={10} />
          </span>
          <span className="absolute -right-1 -bottom-1 text-copper/40">
            <Crosshair size={10} />
          </span>
        </div>
        <div className="relative aspect-square w-[350px] shrink-0 sm:w-[470px] [@media(min-width:1024px)_and_(max-height:800px)]:w-[370px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[14%] rounded-full bg-copper/[.09] blur-[45px]"
          />
          <MarsGlobe paused={paused} className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute left-6 top-[35%] hidden lg:block">
          <p className="technical text-copper/90">Planetary survey</p>
          <p className="mt-3 text-[12px] text-paper/80">
            The fourth world.
            <br />
            <span className="text-muted">A closer perspective.</span>
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-9 bg-copper/40" />
            <span className="technical text-muted">MARS / SOL SYSTEM</span>
          </div>
        </div>
        <div className="pointer-events-none absolute top-[33%] right-6 hidden w-[165px] lg:block">
          <div className="mb-3 flex items-center gap-2">
            <Scan size={14} className="text-copper" />
            <span className="technical text-copper/90">
              Orbital perspective
            </span>
          </div>
          <dl className="space-y-2 font-mono text-[10px]">
            <div className="flex justify-between">
              <dt className="text-muted">MEAN RADIUS</dt>
              <dd>
                3,389.5 <span className="text-muted">KM</span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">GRAVITY</dt>
              <dd>
                3.71 <span className="text-muted">M/S²</span>
              </dd>
            </div>
          </dl>
          <div className="mt-5 h-px bg-gradient-to-r from-copper/35 to-transparent" />
        </div>
        <div className="absolute right-4 bottom-8 flex items-center gap-3">
          <span className="technical hidden text-muted sm:inline">
            {paused || reduced ? "Rotation paused" : "Drag to rotate"}
          </span>
          <button
            onClick={() => setPaused(!paused)}
            disabled={reduced}
            className="icon-button size-11"
            aria-label={
              paused || reduced
                ? "Resume globe rotation"
                : "Pause globe rotation"
            }
            aria-pressed={paused || reduced}
          >
            {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>
        <span className="technical absolute bottom-11 left-5 hidden text-muted sm:block">
          3D SURFACE VIEW{" "}
          <span aria-hidden="true" className="mx-2 text-copper">
            /
          </span>{" "}
          V.01
        </span>
      </div>

      <div className="page-width relative pb-7 text-center sm:pb-3">
        <p className="mb-4 text-[13px] leading-6 text-muted">
          An entire planet. A new point of view.
        </p>
        <div className="mx-auto flex max-w-[550px] flex-col justify-center gap-3 sm:flex-row">
          <a href="#explorer" className="button-primary group">
            <Sparkles size={15} strokeWidth={1.5} />
            Launch Interactive Map
            <MoveUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href={links.data}
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
          >
            Explore NASA Data
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[.06] pt-2">
          <span className="technical text-muted">Built for the curious.</span>
          <a
            href="#capabilities"
            aria-label="Scroll to MarsView capabilities"
            className="inline-flex min-h-11 items-center gap-3 text-[9px] tracking-[.18em] text-muted uppercase"
          >
            Discover MarsView
            <ArrowDown size={13} className="text-copper" />
          </a>
          <span className="technical hidden text-muted sm:block">
            NASA Space Apps / 2026
          </span>
        </div>
      </div>
    </section>
  );
}
