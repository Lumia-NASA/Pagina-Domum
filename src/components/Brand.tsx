import { Orbit } from "lucide-react";

export function Brand() {
  return (
    <a
      href="#home"
      aria-label="MarsView home"
      className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold tracking-[.2em]"
    >
      <Orbit className="size-7 text-copper" strokeWidth={1.25} />
      MARSVIEW
    </a>
  );
}
