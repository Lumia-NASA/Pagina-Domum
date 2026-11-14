export const links = {
  nasa: "https://science.nasa.gov/mars/",
  api: "https://api.nasa.gov/",
  data: "https://pds-geosciences.wustl.edu/missions/mars2020/",
  images: "https://mars.nasa.gov/mars2020/multimedia/raw-images/",
  facts: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html",
  perseverance: "https://science.nasa.gov/mission/mars-2020-perseverance/",
  mro: "https://science.nasa.gov/mission/mars-reconnaissance-orbiter/",
  spaceApps: "https://www.spaceappschallenge.org/2026/",
  textures: "https://www.solarsystemscope.com/textures/",
};

export function safeExternalUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export const repositoryUrl = safeExternalUrl(
  import.meta.env.VITE_REPOSITORY_URL,
);

export const regions = [
  {
    id: "jezero",
    name: "Jezero Crater",
    latitude: 18.4446,
    longitude: 77.4509,
    type: "Perseverance landing site",
    description:
      "An ancient lake basin and river delta. Explore the region chosen for the Perseverance mission.",
    source:
      "https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/landing_site/",
  },
  {
    id: "olympus",
    name: "Olympus Mons",
    latitude: 18.65,
    longitude: -133.8,
    type: "Shield volcano",
    description:
      "A vast volcanic shield on the western edge of Tharsis. See how it sits within the surrounding plains.",
    source: "https://science.nasa.gov/mars/facts/",
  },
  {
    id: "valles",
    name: "Valles Marineris",
    latitude: -14,
    longitude: -59.2,
    type: "Canyon system",
    description:
      "A canyon system stretching across the Martian equator. Follow its position on the planetary surface.",
    source: "https://science.nasa.gov/mars/facts/",
  },
] as const;

export type Region = (typeof regions)[number];
