import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./Brand";

const navigation = [
  { href: "#capabilities", name: "Capabilities" },
  { href: "#regions", name: "Regions" },
  { href: "#atlas", name: "Atlas" },
  { href: "#telemetry", name: "Telemetry" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const media = window.matchMedia("(min-width: 768px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", close);
    media.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", close);
      media.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/[.06]">
      <div className="page-width flex h-20 items-center justify-between gap-4">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:gap-9 md:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="quiet-link text-[11px]"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <a
          href="#explorer"
          className="button-secondary hidden min-h-10 px-5 py-2 text-[10px] sm:inline-flex"
        >
          Enter explorer
          <ArrowUpRight size={14} />
        </a>
        <button
          ref={menuButton}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="icon-button md:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-20 border-b border-white/10 bg-void/95 px-6 py-8 backdrop-blur-xl md:hidden"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-between border-b border-white/10 text-lg"
            >
              {item.name}
              <ArrowUpRight size={18} className="text-copper" />
            </a>
          ))}
          <a
            href="#explorer"
            onClick={() => setOpen(false)}
            className="button-primary mt-6 w-full"
          >
            Launch Interactive Map
            <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}
