import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const items = [
  "SOL 428 · DEMO SEQUENCE",
  "PERSEVERANCE · JEZERO CRATER",
  "OLYMPUS MONS · SHIELD VOLCANO",
  "ORBIT TO SURFACE · A NEW PERSPECTIVE",
  "OPEN DATA · OPEN EXPLORATION",
];

export function MissionTicker() {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div
      className="relative flex h-14 items-center overflow-hidden border-y border-copper/10 bg-[#100c09]"
      aria-label="Mission information ticker"
    >
      <div
        className={`flex w-max shrink-0 ${reduced ? "" : "animate-ticker"}`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span
                key={item}
                className="technical flex items-center whitespace-nowrap text-[#b49b89]"
              >
                <span className="mx-8 size-1 rotate-45 bg-copper/70" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center bg-gradient-to-r from-transparent to-[#100c09] pl-12 pr-3">
        <button
          className="icon-button size-11 bg-[#100c09]"
          aria-label={
            paused || reduced ? "Resume mission ticker" : "Pause mission ticker"
          }
          aria-pressed={paused || reduced}
          onClick={() => setPaused(!paused)}
          disabled={reduced}
        >
          {paused || reduced ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>
    </div>
  );
}
