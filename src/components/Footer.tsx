import { ArrowUpRight, Github, Orbit } from "lucide-react";
import { Brand } from "./Brand";
import { links, repositoryUrl } from "../lib/config";

export function Footer() {
  return (
    <footer id="mission" className="page-width pt-20 pb-8">
      <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 sm:flex-row sm:items-start">
        <div>
          <Brand />
          <p className="mt-4 max-w-72 text-xs leading-6 text-muted">
            Made on Earth. Built to explore beyond it.
            <br />
            An independent project for the
            <br />
            NASA Space Apps Challenge 2026.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-5">
          <div className="flex flex-col">
            <span className="mb-3 text-xs font-medium">Explore</span>
            <a className="quiet-link" href="#explorer">
              Interactive map
              <ArrowUpRight size={13} />
            </a>
            <a className="quiet-link" href="#regions">
              Regions of interest
              <ArrowUpRight size={13} />
            </a>
            <a className="quiet-link" href="#atlas">
              Planetary atlas
              <ArrowUpRight size={13} />
            </a>
            <a
              className="quiet-link"
              href={links.data}
              target="_blank"
              rel="noreferrer"
            >
              NASA open data
              <ArrowUpRight size={13} />
            </a>
            <a
              className="quiet-link"
              href={links.spaceApps}
              target="_blank"
              rel="noreferrer"
            >
              Space Apps Challenge
              <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="flex flex-col">
            <span className="mb-3 text-xs font-medium">Built in the open</span>
            <a
              className="quiet-link"
              href={repositoryUrl ?? "https://github.com/nasa"}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={14} />
              {repositoryUrl ? "MarsView source code" : "NASA open source"}
              <ArrowUpRight size={13} />
            </a>
            <span className="mt-4 flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-mono text-[9px] text-muted">
              <Orbit size={13} className="text-copper" />
              REACT + THREE.JS + TAILWIND
            </span>
            <a
              className="quiet-link mt-2"
              href={links.api}
              target="_blank"
              rel="noreferrer"
            >
              NASA API documentation <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 py-6 text-[10px] leading-5 text-muted sm:flex-row">
        <p>© 2026 MarsView. An independent exploration project.</p>
        <p>
          Texture:{" "}
          <a
            className="underline underline-offset-4 hover:text-paper"
            href={links.textures}
            target="_blank"
            rel="noreferrer"
          >
            Solar System Scope · CC BY 4.0
          </a>
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> · </span>Imagery:
          NASA/JPL-Caltech/ASU/MSSS.
        </p>
      </div>
      <div
        aria-hidden="true"
        className="overflow-hidden border-t border-white/[.04] pt-5 text-center text-[clamp(2.8rem,12.7vw,10.5rem)] leading-none font-light tracking-[.18em] text-white/[.045]"
      >
        MARSVIEW
      </div>
    </footer>
  );
}
