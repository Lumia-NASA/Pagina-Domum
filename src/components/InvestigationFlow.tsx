import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDotDashed,
  Database,
  Radar,
  Route,
} from "lucide-react";
import { links } from "../lib/config";

const stages = [
  {
    number: "01",
    title: "Locate",
    body: "Begin with a region, a coordinate, and the planetary context that gives it meaning.",
    icon: CircleDotDashed,
  },
  {
    number: "02",
    title: "Observe",
    body: "Bring orbital views and on-the-ground observation into one focused reading surface.",
    icon: Radar,
  },
  {
    number: "03",
    title: "Compare",
    body: "Keep source, time, and instrument visible when you compare a terrain or a data point.",
    icon: Database,
  },
  {
    number: "04",
    title: "Plan",
    body: "Use those layers to frame a route concept before treating a line as a safe traverse.",
    icon: Route,
  },
] as const;

export function InvestigationFlow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="page-width py-24 sm:py-32"
    >
      <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-20">
          <p className="technical text-copper">A cartographic workflow</p>
          <h2
            id="workflow-title"
            className="mt-5 text-[36px] leading-[1.12] font-light tracking-[-.045em] sm:text-6xl"
          >
            From a signal
            <br />
            <span className="text-muted">to a decision.</span>
          </h2>
          <p className="mt-7 max-w-sm text-[15px] leading-7 text-muted">
            MarsView is designed as a reading order: establish planetary scale,
            move into the evidence, then keep uncertainty visible as you
            explore.
          </p>
          <a href="#explorer" className="button-secondary mt-8">
            Start in the explorer <ArrowUpRight size={15} />
          </a>
        </div>

        <ol className="border-t border-white/10">
          {stages.map(({ number, title, body, icon: Icon }) => (
            <li
              key={number}
              className="group grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-8"
            >
              <span className="font-mono text-[11px] text-copper">
                {number}
              </span>
              <div>
                <h3 className="text-[23px] font-medium tracking-[-.03em]">
                  {title}
                </h3>
                <p className="mt-2 max-w-lg text-[13px] leading-6 text-muted">
                  {body}
                </p>
              </div>
              <Icon
                className="hidden text-muted transition-colors duration-300 group-hover:text-copper sm:block"
                size={24}
                strokeWidth={1.2}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        <a
          href={links.perseverance}
          target="_blank"
          rel="noreferrer"
          className="glass-panel group block p-6 transition duration-300 hover:-translate-y-0.5 hover:border-copper/35"
        >
          <p className="technical text-copper">Surface mission</p>
          <h3 className="mt-5 text-xl font-medium">Perseverance</h3>
          <p className="mt-3 text-xs leading-6 text-muted">
            Mission objectives, landing-site context, and an entry point to
            public rover imagery.
          </p>
          <span className="quiet-link mt-5 text-copper">
            Open mission page <ArrowUpRight size={13} />
          </span>
        </a>
        <a
          href={links.mro}
          target="_blank"
          rel="noreferrer"
          className="glass-panel group block p-6 transition duration-300 hover:-translate-y-0.5 hover:border-copper/35"
        >
          <p className="technical text-copper">Orbital mission</p>
          <h3 className="mt-5 text-xl font-medium">MRO</h3>
          <p className="mt-3 text-xs leading-6 text-muted">
            Orbital observations of Mars’ surface, subsurface, atmosphere, and
            water history.
          </p>
          <span className="quiet-link mt-5 text-copper">
            Open mission page <ArrowUpRight size={13} />
          </span>
        </a>
        <a
          href={links.data}
          target="_blank"
          rel="noreferrer"
          className="glass-panel group block p-6 transition duration-300 hover:-translate-y-0.5 hover:border-copper/35"
        >
          <p className="technical text-copper">Open archive</p>
          <h3 className="mt-5 text-xl font-medium">Mars 2020 PDS</h3>
          <p className="mt-3 text-xs leading-6 text-muted">
            A public archive of Mars 2020 mission data, organized by instrument
            and release.
          </p>
          <span className="quiet-link mt-5 text-copper">
            Browse the archive <ArrowUpRight size={13} />
          </span>
        </a>
      </div>
      <div className="mt-6 flex items-center gap-3 text-[11px] leading-6 text-muted">
        <ArrowDownRight size={15} className="text-copper" />
        Mission links open the original sources in a new tab.
      </div>
    </section>
  );
}
