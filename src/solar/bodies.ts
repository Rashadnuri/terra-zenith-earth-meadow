export type MoonDef = {
  name: string;
  radius: number;
  orbit: number;
  period: number;
  phase: number;
  color: string;
};

export type RingDef = {
  inner: number;
  outer: number;
  gap: boolean;
  colorA: string;
  colorB: string;
};

export type BodyDef = {
  id: string;
  name: string;
  kind: string;
  blurb: string;
  swatch: string;
  facts: { label: string; value: string }[];
  radius: number;
  view: number;
  period?: number;
  phase?: number;
  orbit?: number;
  ecc?: number;
  inclination?: number;
  tilt?: number;
  spinDays?: number;
  texture?: TextureKey;
  air?: { color: string; strength: number; power: number };
  rings?: RingDef;
  moons?: MoonDef[];
};

export type TextureKey =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type PlanetDef = BodyDef & {
  period: number;
  phase: number;
  orbit: number;
  ecc: number;
  inclination: number;
  tilt: number;
  spinDays: number;
  texture: TextureKey;
};

export type Vec3 = { x: number; y: number; z: number };

const sun: BodyDef = {
  id: "sun",
  name: "Солнце",
  kind: "Жёлтый карлик G2V",
  blurb:
    "В нём сосредоточено почти всё вещество системы. Свет от фотосферы доходит до Земли за 8 минут 19 секунд.",
  swatch: "#f0d3a0",
  radius: 2.6,
  view: 8,
  facts: [
    { label: "Класс", value: "G2V" },
    { label: "Диаметр", value: "1,39 млн км" },
    { label: "Масса системы", value: "99,8%" },
    { label: "Свет до Земли", value: "8 мин 19 с" },
    { label: "Фотосфера", value: "~5 500 °C" },
    { label: "Возраст", value: "4,6 млрд лет" },
    { label: "Строение", value: "Плазменное ядро и оболочка" },
  ],
};

const planets: PlanetDef[] = [
  {
    id: "mercury",
    name: "Меркурий",
    kind: "Земная группа",
    blurb:
      "Ближайший к Солнцу мир почти без атмосферы. Днём поверхность выше 400 °C, ночью ниже −170 °C.",
    swatch: "#b7b1a6",
    facts: [
      { label: "Расстояние", value: "0,39 а.е." },
      { label: "Год", value: "88 сут" },
      { label: "Диаметр", value: "4 879 км" },
      { label: "Сутки", value: "59 земных сут" },
      { label: "Спутники", value: "нет" },
      { label: "Наклон оси", value: "0,03°" },
      { label: "Строение", value: "Железное ядро и кора" },
    ],
    radius: 0.92,
    view: 3.8,
    period: 87.97,
    phase: 0.5,
    orbit: 6.6,
    ecc: 0.206,
    inclination: 0.122,
    tilt: 0.01,
    spinDays: 58.65,
    texture: "mercury",
  },
  {
    id: "venus",
    name: "Венера",
    kind: "Земная группа",
    blurb:
      "Самая горячая планета: плотная углекислая атмосфера держит её горячее Меркурия. Вращается вспять.",
    swatch: "#e2c48a",
    facts: [
      { label: "Расстояние", value: "0,72 а.е." },
      { label: "Год", value: "225 сут" },
      { label: "Диаметр", value: "12 104 км" },
      { label: "Сутки", value: "243 сут, вспять" },
      { label: "Спутники", value: "нет" },
      { label: "Наклон оси", value: "177°" },
      { label: "Строение", value: "Камень, плотная CO₂-атмосфера" },
    ],
    radius: 1.15,
    view: 4.8,
    period: 224.7,
    phase: 2.1,
    orbit: 9,
    ecc: 0.007,
    inclination: 0.059,
    tilt: 0.09,
    spinDays: -243,
    texture: "venus",
    air: { color: "#f0d7a2", strength: 0.85, power: 1.55 },
  },
  {
    id: "earth",
    name: "Земля",
    kind: "Земная группа",
    blurb:
      "Единственный известный мир с жидкой водой и жизнью. Луна смягчает качание оси и удерживает климат.",
    swatch: "#7eb0e8",
    facts: [
      { label: "Расстояние", value: "1,00 а.е." },
      { label: "Год", value: "365,25 сут" },
      { label: "Диаметр", value: "12 742 км" },
      { label: "Сутки", value: "24 ч" },
      { label: "Спутники", value: "1" },
      { label: "Наклон оси", value: "23,4°" },
      { label: "Строение", value: "Ядро, мантия, кора, океан" },
    ],
    radius: 1.25,
    view: 6.4,
    period: 365.25,
    phase: 4.0,
    orbit: 11.8,
    ecc: 0.017,
    inclination: 0,
    tilt: 0.41,
    spinDays: 1,
    texture: "earth",
    air: { color: "#9ec4ff", strength: 0.62, power: 2.15 },
    moons: [
      { name: "Луна", radius: 0.32, orbit: 2.4, period: 27.32, phase: 1.2, color: "#c8c2b6" },
    ],
  },
  {
    id: "mars",
    name: "Марс",
    kind: "Земная группа",
    blurb:
      "Холодная пустыня с крупнейшими вулканом и каньоном системы. Тонкая атмосфера почти не держит тепло.",
    swatch: "#d07a52",
    facts: [
      { label: "Расстояние", value: "1,52 а.е." },
      { label: "Год", value: "687 сут" },
      { label: "Диаметр", value: "6 779 км" },
      { label: "Сутки", value: "24,6 ч" },
      { label: "Спутники", value: "2" },
      { label: "Наклон оси", value: "25,2°" },
      { label: "Строение", value: "Ядро, мантия, кора" },
    ],
    radius: 0.95,
    view: 4.2,
    period: 686.98,
    phase: 1.15,
    orbit: 14.6,
    ecc: 0.093,
    inclination: 0.032,
    tilt: 0.44,
    spinDays: 1.026,
    texture: "mars",
    air: { color: "#e7b1a4", strength: 0.32, power: 2.5 },
  },
  {
    id: "jupiter",
    name: "Юпитер",
    kind: "Газовый гигант",
    blurb:
      "Тяжелее всех остальных планет вместе. Большое Красное Пятно — шторм шире Земли, ему сотни лет.",
    swatch: "#d2b48c",
    facts: [
      { label: "Расстояние", value: "5,20 а.е." },
      { label: "Год", value: "11,9 лет" },
      { label: "Диаметр", value: "139 820 км" },
      { label: "Сутки", value: "9,9 ч" },
      { label: "Спутники", value: "95+" },
      { label: "Наклон оси", value: "3,1°" },
      { label: "Строение", value: "Газ, жидкий водород, ядро" },
    ],
    radius: 2.45,
    view: 11.5,
    period: 4332.6,
    phase: 5.4,
    orbit: 19.2,
    ecc: 0.049,
    inclination: 0.023,
    tilt: 0.055,
    spinDays: 0.414,
    texture: "jupiter",
    air: { color: "#efd2b4", strength: 0.38, power: 2.3 },
    moons: [
      { name: "Ио", radius: 0.16, orbit: 3.45, period: 1.77, phase: 0.4, color: "#e6d27a" },
      { name: "Европа", radius: 0.14, orbit: 4.05, period: 3.55, phase: 1.7, color: "#d9d3c8" },
      { name: "Ганимед", radius: 0.22, orbit: 4.7, period: 7.15, phase: 3.1, color: "#b7a48e" },
      { name: "Каллисто", radius: 0.2, orbit: 5.4, period: 16.69, phase: 5.2, color: "#8d8274" },
    ],
  },
  {
    id: "saturn",
    name: "Сатурн",
    kind: "Газовый гигант",
    blurb:
      "Кольца из льда и пыли тонкие, но растянуты на сотни тысяч километров. Сам Сатурн легче воды.",
    swatch: "#e6d3a8",
    facts: [
      { label: "Расстояние", value: "9,58 а.е." },
      { label: "Год", value: "29,5 лет" },
      { label: "Диаметр", value: "116 460 км" },
      { label: "Сутки", value: "10,7 ч" },
      { label: "Спутники", value: "140+" },
      { label: "Наклон оси", value: "26,7°" },
      { label: "Строение", value: "Газ, кольца из льда и пыли" },
    ],
    radius: 2.05,
    view: 11,
    period: 10759,
    phase: 0.85,
    orbit: 26.4,
    ecc: 0.056,
    inclination: 0.044,
    tilt: 0.466,
    spinDays: 0.444,
    texture: "saturn",
    air: { color: "#f0e2c4", strength: 0.34, power: 2.4 },
    rings: {
      inner: 2.75,
      outer: 3.85,
      gap: true,
      colorA: "#c4b496",
      colorB: "#f2ead8",
    },
    moons: [
      { name: "Титан", radius: 0.22, orbit: 4.75, period: 15.95, phase: 2.2, color: "#e0b56a" },
    ],
  },
  {
    id: "uranus",
    name: "Уран",
    kind: "Ледяной гигант",
    blurb:
      "Лежит почти на боку: ось наклонена на 98°. Сезоны длятся по два десятилетия, кольца смотрят ребром.",
    swatch: "#b7efe6",
    facts: [
      { label: "Расстояние", value: "19,2 а.е." },
      { label: "Год", value: "84 года" },
      { label: "Диаметр", value: "50 724 км" },
      { label: "Сутки", value: "17,2 ч" },
      { label: "Спутники", value: "28" },
      { label: "Наклон оси", value: "97,8°" },
      { label: "Строение", value: "Ледяная мантия и водород" },
    ],
    radius: 1.45,
    view: 6.4,
    period: 30687,
    phase: 3.3,
    orbit: 32.2,
    ecc: 0.047,
    inclination: 0.014,
    tilt: 1.708,
    spinDays: -0.718,
    texture: "uranus",
    air: { color: "#c8fff4", strength: 0.4, power: 2.2 },
    rings: {
      inner: 2.0,
      outer: 2.55,
      gap: false,
      colorA: "#9fd9d2",
      colorB: "#e7fffb",
    },
  },
  {
    id: "neptune",
    name: "Нептун",
    kind: "Ледяной гигант",
    blurb:
      "Самый далёкий гигант. Ветры здесь быстрее, чем где-либо ещё в системе — больше 2 000 км/ч.",
    swatch: "#5d86e6",
    facts: [
      { label: "Расстояние", value: "30,1 а.е." },
      { label: "Год", value: "165 лет" },
      { label: "Диаметр", value: "49 244 км" },
      { label: "Сутки", value: "16,1 ч" },
      { label: "Спутники", value: "16" },
      { label: "Наклон оси", value: "28,3°" },
      { label: "Строение", value: "Ледяная мантия и плотное ядро" },
    ],
    radius: 1.4,
    view: 6.2,
    period: 60190,
    phase: 2.55,
    orbit: 36.6,
    ecc: 0.009,
    inclination: 0.031,
    tilt: 0.494,
    spinDays: 0.671,
    texture: "neptune",
    air: { color: "#8eb6ff", strength: 0.48, power: 2.15 },
    moons: [
      { name: "Тритон", radius: 0.2, orbit: 2.3, period: 5.88, phase: 0.7, color: "#c5cdd6" },
    ],
  },
];

export const BODIES: BodyDef[] = [sun, ...planets];
export const PLANETS: PlanetDef[] = planets;
export const FIT_RADIUS = 40;

export function isPlanet(body: BodyDef): body is PlanetDef {
  return body.period != null && body.orbit != null;
}

const byId = new Map(BODIES.map((body) => [body.id, body]));

export function getBody(id: string): BodyDef | undefined {
  return byId.get(id);
}

export function writeOrbit(planet: PlanetDef, theta: number, out: Vec3) {
  const e = planet.ecc;
  const r = (planet.orbit * (1 - e * e)) / (1 + e * Math.cos(theta));
  const x = Math.cos(theta) * r;
  const zFlat = Math.sin(theta) * r;
  const inc = planet.inclination;
  out.x = x;
  out.y = zFlat * Math.sin(inc);
  out.z = zFlat * Math.cos(inc);
}

export function thetaOf(planet: PlanetDef, day: number) {
  return (day / planet.period) * Math.PI * 2 + planet.phase;
}

export function orbitFraction(period: number, phase: number, day: number) {
  const turns = day / period + phase / (Math.PI * 2);
  return ((turns % 1) + 1) % 1;
}
