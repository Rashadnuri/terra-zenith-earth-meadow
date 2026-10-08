import { i as __toESM } from "../_runtime.mjs";
import { T as require_react, _ as PerspectiveCamera, a as BufferGeometry, b as SphereGeometry, c as Color, d as InstancedMesh, f as Line, g as Object3D, h as MeshBasicMaterial, i as BufferAttribute, l as ColorManagement, m as LinearSRGBColorSpace, n as Canvas, o as CanvasTexture, p as LineBasicMaterial, r as useFrame, t as OrbitControls, u as IcosahedronGeometry, w as require_jsx_runtime, x as Vector3, y as ShaderMaterial } from "../_libs/@react-three/drei+[...].mjs";
import { a as PLANETS, i as useSolar, n as SECONDS_PER_DAY, o as thetaOf, r as simDays, s as writeOrbit } from "./routes-Ba5aUyDo.mjs";
import { getTextures } from "./textures-vM2pNguO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solar-scene-CYxHgje0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hash3(ix, iy, iz) {
	const n = Math.sin(ix * 127.1 + iy * 311.7 + iz * 74.7) * 43758.5453;
	return n - Math.floor(n);
}
function noise3(x, y, z) {
	const x0 = Math.floor(x);
	const y0 = Math.floor(y);
	const z0 = Math.floor(z);
	const xf = x - x0;
	const yf = y - y0;
	const zf = z - z0;
	const u = xf * xf * (3 - 2 * xf);
	const v = yf * yf * (3 - 2 * yf);
	const w = zf * zf * (3 - 2 * zf);
	const lerp = (a, b, t) => a + (b - a) * t;
	const n = (ix, iy, iz) => hash3(x0 + ix, y0 + iy, z0 + iz);
	const x00 = lerp(n(0, 0, 0), n(1, 0, 0), u);
	const x10 = lerp(n(0, 1, 0), n(1, 1, 0), u);
	const x01 = lerp(n(0, 0, 1), n(1, 0, 1), u);
	const x11 = lerp(n(0, 1, 1), n(1, 1, 1), u);
	return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}
function fbm3(x, y, z) {
	let value = 0;
	let amplitude = .5;
	let frequency = 1;
	for (let i = 0; i < 4; i++) {
		value += amplitude * noise3(x * frequency, y * frequency, z * frequency);
		frequency *= 2.03;
		amplitude *= .5;
	}
	return value;
}
var ROCKY = {
	mercury: {
		amp: .1,
		freq: 3.1,
		seed: 1.4,
		crater: .14
	},
	venus: {
		amp: .018,
		freq: 2.1,
		seed: 4.2,
		crater: 0
	},
	earth: {
		amp: .045,
		freq: 2.5,
		seed: 2.4,
		crater: 0
	},
	mars: {
		amp: .085,
		freq: 2.7,
		seed: 6.6,
		crater: .07
	}
};
var FLATTEN = {
	jupiter: .935,
	saturn: .89,
	uranus: .98,
	neptune: .977
};
function displace(geo, radius, amp, freq, seed, crater, flatten) {
	const pos = geo.attributes.position;
	const vertex = new Vector3();
	const normal = new Vector3();
	for (let i = 0; i < pos.count; i++) {
		vertex.fromBufferAttribute(pos, i);
		normal.copy(vertex).normalize();
		let bump = 0;
		if (amp > 0) {
			bump = (fbm3(normal.x * freq + seed, normal.y * freq, normal.z * freq + seed) - .46) * amp;
			if (crater > 0) {
				const c = noise3(normal.x * 6.5 + seed, normal.y * 6.5, normal.z * 6.5);
				if (c > .7) bump -= crater * ((c - .7) / .3);
			}
		}
		const r = radius * (1 + bump);
		pos.setXYZ(i, normal.x * r, normal.y * r * flatten, normal.z * r);
	}
	geo.computeVertexNormals();
	return geo;
}
function planetGeometry(planet) {
	const rocky = ROCKY[planet.id];
	const segments = planet.radius > 1.6 ? 96 : 72;
	return displace(new SphereGeometry(planet.radius, segments, Math.round(segments * .72)), planet.radius, rocky?.amp ?? 0, rocky?.freq ?? 1, rocky?.seed ?? 0, rocky?.crater ?? 0, FLATTEN[planet.id] ?? 1);
}
function moonGeometry(radius, seed) {
	return displace(new SphereGeometry(radius, 36, 28), radius, .16, 3.4, seed, .1, 1);
}
function isRocky(id) {
	return id in ROCKY;
}
ColorManagement.enabled = false;
var TRAIL = 84;
var ARC = 1.05;
var worldPos = new Float32Array(PLANETS.length * 3);
var PLANET_INDEX = {};
var scratch = {
	x: 0,
	y: 0,
	z: 0
};
var HOME_DIR = new Vector3(.34, .76, .58).normalize();
var dummy = new Object3D();
PLANETS.forEach((planet, index) => {
	PLANET_INDEX[planet.id] = index;
	writeOrbit(planet, thetaOf(planet, 0), scratch);
	worldPos[index * 3] = scratch.x;
	worldPos[index * 3 + 1] = scratch.y;
	worldPos[index * 3 + 2] = scratch.z;
});
var litVert = `
varying vec3 vNormal;
varying vec3 vWorld;
varying vec2 vUv;
varying float vRelief;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vUv = uv;
  vRelief = length(position);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
var surfaceFrag = `
uniform sampler2D uMap;
uniform float uCities;
uniform float uRadius;
uniform float uRelief;
uniform vec3 uRim;
varying vec3 vNormal;
varying vec3 vWorld;
varying vec2 vUv;
varying float vRelief;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(-vWorld);
  vec3 V = normalize(cameraPosition - vWorld);
  float ndl = dot(N, L);
  float day = smoothstep(-0.18, 0.32, ndl);
  vec3 albedo = texture2D(uMap, vUv).rgb;
  vec3 col = albedo * mix(0.58, 1.0, day);
  float water = smoothstep(0.08, 0.32, albedo.b - albedo.r);
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 42.0) * water * day;
  col += spec * 0.55;
  if (uCities > 0.5) {
    float nite = 1.0 - smoothstep(0.0, 0.22, ndl);
    float land = smoothstep(0.02, 0.16, albedo.g - albedo.b);
    float h = hash(floor(vUv * vec2(240.0, 120.0)));
    col += vec3(1.0, 0.84, 0.58) * smoothstep(0.84, 0.98, h) * land * nite * 0.85;
  }
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.2);
  col += uRim * rim * 0.42;
  if (uRelief > 0.5) {
    float h = vRelief / max(uRadius, 0.001);
    col *= mix(0.7, 1.18, smoothstep(0.93, 1.07, h));
  }
  gl_FragColor = vec4(col, 1.0);
}
`;
var cloudFrag = `
uniform sampler2D uMap;
varying vec3 vNormal;
varying vec3 vWorld;
varying vec2 vUv;
void main() {
  float a = texture2D(uMap, vUv).a;
  if (a < 0.04) discard;
  vec3 N = normalize(vNormal);
  float day = smoothstep(-0.08, 0.4, dot(N, normalize(-vWorld)));
  gl_FragColor = vec4(vec3(0.96), a * mix(0.05, 0.9, day));
}
`;
var airVert = `
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
var airFrag = `
uniform vec3 uColor;
uniform float uPower;
uniform float uStrength;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - abs(dot(N, V)), uPower);
  gl_FragColor = vec4(uColor, fres * uStrength);
}
`;
var solidFrag = `
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec3 N = normalize(vNormal);
  float day = smoothstep(-0.08, 0.45, dot(N, normalize(-vWorld)));
  gl_FragColor = vec4(uColor * mix(0.55, 1.0, day), 1.0);
}
`;
var ringVert = `
varying float vR;
void main() {
  vR = length(position.xy);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
var ringFrag = `
uniform float uInner;
uniform float uOuter;
uniform float uGap;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vR;
void main() {
  float t = clamp((vR - uInner) / (uOuter - uInner), 0.0, 1.0);
  float bands = 0.58 + 0.42 * sin(t * 54.0);
  float gap = uGap > 0.5 ? smoothstep(0.0, 0.015, abs(t - 0.58) - 0.02) : 1.0;
  float edge = smoothstep(0.0, 0.04, t) * smoothstep(1.0, 0.88, t);
  gl_FragColor = vec4(mix(uColorA, uColorB, t), bands * gap * edge * 0.88);
}
`;
var trailVert = `
attribute float aAge;
varying float vAge;
void main() {
  vAge = aAge;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
var trailFrag = `
uniform vec3 uColor;
varying float vAge;
void main() {
  float a = (1.0 - vAge) * (1.0 - vAge) * 0.9;
  gl_FragColor = vec4(uColor, a);
}
`;
var sunVert = `
varying vec3 vNormal;
varying vec3 vWorld;
varying vec3 vLocal;
void main() {
  vLocal = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
var sunFrag = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorld;
varying vec3 vLocal;
void main() {
  vec3 n = normalize(vLocal);
  float g = sin(n.x * 18.0 + uTime * 0.55) * sin(n.y * 15.0 - uTime * 0.4) * sin(n.z * 13.0 + uTime * 0.3);
  float gran = g * 0.5 + 0.5;
  vec3 col = mix(vec3(1.0, 0.62, 0.22), vec3(1.0, 0.95, 0.82), gran);
  float mu = pow(max(dot(normalize(vNormal), normalize(cameraPosition - vWorld)), 0.0), 0.42);
  col *= mix(0.55, 1.0, mu);
  gl_FragColor = vec4(col, 1.0);
}
`;
var skyVert = `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
var skyFrag = `
varying vec3 vDir;
void main() {
  vec3 dir = normalize(vDir);
  float band = exp(-pow((dir.y * 0.82 + dir.x * 0.2) * 6.5, 2.0));
  vec3 col = mix(vec3(0.028, 0.032, 0.05), vec3(0.012, 0.014, 0.02), dir.y * 0.5 + 0.5);
  col += vec3(0.11, 0.12, 0.15) * band * 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`;
function asControls(value) {
	if (!value || typeof value !== "object") return null;
	const candidate = value;
	if (!candidate.target || typeof candidate.enabled !== "boolean") return null;
	return candidate;
}
function ease(t) {
	return 1 - (1 - t) ** 3;
}
function fitDistance(fovDeg, aspect) {
	const tanV = Math.tan(fovDeg * Math.PI / 360);
	const tanH = tanV * Math.max(aspect, .35);
	return 40 * 1.06 / Math.min(tanV, tanH);
}
function writeGoal(id, target, cam, fov, aspect) {
	if (!id) {
		target.set(0, -1.6, 0);
		cam.copy(HOME_DIR).multiplyScalar(fitDistance(fov, aspect));
		return;
	}
	if (id === "sun") {
		target.set(0, -.45, 0);
		cam.set(5.8, 3.5, 7);
		return;
	}
	const index = PLANET_INDEX[id];
	const planet = PLANETS[index];
	const px = worldPos[index * 3];
	const py = worldPos[index * 3 + 1];
	const pz = worldPos[index * 3 + 2];
	target.set(px, py - planet.view * .14, pz);
	const len = Math.hypot(px, py, pz) || 1;
	const rx = px / len;
	const rz = pz / len;
	const view = planet.view;
	const flank = view * .2;
	cam.set(px - rx * view * .9 - rz * flank, py + view * .28, pz - rz * view * .9 + rx * flank);
}
function pick(id) {
	return {
		onClick: (event) => {
			event.stopPropagation();
			useSolar.getState().focus(id);
		},
		onPointerOver: (event) => {
			event.stopPropagation();
			document.body.style.cursor = "pointer";
		},
		onPointerOut: () => {
			document.body.style.cursor = "";
		}
	};
}
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
function makeLabelTexture(text) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Не удалось нарисовать метку");
	ctx.clearRect(0, 0, 512, 128);
	ctx.font = "600 64px Manrope, sans-serif";
	const box = Math.min(460, ctx.measureText(text).width) + 56;
	const x = (512 - box) / 2;
	ctx.fillStyle = "rgba(7, 8, 11, 0.82)";
	roundRect(ctx, x, 28, box, 72, 18);
	ctx.fill();
	ctx.fillStyle = "#f3f4f6";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(text, 256, 64);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = LinearSRGBColorSpace;
	texture.needsUpdate = true;
	return texture;
}
function BodyLabel({ text, lift, id }) {
	const sprite = (0, import_react.useRef)(null);
	const spot = (0, import_react.useMemo)(() => new Vector3(), []);
	const [map, setMap] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		let texture = null;
		const draw = () => {
			if (!live) return;
			texture = makeLabelTexture(text);
			setMap(texture);
		};
		const fonts = document.fonts;
		if (fonts) fonts.ready.then(draw);
		else draw();
		return () => {
			live = false;
			texture?.dispose();
		};
	}, [text]);
	useFrame(({ camera }) => {
		const node = sprite.current;
		if (!node) return;
		node.getWorldPosition(spot);
		const height = Math.max(1.5, camera.position.distanceTo(spot)) * .032;
		node.scale.set(height * 3.4, height, 1);
	});
	if (!map) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
		ref: sprite,
		position: [
			0,
			lift,
			0
		],
		...pick(id),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
			map,
			transparent: true,
			depthWrite: false
		})
	});
}
function SimClock() {
	const acc = (0, import_react.useRef)(0);
	useFrame((_, delta) => {
		const step = Math.min(delta, .05);
		const { paused, speed, setDay } = useSolar.getState();
		if (!paused) simDays.current += step * speed / SECONDS_PER_DAY;
		acc.current += step;
		if (acc.current >= .2) {
			acc.current = 0;
			setDay(simDays.current);
		}
	});
	return null;
}
function Sky() {
	const material = (0, import_react.useMemo)(() => new ShaderMaterial({
		vertexShader: skyVert,
		fragmentShader: skyFrag,
		side: 1,
		depthWrite: false
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		material,
		frustumCulled: false,
		renderOrder: -20,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			640,
			32,
			24
		] })
	});
}
function Starfield() {
	const group = (0, import_react.useRef)(null);
	const { dim, bright } = (0, import_react.useMemo)(() => {
		const count = window.innerWidth < 760 ? 1400 : 2400;
		const band = Math.floor(count * .45);
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const radius = 280 + Math.random() * 220;
			const theta = Math.random() * Math.PI * 2;
			const spread = i < band ? (Math.random() - .5) * .28 : Math.acos(2 * Math.random() - 1);
			const phi = i < band ? Math.PI / 2 + spread : spread;
			const tilt = .45;
			let y = radius * Math.cos(phi);
			let z = radius * Math.sin(phi) * Math.sin(theta);
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
			z = y * Math.sin(tilt) + z * Math.cos(tilt);
			y = y2;
			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;
			const warm = Math.random();
			const shade = .62 + Math.random() * .38;
			colors[i * 3] = shade * (warm > .88 ? 1 : .82);
			colors[i * 3 + 1] = shade * .88;
			colors[i * 3 + 2] = shade * (warm > .88 ? .72 : 1);
		}
		const brightCount = 90;
		const brightPos = /* @__PURE__ */ new Float32Array(270);
		for (let i = 0; i < brightCount; i++) {
			const radius = 260 + Math.random() * 200;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			brightPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			brightPos[i * 3 + 1] = radius * Math.cos(phi);
			brightPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
		}
		const dimGeo = new BufferGeometry();
		dimGeo.setAttribute("position", new BufferAttribute(positions, 3));
		dimGeo.setAttribute("color", new BufferAttribute(colors, 3));
		const brightGeo = new BufferGeometry();
		brightGeo.setAttribute("position", new BufferAttribute(brightPos, 3));
		return {
			dim: dimGeo,
			bright: brightGeo
		};
	}, []);
	useFrame((_, delta) => {
		if (useSolar.getState().paused || !group.current) return;
		group.current.rotation.y += Math.min(delta, .05) * .004;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
			geometry: dim,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
				size: 1.25,
				sizeAttenuation: false,
				vertexColors: true,
				transparent: true,
				opacity: .85,
				depthWrite: false
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
			geometry: bright,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
				size: 2.05,
				sizeAttenuation: false,
				color: "#f4f7fb",
				transparent: true,
				opacity: .95,
				depthWrite: false
			})
		})]
	});
}
function Sun() {
	const material = (0, import_react.useMemo)(() => new ShaderMaterial({
		uniforms: { uTime: { value: 0 } },
		vertexShader: sunVert,
		fragmentShader: sunFrag
	}), []);
	const corona = (0, import_react.useMemo)(() => getTextures().corona, []);
	const glow = (0, import_react.useRef)(null);
	const halo = (0, import_react.useRef)(null);
	const showLabels = useSolar((state) => state.showLabels);
	useFrame(({ clock }) => {
		if (useSolar.getState().paused) return;
		material.uniforms.uTime.value = clock.elapsedTime;
		const pulse = 1 + Math.sin(clock.elapsedTime * .7) * .035;
		if (glow.current) glow.current.scale.setScalar(11 * pulse);
		if (halo.current) halo.current.scale.setScalar(18 * pulse);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			material,
			...pick("sun"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				2.6,
				64,
				48
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
			ref: halo,
			scale: 18,
			renderOrder: -1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
				map: corona,
				transparent: true,
				depthWrite: false,
				blending: 2,
				opacity: .7
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
			ref: glow,
			scale: 11,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
				map: corona,
				transparent: true,
				depthWrite: false,
				blending: 2
			})
		}),
		showLabels && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyLabel, {
			text: "Солнце",
			lift: 3.4,
			id: "sun"
		})
	] });
}
function makeTrail(color) {
	const positions = /* @__PURE__ */ new Float32Array(252);
	const ages = new Float32Array(TRAIL);
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new BufferAttribute(positions, 3));
	geometry.setAttribute("aAge", new BufferAttribute(ages, 1));
	const material = new ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: { uColor: { value: new Color(color) } },
		vertexShader: trailVert,
		fragmentShader: trailFrag
	});
	const line = new Line(geometry, material);
	line.frustumCulled = false;
	return line;
}
function updateTrail(line, planet, theta) {
	const position = line.geometry.getAttribute("position");
	const age = line.geometry.getAttribute("aAge");
	const positions = position.array;
	const ages = age.array;
	const step = ARC / 83;
	for (let k = 0; k < TRAIL; k++) {
		writeOrbit(planet, theta - (83 - k) * step, scratch);
		positions[k * 3] = scratch.x;
		positions[k * 3 + 1] = scratch.y;
		positions[k * 3 + 2] = scratch.z;
		ages[k] = 1 - k / 83;
	}
	position.needsUpdate = true;
	age.needsUpdate = true;
}
function Orbits() {
	const lines = (0, import_react.useMemo)(() => PLANETS.map((planet) => {
		const count = 220;
		const positions = /* @__PURE__ */ new Float32Array(663);
		for (let i = 0; i <= count; i++) {
			writeOrbit(planet, i / count * Math.PI * 2, scratch);
			positions[i * 3] = scratch.x;
			positions[i * 3 + 1] = scratch.y;
			positions[i * 3 + 2] = scratch.z;
		}
		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new BufferAttribute(positions, 3));
		const material = new LineBasicMaterial({
			color: planet.swatch,
			transparent: true,
			opacity: .28,
			depthWrite: false
		});
		const line = new Line(geometry, material);
		line.frustumCulled = false;
		return line;
	}), []);
	useFrame(() => {
		const { showOrbits, selected } = useSolar.getState();
		lines.forEach((line, index) => {
			line.visible = showOrbits;
			const material = line.material;
			material.opacity = PLANETS[index].id === selected ? .75 : .24;
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: line }, PLANETS[index].id)) });
}
function Moon({ moon, parentId }) {
	const ref = (0, import_react.useRef)(null);
	const material = (0, import_react.useMemo)(() => new ShaderMaterial({
		uniforms: { uColor: { value: new Color(moon.color) } },
		vertexShader: airVert,
		fragmentShader: solidFrag
	}), [moon.color]);
	const geometry = (0, import_react.useMemo)(() => moonGeometry(moon.radius, moon.orbit * 3.1 + moon.phase), [moon]);
	useFrame(() => {
		const theta = simDays.current / moon.period * Math.PI * 2 + moon.phase;
		if (!ref.current) return;
		ref.current.position.set(Math.cos(theta) * moon.orbit, 0, Math.sin(theta) * moon.orbit);
		ref.current.rotation.y = theta;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry,
			material,
			...pick(parentId)
		})
	});
}
function Rings({ rings }) {
	const material = (0, import_react.useMemo)(() => new ShaderMaterial({
		transparent: true,
		depthWrite: false,
		side: 2,
		uniforms: {
			uInner: { value: rings.inner },
			uOuter: { value: rings.outer },
			uGap: { value: rings.gap ? 1 : 0 },
			uColorA: { value: new Color(rings.colorA) },
			uColorB: { value: new Color(rings.colorB) }
		},
		vertexShader: ringVert,
		fragmentShader: ringFrag
	}), [rings]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		rotation: [
			Math.PI / 2,
			0,
			0
		],
		material,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
			rings.inner,
			rings.outer,
			160
		] })
	});
}
function PlanetView({ planet, index }) {
	const anchor = (0, import_react.useRef)(null);
	const spin = (0, import_react.useRef)(null);
	const clouds = (0, import_react.useRef)(null);
	const showLabels = useSolar((state) => state.showLabels);
	const textures = (0, import_react.useMemo)(() => getTextures(), []);
	const trail = (0, import_react.useMemo)(() => makeTrail(planet.swatch), [planet.swatch]);
	const geometry = (0, import_react.useMemo)(() => planetGeometry(planet), [planet]);
	const surface = (0, import_react.useMemo)(() => new ShaderMaterial({
		uniforms: {
			uMap: { value: textures[planet.texture] },
			uCities: { value: planet.texture === "earth" ? 1 : 0 },
			uRadius: { value: planet.radius },
			uRelief: { value: isRocky(planet.id) ? 1 : 0 },
			uRim: { value: new Color(planet.air?.color ?? "#d5dbe6") }
		},
		vertexShader: litVert,
		fragmentShader: surfaceFrag
	}), [planet, textures]);
	const cloudMaterial = (0, import_react.useMemo)(() => {
		if (planet.texture !== "earth") return null;
		return new ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: { uMap: { value: textures.earthClouds } },
			vertexShader: litVert,
			fragmentShader: cloudFrag
		});
	}, [planet.texture, textures.earthClouds]);
	const airMaterial = (0, import_react.useMemo)(() => {
		if (!planet.air) return null;
		return new ShaderMaterial({
			transparent: true,
			depthWrite: false,
			side: 1,
			blending: 2,
			uniforms: {
				uColor: { value: new Color(planet.air.color) },
				uPower: { value: planet.air.power },
				uStrength: { value: planet.air.strength }
			},
			vertexShader: airVert,
			fragmentShader: airFrag
		});
	}, [planet.air]);
	useFrame(() => {
		const day = simDays.current;
		const theta = thetaOf(planet, day);
		writeOrbit(planet, theta, scratch);
		worldPos[index * 3] = scratch.x;
		worldPos[index * 3 + 1] = scratch.y;
		worldPos[index * 3 + 2] = scratch.z;
		if (anchor.current) anchor.current.position.set(scratch.x, scratch.y, scratch.z);
		if (spin.current) spin.current.rotation.y = day / planet.spinDays * Math.PI * 2;
		if (clouds.current) clouds.current.rotation.y = day * .22;
		const showOrbits = useSolar.getState().showOrbits;
		trail.visible = showOrbits;
		if (showOrbits) updateTrail(trail, planet, theta);
	});
	const hit = planet.radius * 1.28;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: trail }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: anchor,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				rotation: [
					0,
					0,
					planet.tilt
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
						ref: spin,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
							geometry,
							material: surface,
							renderOrder: 2,
							...pick(planet.id)
						}), cloudMaterial && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
							ref: clouds,
							material: cloudMaterial,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
								planet.radius * 1.07,
								48,
								32
							] })
						})]
					}),
					airMaterial && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						material: airMaterial,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							planet.radius * 1.14,
							48,
							32
						] })
					}),
					planet.rings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rings, { rings: planet.rings }),
					planet.moons?.map((moon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
						moon,
						parentId: planet.id
					}, moon.name))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				...pick(planet.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					hit,
					14,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					transparent: true,
					opacity: 0,
					depthWrite: false
				})]
			}),
			showLabels && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyLabel, {
				text: planet.name,
				lift: planet.radius + .45,
				id: planet.id
			})
		]
	})] });
}
function mulberry32(seed) {
	let a = seed;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function Asteroids() {
	const rocks = (0, import_react.useMemo)(() => {
		const rand = mulberry32(7);
		const tints = [
			"#8a8176",
			"#6e675e",
			"#a3988c",
			"#7a7168"
		];
		const count = window.innerWidth < 760 ? 150 : 280;
		return Array.from({ length: count }, () => ({
			orbit: 15.85 + rand() * .85,
			phase: rand() * Math.PI * 2,
			inc: (rand() - .5) * .24,
			period: 1100 + rand() * 1e3,
			scale: .03 + rand() * .065,
			spin: rand() * Math.PI * 2,
			tint: tints[Math.floor(rand() * tints.length)] ?? "#8a8176"
		}));
	}, []);
	const mesh = (0, import_react.useMemo)(() => {
		const geometry = new IcosahedronGeometry(1, 0);
		const material = new MeshBasicMaterial();
		const instanced = new InstancedMesh(geometry, material, rocks.length);
		const color = new Color();
		rocks.forEach((rock, index) => {
			const theta = rock.phase;
			const x = Math.cos(theta) * rock.orbit;
			const zFlat = Math.sin(theta) * rock.orbit;
			dummy.position.set(x, zFlat * Math.sin(rock.inc), zFlat * Math.cos(rock.inc));
			dummy.scale.setScalar(rock.scale);
			dummy.rotation.set(rock.spin, rock.spin * .4, 0);
			dummy.updateMatrix();
			instanced.setMatrixAt(index, dummy.matrix);
			color.set(rock.tint);
			instanced.setColorAt(index, color);
		});
		instanced.instanceMatrix.needsUpdate = true;
		if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
		instanced.frustumCulled = false;
		return instanced;
	}, [rocks]);
	useFrame(() => {
		const day = simDays.current;
		rocks.forEach((rock, index) => {
			const theta = day / rock.period * Math.PI * 2 + rock.phase;
			const x = Math.cos(theta) * rock.orbit;
			const zFlat = Math.sin(theta) * rock.orbit;
			dummy.position.set(x, zFlat * Math.sin(rock.inc), zFlat * Math.cos(rock.inc));
			dummy.scale.setScalar(rock.scale);
			dummy.rotation.set(rock.spin + day * .002, rock.spin, 0);
			dummy.updateMatrix();
			mesh.setMatrixAt(index, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: mesh });
}
function CameraRig() {
	const flight = (0, import_react.useRef)({
		active: false,
		elapsed: 0,
		duration: 1.2,
		id: null,
		fromPos: new Vector3(),
		fromTarget: new Vector3()
	});
	const follow = (0, import_react.useRef)(false);
	const intro = (0, import_react.useRef)(false);
	const seen = (0, import_react.useRef)(0);
	const reduced = (0, import_react.useRef)(false);
	const prev = (0, import_react.useRef)(new Vector3());
	const goalTarget = (0, import_react.useRef)(new Vector3());
	const goalPos = (0, import_react.useRef)(new Vector3());
	const look = (0, import_react.useRef)(new Vector3());
	useFrame((state, delta) => {
		const step = Math.min(delta, .05);
		const rig = asControls(state.controls);
		const camera = state.camera;
		const aspect = state.size.width / Math.max(1, state.size.height);
		const fov = camera instanceof PerspectiveCamera ? camera.fov : 48;
		const sim = useSolar.getState();
		if (!intro.current) {
			intro.current = true;
			reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			flight.current.active = true;
			flight.current.elapsed = 0;
			flight.current.duration = reduced.current ? .01 : 1.25;
			flight.current.id = null;
			flight.current.fromPos.copy(camera.position);
			flight.current.fromTarget.copy(rig ? rig.target : look.current.set(0, 0, 0));
			follow.current = false;
			if (rig) rig.enabled = false;
		} else if (sim.focusNonce !== seen.current) {
			seen.current = sim.focusNonce;
			flight.current.active = true;
			flight.current.elapsed = 0;
			flight.current.duration = reduced.current ? .01 : 1.15;
			flight.current.id = sim.selected;
			flight.current.fromPos.copy(camera.position);
			flight.current.fromTarget.copy(rig ? rig.target : look.current);
			follow.current = false;
			if (rig) rig.enabled = false;
		}
		if (flight.current.active) {
			flight.current.elapsed += step;
			const t = ease(Math.min(1, flight.current.elapsed / flight.current.duration));
			writeGoal(flight.current.id, goalTarget.current, goalPos.current, fov, aspect);
			camera.position.lerpVectors(flight.current.fromPos, goalPos.current, t);
			look.current.lerpVectors(flight.current.fromTarget, goalTarget.current, t);
			camera.lookAt(look.current);
			if (rig) rig.target.copy(look.current);
			if (t >= 1) {
				flight.current.active = false;
				follow.current = flight.current.id !== null;
				prev.current.copy(goalTarget.current);
				if (rig) rig.enabled = true;
			}
			return;
		}
		if (!follow.current || !sim.selected) return;
		writeGoal(sim.selected, goalTarget.current, goalPos.current, fov, aspect);
		camera.position.x += goalTarget.current.x - prev.current.x;
		camera.position.y += goalTarget.current.y - prev.current.y;
		camera.position.z += goalTarget.current.z - prev.current.z;
		if (rig) rig.target.copy(goalTarget.current);
		prev.current.copy(goalTarget.current);
	}, 10);
	return null;
}
function SceneContents() {
	(0, import_react.useEffect)(() => {
		return () => {
			document.body.style.cursor = "";
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#07080b"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimClock, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orbits, {}),
		PLANETS.map((planet, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanetView, {
			planet,
			index
		}, planet.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Asteroids, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			makeDefault: true,
			enablePan: false,
			enableDamping: true,
			dampingFactor: .08,
			rotateSpeed: .72,
			zoomSpeed: .85,
			minDistance: .4,
			maxDistance: 260,
			minPolarAngle: .12,
			maxPolarAngle: Math.PI - .12
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {})
	] });
}
function SolarScene() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		flat: true,
		dpr: [1, 1.75],
		camera: {
			position: [
				20,
				46,
				52
			],
			fov: 48,
			near: .05,
			far: 1600
		},
		gl: {
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		},
		style: {
			width: "100%",
			height: "100%",
			touchAction: "none"
		},
		onCreated: ({ gl }) => {
			gl.outputColorSpace = LinearSRGBColorSpace;
			gl.toneMapping = 0;
			gl.setClearColor("#07080b");
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneContents, {})
	});
}
//#endregion
export { SolarScene };
