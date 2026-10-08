import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { OrreryHud } from "@/components/orrery-hud";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    import("@/components/solar-scene")
      .then(async (mod) => {
        const textures = await import("@/solar/textures");
        textures.getTextures();
        if (live) setScene(() => mod.SolarScene);
      })
      .catch((err: unknown) => {
        if (live) setError(err instanceof Error ? err.message : "Не удалось открыть модель");
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-void text-fg">
      <div className="absolute inset-0 z-0">
        {Scene ? <Scene /> : null}
      </div>
      <OrreryHud />
      {!Scene && !error && (
        <p className="pointer-events-none absolute bottom-28 left-4 z-10 text-sm text-muted">
          Собираем модель…
        </p>
      )}
      {error && (
        <p className="absolute bottom-28 left-4 z-10 max-w-sm text-sm text-fg">{error}</p>
      )}
    </main>
  );
}
