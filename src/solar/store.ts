import { create } from "zustand";

export const SECONDS_PER_DAY = 0.18;
export const MIN_SPEED = 0.25;
export const MAX_SPEED = 48;

export const simDays = { current: 0 };

type SolarState = {
  paused: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  selected: string | null;
  focusNonce: number;
  day: number;
  togglePaused: () => void;
  setSpeed: (speed: number) => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  focus: (id: string | null) => void;
  setDay: (day: number) => void;
};

function clampSpeed(speed: number) {
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed));
}

export const useSolar = create<SolarState>((set) => ({
  paused: false,
  speed: 5,
  showOrbits: true,
  showLabels: true,
  selected: null,
  focusNonce: 0,
  day: 0,
  togglePaused: () => set((state) => ({ paused: !state.paused })),
  setSpeed: (speed) => set({ speed: clampSpeed(speed) }),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  focus: (id) => set((state) => ({ selected: id, focusNonce: state.focusNonce + 1 })),
  setDay: (day) => set({ day }),
}));

export function unitToSpeed(unit: number) {
  const a = Math.log(MIN_SPEED);
  const b = Math.log(MAX_SPEED);
  return Math.exp(a + unit * (b - a));
}

export function speedToUnit(speed: number) {
  const a = Math.log(MIN_SPEED);
  const b = Math.log(MAX_SPEED);
  return (Math.log(clampSpeed(speed)) - a) / (b - a);
}

export function formatSpeed(speed: number) {
  if (speed >= 10) return `${Math.round(speed)}×`;
  return `${speed.toFixed(1)}×`;
}
