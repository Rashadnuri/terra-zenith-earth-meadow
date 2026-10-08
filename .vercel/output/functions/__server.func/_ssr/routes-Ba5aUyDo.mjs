import { i as __toESM } from "../_runtime.mjs";
import { T as require_react, w as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as Pause, i as Play, o as Minus, r as Plus, t as X } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ba5aUyDo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var sun = {
	id: "sun",
	name: "Солнце",
	kind: "Жёлтый карлик G2V",
	blurb: "В нём сосредоточено почти всё вещество системы. Свет от фотосферы доходит до Земли за 8 минут 19 секунд.",
	swatch: "#f0d3a0",
	radius: 2.6,
	view: 8,
	facts: [
		{
			label: "Класс",
			value: "G2V"
		},
		{
			label: "Диаметр",
			value: "1,39 млн км"
		},
		{
			label: "Масса системы",
			value: "99,8%"
		},
		{
			label: "Свет до Земли",
			value: "8 мин 19 с"
		},
		{
			label: "Фотосфера",
			value: "~5 500 °C"
		},
		{
			label: "Возраст",
			value: "4,6 млрд лет"
		},
		{
			label: "Строение",
			value: "Плазменное ядро и оболочка"
		}
	]
};
var planets = [
	{
		id: "mercury",
		name: "Меркурий",
		kind: "Земная группа",
		blurb: "Ближайший к Солнцу мир почти без атмосферы. Днём поверхность выше 400 °C, ночью ниже −170 °C.",
		swatch: "#b7b1a6",
		facts: [
			{
				label: "Расстояние",
				value: "0,39 а.е."
			},
			{
				label: "Год",
				value: "88 сут"
			},
			{
				label: "Диаметр",
				value: "4 879 км"
			},
			{
				label: "Сутки",
				value: "59 земных сут"
			},
			{
				label: "Спутники",
				value: "нет"
			},
			{
				label: "Наклон оси",
				value: "0,03°"
			},
			{
				label: "Строение",
				value: "Железное ядро и кора"
			}
		],
		radius: .92,
		view: 3.8,
		period: 87.97,
		phase: .5,
		orbit: 6.6,
		ecc: .206,
		inclination: .122,
		tilt: .01,
		spinDays: 58.65,
		texture: "mercury"
	},
	{
		id: "venus",
		name: "Венера",
		kind: "Земная группа",
		blurb: "Самая горячая планета: плотная углекислая атмосфера держит её горячее Меркурия. Вращается вспять.",
		swatch: "#e2c48a",
		facts: [
			{
				label: "Расстояние",
				value: "0,72 а.е."
			},
			{
				label: "Год",
				value: "225 сут"
			},
			{
				label: "Диаметр",
				value: "12 104 км"
			},
			{
				label: "Сутки",
				value: "243 сут, вспять"
			},
			{
				label: "Спутники",
				value: "нет"
			},
			{
				label: "Наклон оси",
				value: "177°"
			},
			{
				label: "Строение",
				value: "Камень, плотная CO₂-атмосфера"
			}
		],
		radius: 1.15,
		view: 4.8,
		period: 224.7,
		phase: 2.1,
		orbit: 9,
		ecc: .007,
		inclination: .059,
		tilt: .09,
		spinDays: -243,
		texture: "venus",
		air: {
			color: "#f0d7a2",
			strength: .85,
			power: 1.55
		}
	},
	{
		id: "earth",
		name: "Земля",
		kind: "Земная группа",
		blurb: "Единственный известный мир с жидкой водой и жизнью. Луна смягчает качание оси и удерживает климат.",
		swatch: "#7eb0e8",
		facts: [
			{
				label: "Расстояние",
				value: "1,00 а.е."
			},
			{
				label: "Год",
				value: "365,25 сут"
			},
			{
				label: "Диаметр",
				value: "12 742 км"
			},
			{
				label: "Сутки",
				value: "24 ч"
			},
			{
				label: "Спутники",
				value: "1"
			},
			{
				label: "Наклон оси",
				value: "23,4°"
			},
			{
				label: "Строение",
				value: "Ядро, мантия, кора, океан"
			}
		],
		radius: 1.25,
		view: 6.4,
		period: 365.25,
		phase: 4,
		orbit: 11.8,
		ecc: .017,
		inclination: 0,
		tilt: .41,
		spinDays: 1,
		texture: "earth",
		air: {
			color: "#9ec4ff",
			strength: .62,
			power: 2.15
		},
		moons: [{
			name: "Луна",
			radius: .32,
			orbit: 2.4,
			period: 27.32,
			phase: 1.2,
			color: "#c8c2b6"
		}]
	},
	{
		id: "mars",
		name: "Марс",
		kind: "Земная группа",
		blurb: "Холодная пустыня с крупнейшими вулканом и каньоном системы. Тонкая атмосфера почти не держит тепло.",
		swatch: "#d07a52",
		facts: [
			{
				label: "Расстояние",
				value: "1,52 а.е."
			},
			{
				label: "Год",
				value: "687 сут"
			},
			{
				label: "Диаметр",
				value: "6 779 км"
			},
			{
				label: "Сутки",
				value: "24,6 ч"
			},
			{
				label: "Спутники",
				value: "2"
			},
			{
				label: "Наклон оси",
				value: "25,2°"
			},
			{
				label: "Строение",
				value: "Ядро, мантия, кора"
			}
		],
		radius: .95,
		view: 4.2,
		period: 686.98,
		phase: 1.15,
		orbit: 14.6,
		ecc: .093,
		inclination: .032,
		tilt: .44,
		spinDays: 1.026,
		texture: "mars",
		air: {
			color: "#e7b1a4",
			strength: .32,
			power: 2.5
		}
	},
	{
		id: "jupiter",
		name: "Юпитер",
		kind: "Газовый гигант",
		blurb: "Тяжелее всех остальных планет вместе. Большое Красное Пятно — шторм шире Земли, ему сотни лет.",
		swatch: "#d2b48c",
		facts: [
			{
				label: "Расстояние",
				value: "5,20 а.е."
			},
			{
				label: "Год",
				value: "11,9 лет"
			},
			{
				label: "Диаметр",
				value: "139 820 км"
			},
			{
				label: "Сутки",
				value: "9,9 ч"
			},
			{
				label: "Спутники",
				value: "95+"
			},
			{
				label: "Наклон оси",
				value: "3,1°"
			},
			{
				label: "Строение",
				value: "Газ, жидкий водород, ядро"
			}
		],
		radius: 2.45,
		view: 11.5,
		period: 4332.6,
		phase: 5.4,
		orbit: 19.2,
		ecc: .049,
		inclination: .023,
		tilt: .055,
		spinDays: .414,
		texture: "jupiter",
		air: {
			color: "#efd2b4",
			strength: .38,
			power: 2.3
		},
		moons: [
			{
				name: "Ио",
				radius: .16,
				orbit: 3.45,
				period: 1.77,
				phase: .4,
				color: "#e6d27a"
			},
			{
				name: "Европа",
				radius: .14,
				orbit: 4.05,
				period: 3.55,
				phase: 1.7,
				color: "#d9d3c8"
			},
			{
				name: "Ганимед",
				radius: .22,
				orbit: 4.7,
				period: 7.15,
				phase: 3.1,
				color: "#b7a48e"
			},
			{
				name: "Каллисто",
				radius: .2,
				orbit: 5.4,
				period: 16.69,
				phase: 5.2,
				color: "#8d8274"
			}
		]
	},
	{
		id: "saturn",
		name: "Сатурн",
		kind: "Газовый гигант",
		blurb: "Кольца из льда и пыли тонкие, но растянуты на сотни тысяч километров. Сам Сатурн легче воды.",
		swatch: "#e6d3a8",
		facts: [
			{
				label: "Расстояние",
				value: "9,58 а.е."
			},
			{
				label: "Год",
				value: "29,5 лет"
			},
			{
				label: "Диаметр",
				value: "116 460 км"
			},
			{
				label: "Сутки",
				value: "10,7 ч"
			},
			{
				label: "Спутники",
				value: "140+"
			},
			{
				label: "Наклон оси",
				value: "26,7°"
			},
			{
				label: "Строение",
				value: "Газ, кольца из льда и пыли"
			}
		],
		radius: 2.05,
		view: 11,
		period: 10759,
		phase: .85,
		orbit: 26.4,
		ecc: .056,
		inclination: .044,
		tilt: .466,
		spinDays: .444,
		texture: "saturn",
		air: {
			color: "#f0e2c4",
			strength: .34,
			power: 2.4
		},
		rings: {
			inner: 2.75,
			outer: 3.85,
			gap: true,
			colorA: "#c4b496",
			colorB: "#f2ead8"
		},
		moons: [{
			name: "Титан",
			radius: .22,
			orbit: 4.75,
			period: 15.95,
			phase: 2.2,
			color: "#e0b56a"
		}]
	},
	{
		id: "uranus",
		name: "Уран",
		kind: "Ледяной гигант",
		blurb: "Лежит почти на боку: ось наклонена на 98°. Сезоны длятся по два десятилетия, кольца смотрят ребром.",
		swatch: "#b7efe6",
		facts: [
			{
				label: "Расстояние",
				value: "19,2 а.е."
			},
			{
				label: "Год",
				value: "84 года"
			},
			{
				label: "Диаметр",
				value: "50 724 км"
			},
			{
				label: "Сутки",
				value: "17,2 ч"
			},
			{
				label: "Спутники",
				value: "28"
			},
			{
				label: "Наклон оси",
				value: "97,8°"
			},
			{
				label: "Строение",
				value: "Ледяная мантия и водород"
			}
		],
		radius: 1.45,
		view: 6.4,
		period: 30687,
		phase: 3.3,
		orbit: 32.2,
		ecc: .047,
		inclination: .014,
		tilt: 1.708,
		spinDays: -.718,
		texture: "uranus",
		air: {
			color: "#c8fff4",
			strength: .4,
			power: 2.2
		},
		rings: {
			inner: 2,
			outer: 2.55,
			gap: false,
			colorA: "#9fd9d2",
			colorB: "#e7fffb"
		}
	},
	{
		id: "neptune",
		name: "Нептун",
		kind: "Ледяной гигант",
		blurb: "Самый далёкий гигант. Ветры здесь быстрее, чем где-либо ещё в системе — больше 2 000 км/ч.",
		swatch: "#5d86e6",
		facts: [
			{
				label: "Расстояние",
				value: "30,1 а.е."
			},
			{
				label: "Год",
				value: "165 лет"
			},
			{
				label: "Диаметр",
				value: "49 244 км"
			},
			{
				label: "Сутки",
				value: "16,1 ч"
			},
			{
				label: "Спутники",
				value: "16"
			},
			{
				label: "Наклон оси",
				value: "28,3°"
			},
			{
				label: "Строение",
				value: "Ледяная мантия и плотное ядро"
			}
		],
		radius: 1.4,
		view: 6.2,
		period: 60190,
		phase: 2.55,
		orbit: 36.6,
		ecc: .009,
		inclination: .031,
		tilt: .494,
		spinDays: .671,
		texture: "neptune",
		air: {
			color: "#8eb6ff",
			strength: .48,
			power: 2.15
		},
		moons: [{
			name: "Тритон",
			radius: .2,
			orbit: 2.3,
			period: 5.88,
			phase: .7,
			color: "#c5cdd6"
		}]
	}
];
var BODIES = [sun, ...planets];
var PLANETS = planets;
function isPlanet(body) {
	return body.period != null && body.orbit != null;
}
var byId = new Map(BODIES.map((body) => [body.id, body]));
function getBody(id) {
	return byId.get(id);
}
function writeOrbit(planet, theta, out) {
	const e = planet.ecc;
	const r = planet.orbit * (1 - e * e) / (1 + e * Math.cos(theta));
	const x = Math.cos(theta) * r;
	const zFlat = Math.sin(theta) * r;
	const inc = planet.inclination;
	out.x = x;
	out.y = zFlat * Math.sin(inc);
	out.z = zFlat * Math.cos(inc);
}
function thetaOf(planet, day) {
	return day / planet.period * Math.PI * 2 + planet.phase;
}
function orbitFraction(period, phase, day) {
	return ((day / period + phase / (Math.PI * 2)) % 1 + 1) % 1;
}
var SECONDS_PER_DAY = .18;
var MIN_SPEED = .25;
var simDays = { current: 0 };
function clampSpeed(speed) {
	return Math.min(48, Math.max(MIN_SPEED, speed));
}
var useSolar = create((set) => ({
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
	focus: (id) => set((state) => ({
		selected: id,
		focusNonce: state.focusNonce + 1
	})),
	setDay: (day) => set({ day })
}));
function unitToSpeed(unit) {
	const a = Math.log(MIN_SPEED);
	return Math.exp(a + unit * (Math.log(48) - a));
}
function speedToUnit(speed) {
	const a = Math.log(MIN_SPEED);
	const b = Math.log(48);
	return (Math.log(clampSpeed(speed)) - a) / (b - a);
}
function formatSpeed(speed) {
	if (speed >= 10) return `${Math.round(speed)}×`;
	return `${speed.toFixed(1)}×`;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatClock(day) {
	const whole = Math.max(0, Math.floor(day));
	const years = day / 365.256;
	return {
		days: whole.toLocaleString("ru-RU"),
		years: years.toLocaleString("ru-RU", {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		})
	};
}
function BodyButton({ id, bordered }) {
	const selected = useSolar((state) => state.selected === id);
	const body = getBody(id);
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": selected ? "true" : void 0,
		onClick: () => useSolar.getState().focus(id),
		className: cn("press flex h-11 shrink-0 items-center gap-2 rounded-sm px-3 text-left text-sm", bordered && "border border-line", selected ? "bg-subtle text-fg" : "text-muted hover:bg-subtle/70 hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-2 shrink-0 rounded-full",
			style: { backgroundColor: body.swatch },
			"aria-hidden": true
		}), body.name]
	});
}
function Clock() {
	const day = useSolar((state) => state.day);
	const paused = useSolar((state) => state.paused);
	const clock = formatClock(day);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto hud-panel rounded-lg px-3 py-2 text-right",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-sans text-sm tabular-nums text-fg",
			children: [clock.days, " сут"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs tabular-nums text-muted",
			children: [
				clock.years,
				" земных лет",
				paused ? " · пауза" : ""
			]
		})]
	});
}
function SurfacePortrait({ texture, swatch }) {
	const [src, setSrc] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!texture) {
			setSrc(null);
			return;
		}
		let live = true;
		import("./textures-vM2pNguO.mjs").then((mod) => {
			if (!live) return;
			const url = mod.getSurfacePreview(texture);
			if (url) setSrc(url);
		});
		return () => {
			live = false;
		};
	}, [texture]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "size-16 shrink-0 overflow-hidden rounded-full border border-line",
		style: { backgroundColor: swatch },
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			className: "size-full object-cover"
		}) : null
	});
}
function Panel() {
	const id = useSolar((state) => state.selected);
	const day = useSolar((state) => state.day);
	const body = id ? getBody(id) : void 0;
	if (!body) return null;
	const fraction = isPlanet(body) ? orbitFraction(body.period, body.phase, day) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "panel-in panel-scroll pointer-events-auto hud-panel w-full overflow-y-auto rounded-xl p-4 md:w-80",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurfacePortrait, {
						texture: body.texture,
						swatch: body.swatch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: body.kind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl leading-none text-fg",
							children: body.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Вернуться к обзору",
						onClick: () => useSolar.getState().focus(null),
						className: "press grid h-11 w-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-subtle hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: body.blurb
			}),
			fraction != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex justify-between text-xs text-faint",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Положение на орбите" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-muted",
						children: [Math.round(fraction * 100), "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 overflow-hidden rounded-full bg-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent",
						style: { width: `${fraction * 100}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-3",
				children: body.facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs text-faint",
					children: fact.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-sm text-fg",
					children: fact.value
				})] }, fact.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-faint",
				children: "Размеры и расстояния на сцене сближены, чтобы планеты было видно. Периоды — настоящие."
			})
		]
	}, body.id);
}
function Dock() {
	const paused = useSolar((state) => state.paused);
	const speed = useSolar((state) => state.speed);
	const showOrbits = useSolar((state) => state.showOrbits);
	const showLabels = useSolar((state) => state.showLabels);
	const setSpeed = useSolar((state) => state.setSpeed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto hud-panel flex flex-wrap items-center gap-2 rounded-xl p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": paused ? "Продолжить" : "Пауза",
				"aria-pressed": paused,
				onClick: () => useSolar.getState().togglePaused(),
				className: "press grid h-11 w-11 place-items-center rounded-sm bg-accent text-accent-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid place-items-center",
					children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Медленнее",
				onClick: () => setSpeed(speed / 1.6),
				className: "press grid h-11 w-11 place-items-center rounded-sm border border-line text-fg hover:bg-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-w-32 flex-1 items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Скорость моделирования"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "speed-range",
					type: "range",
					min: 0,
					max: 1,
					step: .001,
					value: speedToUnit(speed),
					"aria-valuetext": formatSpeed(speed),
					onChange: (event) => setSpeed(unitToSpeed(Number(event.target.value)))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Быстрее",
				onClick: () => setSpeed(speed * 1.6),
				className: "press grid h-11 w-11 place-items-center rounded-sm border border-line text-fg hover:bg-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-12 text-right text-sm tabular-nums text-fg",
				children: formatSpeed(speed)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": showOrbits,
				onClick: () => useSolar.getState().toggleOrbits(),
				className: cn("press h-11 rounded-sm border px-3 text-sm", showOrbits ? "border-line bg-subtle text-fg" : "border-transparent text-muted"),
				children: "Орбиты"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": showLabels,
				onClick: () => useSolar.getState().toggleLabels(),
				className: cn("press h-11 rounded-sm border px-3 text-sm", showLabels ? "border-line bg-subtle text-fg" : "border-transparent text-muted"),
				children: "Метки"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => useSolar.getState().focus(null),
				className: "press h-11 rounded-sm border border-line px-3 text-sm text-fg hover:bg-subtle",
				children: "Обзор"
			})
		]
	});
}
function OrreryHud() {
	const selected = useSolar((state) => state.selected);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
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
				const planet = PLANETS[Number(event.code.slice(5)) - 1];
				if (planet) useSolar.getState().focus(planet.id);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex flex-col p-3 md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hud-shadow text-xs tracking-wide text-muted",
							children: "Солнечная система"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "hud-shadow font-display text-4xl leading-none text-fg md:text-5xl",
							children: "Оррери"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hud-shadow mt-2 max-w-xs text-sm text-muted",
							children: selected ? "Камера следует за телом. Тяните, чтобы осмотреть его." : "Нажмите планету — камера подлетит. Пробел ставит время на паузу."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex min-h-0 flex-1 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Тела системы",
					className: "pointer-events-auto hidden w-52 shrink-0 flex-col gap-1 self-start rounded-xl hud-panel p-2 md:flex",
					children: BODIES.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyButton, { id: body.id }, body.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative min-w-0 flex-1",
					children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 bottom-0 md:inset-x-auto md:top-0 md:right-0 md:bottom-auto md:max-h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Тела системы",
				className: "pointer-events-auto mt-3 flex gap-2 overflow-x-auto md:hidden",
				children: BODIES.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyButton, {
					id: body.id,
					bordered: true
				}, body.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dock, {})
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	const [Scene, setScene] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		import("./solar-scene-CYxHgje0.mjs").then(async (mod) => {
			(await import("./textures-vM2pNguO.mjs")).getTextures();
			if (live) setScene(() => mod.SolarScene);
		}).catch((err) => {
			if (live) setError(err instanceof Error ? err.message : "Не удалось открыть модель");
		});
		return () => {
			live = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh overflow-hidden bg-void text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-0",
				children: Scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrreryHud, {}),
			!Scene && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-28 left-4 z-10 text-sm text-muted",
				children: "Собираем модель…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-28 left-4 z-10 max-w-sm text-sm text-fg",
				children: error
			})
		]
	});
}
//#endregion
export { PLANETS as a, useSolar as i, SECONDS_PER_DAY as n, thetaOf as o, simDays as r, writeOrbit as s, routes_exports as t };
