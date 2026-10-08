import { useEffect, useState } from "react";
import { Minus, Pause, Play, Plus, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BODIES, PLANETS, getBody, isPlanet, orbitFraction, type TextureKey } from "@/solar/bodies";
import {
  formatSpeed,
  speedToUnit,
  unitToSpeed,
  useSolar,
} from "@/solar/store";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatClock(day: number) {
  const whole = Math.max(0, Math.floor(day));
  const years = day / 365.256;
  return {
    days: whole.toLocaleString("ru-RU"),
    years: years.toLocaleString("ru-RU", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }),
  };
}

function BodyButton({ id, bordered }: { id: string; bordered?: boolean }) {
  const selected = useSolar((state) => state.selected === id);
  const body = getBody(id);
  if (!body) return null;
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={() => useSolar.getState().focus(id)}
      className={cn(
        "press flex h-11 shrink-0 items-center gap-2 rounded-sm px-3 text-left text-sm",
        bordered && "border border-line",
        selected ? "bg-subtle text-fg" : "text-muted hover:bg-subtle/70 hover:text-fg",
      )}
    >
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: body.swatch }}
        aria-hidden
      />
      {body.name}
    </button>
  );
}

function Clock() {
  const day = useSolar((state) => state.day);
  const paused = useSolar((state) => state.paused);
  const clock = formatClock(day);
  return (
    <div className="pointer-events-auto hud-panel rounded-lg px-3 py-2 text-right">
      <p className="font-sans text-sm tabular-nums text-fg">{clock.days} сут</p>
      <p className="text-xs tabular-nums text-muted">
        {clock.years} земных лет
        {paused ? " · пауза" : ""}
      </p>
    </div>
  );
}

function SurfacePortrait({ texture, swatch }: { texture?: TextureKey; swatch: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!texture) {
      setSrc(null);
      return;
    }
    let live = true;
    void import("@/solar/textures").then((mod) => {
      if (!live) return;
      const url = mod.getSurfacePreview(texture);
      if (url) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [texture]);
  return (
    <div
      className="size-16 shrink-0 overflow-hidden rounded-full border border-line"
      style={{ backgroundColor: swatch }}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : null}
    </div>
  );
}

function Panel() {
  const id = useSolar((state) => state.selected);
  const day = useSolar((state) => state.day);
  const body = id ? getBody(id) : undefined;
  if (!body) return null;
  const fraction = isPlanet(body) ? orbitFraction(body.period, body.phase, day) : null;
  return (
    <aside
      key={body.id}
      className="panel-in panel-scroll pointer-events-auto hud-panel w-full overflow-y-auto rounded-xl p-4 md:w-80"
    >
      <div className="flex items-start gap-3">
        <SurfacePortrait texture={body.texture} swatch={body.swatch} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-faint">{body.kind}</p>
          <h2 className="font-display text-3xl leading-none text-fg">{body.name}</h2>
        </div>
        <button
          type="button"
          aria-label="Вернуться к обзору"
          onClick={() => useSolar.getState().focus(null)}
          className="press grid h-11 w-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-subtle hover:text-fg"
        >
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body.blurb}</p>
      {fraction != null && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-faint">
            <span>Положение на орбите</span>
            <span className="tabular-nums text-muted">{Math.round(fraction * 100)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-subtle">
            <div className="h-full bg-accent" style={{ width: `${fraction * 100}%` }} />
          </div>
        </div>
      )}
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {body.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs text-faint">{fact.label}</dt>
            <dd className="text-sm text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-faint">
        Размеры и расстояния на сцене сближены, чтобы планеты было видно. Периоды — настоящие.
      </p>
    </aside>
  );
}

function Dock() {
  const paused = useSolar((state) => state.paused);
  const speed = useSolar((state) => state.speed);
  const showOrbits = useSolar((state) => state.showOrbits);
  const showLabels = useSolar((state) => state.showLabels);
  const setSpeed = useSolar((state) => state.setSpeed);
  return (
    <div className="pointer-events-auto hud-panel flex flex-wrap items-center gap-2 rounded-xl p-3">
      <button
        type="button"
        aria-label={paused ? "Продолжить" : "Пауза"}
        aria-pressed={paused}
        onClick={() => useSolar.getState().togglePaused()}
        className="press grid h-11 w-11 place-items-center rounded-sm bg-accent text-accent-fg"
      >
        <span className="grid place-items-center">
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </span>
      </button>
      <button
        type="button"
        aria-label="Медленнее"
        onClick={() => setSpeed(speed / 1.6)}
        className="press grid h-11 w-11 place-items-center rounded-sm border border-line text-fg hover:bg-subtle"
      >
        <Minus className="size-4" />
      </button>
      <label className="flex min-w-32 flex-1 items-center gap-3">
        <span className="sr-only">Скорость моделирования</span>
        <input
          className="speed-range"
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={speedToUnit(speed)}
          aria-valuetext={formatSpeed(speed)}
          onChange={(event) => setSpeed(unitToSpeed(Number(event.target.value)))}
        />
      </label>
      <button
        type="button"
        aria-label="Быстрее"
        onClick={() => setSpeed(speed * 1.6)}
        className="press grid h-11 w-11 place-items-center rounded-sm border border-line text-fg hover:bg-subtle"
      >
        <Plus className="size-4" />
      </button>
      <span className="w-12 text-right text-sm tabular-nums text-fg">{formatSpeed(speed)}</span>
      <button
        type="button"
        aria-pressed={showOrbits}
        onClick={() => useSolar.getState().toggleOrbits()}
        className={cn(
          "press h-11 rounded-sm border px-3 text-sm",
          showOrbits ? "border-line bg-subtle text-fg" : "border-transparent text-muted",
        )}
      >
        Орбиты
      </button>
      <button
        type="button"
        aria-pressed={showLabels}
        onClick={() => useSolar.getState().toggleLabels()}
        className={cn(
          "press h-11 rounded-sm border px-3 text-sm",
          showLabels ? "border-line bg-subtle text-fg" : "border-transparent text-muted",
        )}
      >
        Метки
      </button>
      <button
        type="button"
        onClick={() => useSolar.getState().focus(null)}
        className="press h-11 rounded-sm border border-line px-3 text-sm text-fg hover:bg-subtle"
      >
        Обзор
      </button>
    </div>
  );
}

export function OrreryHud() {
  const selected = useSolar((state) => state.selected);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        useSolar.getState().togglePaused();
        return;
      }
      if (event.code === "Escape") {
        useSolar.getState().focus(null);
        return;
      }
      if (event.code === "Digit0") {
        useSolar.getState().focus("sun");
        return;
      }
      if (event.code.startsWith("Digit")) {
        const index = Number(event.code.slice(5)) - 1;
        const planet = PLANETS[index];
        if (planet) useSolar.getState().focus(planet.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-3 md:p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="pointer-events-none max-w-md">
          <p className="hud-shadow text-xs tracking-wide text-muted">Солнечная система</p>
          <h1 className="hud-shadow font-display text-4xl leading-none text-fg md:text-5xl">Оррери</h1>
          <p className="hud-shadow mt-2 max-w-xs text-sm text-muted">
            {selected
              ? "Камера следует за телом. Тяните, чтобы осмотреть его."
              : "Нажмите планету — камера подлетит. Пробел ставит время на паузу."}
          </p>
        </div>
        <Clock />
      </header>

      <div className="mt-4 flex min-h-0 flex-1 gap-4">
        <nav
          aria-label="Тела системы"
          className="pointer-events-auto hidden w-52 shrink-0 flex-col gap-1 self-start rounded-xl hud-panel p-2 md:flex"
        >
          {BODIES.map((body) => (
            <BodyButton key={body.id} id={body.id} />
          ))}
        </nav>
        <div className="relative min-w-0 flex-1">
          {selected && (
            <div className="absolute inset-x-0 bottom-0 md:inset-x-auto md:top-0 md:right-0 md:bottom-auto md:max-h-full">
              <Panel />
            </div>
          )}
        </div>
      </div>

      <nav
        aria-label="Тела системы"
        className="pointer-events-auto mt-3 flex gap-2 overflow-x-auto md:hidden"
      >
        {BODIES.map((body) => (
          <BodyButton key={body.id} id={body.id} bordered />
        ))}
      </nav>

      <div className="mt-3">
        <Dock />
      </div>
    </div>
  );
}
