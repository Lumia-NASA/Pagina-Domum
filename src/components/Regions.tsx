import { ArrowUpRight, Mountain, ScanSearch, Waves } from "lucide-react";
import { links, regions } from "../lib/config";

const regionFacts = {
  jezero: {
    icon: Waves,
    measure: "45 km wide",
    source: links.perseverance,
    note: "An ancient lake basin and river delta selected as Perseverance’s landing site.",
  },
  olympus: {
    icon: Mountain,
    measure: "THARSIS REGION",
    source: links.facts,
    note: "A volcanic landmark on the western edge of the Tharsis region.",
  },
  valles: {
    icon: ScanSearch,
    measure: "EQUATORIAL CANYONS",
    source: links.facts,
    note: "A vast canyon system spanning the Martian equatorial region.",
  },
} as const;

export function Regions() {
  return (
    <section
      id="regions"
      aria-labelledby="regions-title"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_85%_20%,#5d2b181e,transparent_45%)] py-24 sm:py-32"
    >
      <div className="page-width">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="technical text-copper">Coordinates worth following</p>
            <h2
              id="regions-title"
              className="mt-5 text-[36px] leading-[1.12] font-light tracking-[-.045em] sm:text-6xl"
            >
              Three places.
              <br />
              <span className="text-muted">Three questions.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-7 text-muted">
            Use these places as starting points, then move through the globe to
            see how local terrain belongs to a larger Martian system.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {regions.map((region, index) => {
            const fact = regionFacts[region.id];
            const Icon = fact.icon;
            return (
              <article
                key={region.id}
                className="glass-panel group relative min-h-[370px] overflow-hidden p-7 transition duration-300 hover:-translate-y-0.5 hover:border-copper/35"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -bottom-16 size-64 rounded-full border border-copper/15 bg-[url('/images/mars-color.jpg')] bg-[length:560px] opacity-25 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="relative flex items-center justify-between">
                  <Icon className="text-copper" size={22} strokeWidth={1.3} />
                  <span className="technical text-muted">
                    REGION 0{index + 1}
                  </span>
                </div>
                <div className="relative mt-16">
                  <p className="technical text-copper">{fact.measure}</p>
                  <h3 className="mt-3 text-[29px] font-medium tracking-[-.04em]">
                    {region.name}
                  </h3>
                  <p className="mt-4 max-w-[300px] text-[13px] leading-6 text-muted">
                    {fact.note}
                  </p>
                </div>
                <div className="relative mt-10 flex items-center justify-between border-t border-white/10 pt-5">
                  <a
                    className="quiet-link text-copper"
                    href={`#explorer/${region.id}`}
                  >
                    Open in explorer <ArrowUpRight size={13} />
                  </a>
                  <a
                    className="icon-button size-10"
                    aria-label={`Read NASA sources about ${region.name}`}
                    href={fact.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
