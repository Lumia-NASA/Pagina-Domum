import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { Region } from "../lib/config";

export interface MarsGlobeProps {
  paused?: boolean;
  zoom?: number;
  grid?: boolean;
  region?: Region;
  className?: string;
}

/** The rendering boundary: replace this component to connect an existing MarsGlobe implementation. */
export default function MarsGlobe({
  paused = false,
  zoom = 1,
  grid = false,
  region,
  className = "",
}: MarsGlobeProps) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{
    focus: (region: Region) => void;
    start: () => void;
  } | null>(null);
  const reduced = useReducedMotion();
  const settings = useRef({ paused, zoom, grid, reduced });
  settings.current = { paused, zoom, grid, reduced };
  const initialRegion = useRef(region);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};
    import("../lib/three")
      .then((THREE) => {
        if (disposed) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          setStatus("fallback");
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.z = 4.5;
        scene.add(new THREE.AmbientLight(0xe3b9a5, 1.2));
        const sunlight = new THREE.DirectionalLight(0xffe1c0, 3.2);
        sunlight.position.set(-3, 2.2, 3);
        scene.add(sunlight);
        const rim = new THREE.DirectionalLight(0xb85837, 1.3);
        rim.position.set(4, -1, -2);
        scene.add(rim);
        const globe = new THREE.Group();
        scene.add(globe);
        const geometry = new THREE.SphereGeometry(1, 96, 64);
        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1,
          metalness: 0,
        });
        const sphere = new THREE.Mesh(geometry, material);
        globe.add(sphere);
        let texture: InstanceType<typeof THREE.Texture> | undefined;
        new THREE.TextureLoader().load(
          "/images/mars-color.jpg",
          (loaded) => {
            if (disposed) {
              loaded.dispose();
              return;
            }
            texture = loaded;
            loaded.colorSpace = THREE.SRGBColorSpace;
            loaded.anisotropy = Math.min(
              4,
              renderer.capabilities.getMaxAnisotropy(),
            );
            material.map = loaded;
            material.needsUpdate = true;
            setStatus("ready");
            draw();
          },
          undefined,
          () => {
            if (!disposed) setStatus("fallback");
          },
        );

        const gridGeometry = new THREE.SphereGeometry(1.006, 24, 12);
        const gridMaterial = new THREE.LineBasicMaterial({
          color: 0xf7ca9d,
          transparent: true,
          opacity: 0.18,
        });
        const wire = new THREE.WireframeGeometry(gridGeometry);
        const graticule = new THREE.LineSegments(wire, gridMaterial);
        globe.add(graticule);
        const pinGeometry = new THREE.SphereGeometry(0.016, 12, 8);
        const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xffd4a3 });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.visible = false;
        globe.add(pin);

        let targetX = 0.15,
          targetY = 3.6,
          frame = 0,
          last = 0,
          inView = true,
          pointer: { x: number; y: number; id: number } | null = null;
        globe.rotation.set(targetX, targetY, -0.12);
        const focus = (destination: Region) => {
          const lat = (destination.latitude * Math.PI) / 180;
          const lon = (destination.longitude * Math.PI) / 180;
          targetX = lat;
          targetY = -Math.PI / 2 - lon;
          globe.rotation.z = 0;
          pin.position
            .set(
              Math.cos(lat) * Math.cos(lon),
              Math.sin(lat),
              -Math.cos(lat) * Math.sin(lon),
            )
            .multiplyScalar(1.018);
          pin.visible = true;
          if (settings.current.reduced) globe.rotation.set(targetX, targetY, 0);
          start();
        };
        api.current = { focus, start };

        function draw() {
          if (disposed || renderer.getContext().isContextLost()) return;
          graticule.visible = settings.current.grid;
          camera.position.z = 4.5 / settings.current.zoom;
          renderer.render(scene, camera);
        }
        function tick(time: number) {
          frame = 0;
          if (disposed || !inView || document.hidden) return;
          const delta = Math.min((time - last) / 1000, 0.05);
          if (time - last < 30) {
            frame = requestAnimationFrame(tick);
            return;
          }
          last = time;
          if (!settings.current.paused && !settings.current.reduced && !pointer)
            targetY += delta * 0.075;
          globe.rotation.x +=
            (targetX - globe.rotation.x) *
            (settings.current.reduced ? 1 : 0.12);
          globe.rotation.y +=
            (targetY - globe.rotation.y) *
            (settings.current.reduced ? 1 : 0.12);
          draw();
          const moving =
            Math.abs(targetX - globe.rotation.x) +
              Math.abs(targetY - globe.rotation.y) >
            0.0001;
          if (
            (!settings.current.paused && !settings.current.reduced) ||
            pointer ||
            moving
          )
            frame = requestAnimationFrame(tick);
        }
        function start() {
          if (!frame && inView && !document.hidden && !disposed) {
            last = performance.now();
            frame = requestAnimationFrame(tick);
          }
        }
        const resize = new ResizeObserver(() => {
          const { width, height } = mount.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          draw();
        });
        resize.observe(mount);
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          if (inView) start();
          else {
            cancelAnimationFrame(frame);
            frame = 0;
          }
        });
        observer.observe(mount);
        const visibility = () => {
          if (document.hidden) {
            cancelAnimationFrame(frame);
            frame = 0;
          } else start();
        };
        const down = (event: PointerEvent) => {
          if (!event.isPrimary) return;
          pointer = { x: event.clientX, y: event.clientY, id: event.pointerId };
          mount.setPointerCapture(event.pointerId);
          start();
        };
        const move = (event: PointerEvent) => {
          if (!pointer || event.pointerId !== pointer.id) return;
          targetY += (event.clientX - pointer.x) * 0.008;
          targetX = THREE.MathUtils.clamp(
            targetX + (event.clientY - pointer.y) * 0.005,
            -1.2,
            1.2,
          );
          pointer.x = event.clientX;
          pointer.y = event.clientY;
        };
        const up = () => {
          pointer = null;
        };
        const key = (event: KeyboardEvent) => {
          if (
            !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
              event.key,
            )
          )
            return;
          event.preventDefault();
          if (event.key === "ArrowLeft") targetY -= 0.12;
          if (event.key === "ArrowRight") targetY += 0.12;
          if (event.key === "ArrowUp") targetX = Math.max(-1.2, targetX - 0.12);
          if (event.key === "ArrowDown")
            targetX = Math.min(1.2, targetX + 0.12);
          start();
        };
        const lost = (event: Event) => {
          event.preventDefault();
          cancelAnimationFrame(frame);
          frame = 0;
          setStatus("fallback");
        };
        const restored = () => {
          setStatus("ready");
          start();
        };
        document.addEventListener("visibilitychange", visibility);
        mount.addEventListener("pointerdown", down);
        mount.addEventListener("pointermove", move);
        mount.addEventListener("pointerup", up);
        mount.addEventListener("pointercancel", up);
        mount.addEventListener("lostpointercapture", up);
        mount.addEventListener("keydown", key);
        renderer.domElement.addEventListener("webglcontextlost", lost);
        renderer.domElement.addEventListener("webglcontextrestored", restored);
        if (initialRegion.current) focus(initialRegion.current);
        start();
        cleanup = () => {
          cancelAnimationFrame(frame);
          resize.disconnect();
          observer.disconnect();
          document.removeEventListener("visibilitychange", visibility);
          mount.removeEventListener("pointerdown", down);
          mount.removeEventListener("pointermove", move);
          mount.removeEventListener("pointerup", up);
          mount.removeEventListener("pointercancel", up);
          mount.removeEventListener("lostpointercapture", up);
          mount.removeEventListener("keydown", key);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          renderer.domElement.removeEventListener(
            "webglcontextrestored",
            restored,
          );
          geometry.dispose();
          material.dispose();
          texture?.dispose();
          gridGeometry.dispose();
          wire.dispose();
          gridMaterial.dispose();
          pinGeometry.dispose();
          pinMaterial.dispose();
          renderer.dispose();
          renderer.domElement.remove();
          api.current = null;
        };
      })
      .catch(() => {
        if (!disposed) setStatus("fallback");
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (region) api.current?.focus(region);
  }, [region]);
  useEffect(() => {
    api.current?.start();
  }, [paused, zoom, grid, reduced]);

  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${status === "ready" ? "opacity-0" : "opacity-100"}`}
      >
        <div className="aspect-square h-[72%] max-w-[85%] rounded-full bg-[url('/images/mars-color.jpg')] bg-cover bg-center shadow-[inset_-50px_-20px_70px_25px_#050505,inset_8px_4px_24px_#e99c7250]" />
      </div>
      <div
        ref={host}
        role="group"
        aria-roledescription="interactive globe"
        aria-label="3D Mars globe. Drag or use the arrow keys to rotate."
        tabIndex={status === "ready" ? 0 : -1}
        className={`absolute inset-0 touch-pan-y rounded-full outline-offset-[-16px] ${status === "ready" ? "cursor-grab active:cursor-grabbing" : "opacity-0"}`}
      />
      {status === "fallback" && (
        <p
          className="absolute inset-x-0 bottom-2 text-center text-[10px] text-muted"
          role="status"
        >
          Static view · 3D is unavailable on this device
        </p>
      )}
    </div>
  );
}
