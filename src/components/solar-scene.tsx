import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  FIT_RADIUS,
  PLANETS,
  thetaOf,
  writeOrbit,
  type MoonDef,
  type PlanetDef,
  type RingDef,
} from "@/solar/bodies";
import { SECONDS_PER_DAY, simDays, useSolar } from "@/solar/store";
import { getTextures } from "@/solar/textures";
import { isRocky, moonGeometry, planetGeometry } from "@/solar/meshes";

THREE.ColorManagement.enabled = false;

const TRAIL = 84;
const ARC = 1.05;
const worldPos = new Float32Array(PLANETS.length * 3);
const PLANET_INDEX: Record<string, number> = {};
const scratch = { x: 0, y: 0, z: 0 };
const HOME_DIR = new THREE.Vector3(0.34, 0.76, 0.58).normalize();
const dummy = new THREE.Object3D();

PLANETS.forEach((planet, index) => {
  PLANET_INDEX[planet.id] = index;
  writeOrbit(planet, thetaOf(planet, 0), scratch);
  worldPos[index * 3] = scratch.x;
  worldPos[index * 3 + 1] = scratch.y;
  worldPos[index * 3 + 2] = scratch.z;
});

const litVert = `
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

const surfaceFrag = `
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

const cloudFrag = `
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

const airVert = `
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const airFrag = `
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

const solidFrag = `
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec3 N = normalize(vNormal);
  float day = smoothstep(-0.08, 0.45, dot(N, normalize(-vWorld)));
  gl_FragColor = vec4(uColor * mix(0.55, 1.0, day), 1.0);
}
`;

const ringVert = `
varying float vR;
void main() {
  vR = length(position.xy);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ringFrag = `
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

const trailVert = `
attribute float aAge;
varying float vAge;
void main() {
  vAge = aAge;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const trailFrag = `
uniform vec3 uColor;
varying float vAge;
void main() {
  float a = (1.0 - vAge) * (1.0 - vAge) * 0.9;
  gl_FragColor = vec4(uColor, a);
}
`;

const sunVert = `
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

const sunFrag = `
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

const skyVert = `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFrag = `
varying vec3 vDir;
void main() {
  vec3 dir = normalize(vDir);
  float band = exp(-pow((dir.y * 0.82 + dir.x * 0.2) * 6.5, 2.0));
  vec3 col = mix(vec3(0.028, 0.032, 0.05), vec3(0.012, 0.014, 0.02), dir.y * 0.5 + 0.5);
  col += vec3(0.11, 0.12, 0.15) * band * 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

type RigControls = {
  enabled: boolean;
  target: THREE.Vector3;
};

function asControls(value: unknown): RigControls | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<RigControls>;
  if (!candidate.target || typeof candidate.enabled !== "boolean") return null;
  return candidate as RigControls;
}

function ease(t: number) {
  return 1 - (1 - t) ** 3;
}

function fitDistance(fovDeg: number, aspect: number) {
  const tanV = Math.tan((fovDeg * Math.PI) / 360);
  const tanH = tanV * Math.max(aspect, 0.35);
  return (FIT_RADIUS * 1.06) / Math.min(tanV, tanH);
}

function writeGoal(
  id: string | null,
  target: THREE.Vector3,
  cam: THREE.Vector3,
  fov: number,
  aspect: number,
) {
  if (!id) {
    target.set(0, -1.6, 0);
    cam.copy(HOME_DIR).multiplyScalar(fitDistance(fov, aspect));
    return;
  }
  if (id === "sun") {
    target.set(0, -0.45, 0);
    cam.set(5.8, 3.5, 7);
    return;
  }
  const index = PLANET_INDEX[id];
  const planet = PLANETS[index];
  const px = worldPos[index * 3];
  const py = worldPos[index * 3 + 1];
  const pz = worldPos[index * 3 + 2];
  target.set(px, py - planet.view * 0.14, pz);
  const len = Math.hypot(px, py, pz) || 1;
  const rx = px / len;
  const rz = pz / len;
  const view = planet.view;
  const flank = view * 0.2;
  cam.set(
    px - rx * view * 0.9 - rz * flank,
    py + view * 0.28,
    pz - rz * view * 0.9 + rx * flank,
  );
}

function pick(id: string) {
  return {
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      useSolar.getState().focus(id);
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeLabelTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не удалось нарисовать метку");
  ctx.clearRect(0, 0, 512, 128);
  ctx.font = "600 64px Manrope, sans-serif";
  const textWidth = Math.min(460, ctx.measureText(text).width);
  const box = textWidth + 56;
  const x = (512 - box) / 2;
  ctx.fillStyle = "rgba(7, 8, 11, 0.82)";
  roundRect(ctx, x, 28, box, 72, 18);
  ctx.fill();
  ctx.fillStyle = "#f3f4f6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function BodyLabel({ text, lift, id }: { text: string; lift: number; id: string }) {
  const sprite = useRef<THREE.Sprite>(null);
  const spot = useMemo(() => new THREE.Vector3(), []);
  const [map, setMap] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let live = true;
    let texture: THREE.CanvasTexture | null = null;
    const draw = () => {
      if (!live) return;
      texture = makeLabelTexture(text);
      setMap(texture);
    };
    const fonts = document.fonts;
    if (fonts) void fonts.ready.then(draw);
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
    const dist = Math.max(1.5, camera.position.distanceTo(spot));
    const height = dist * 0.032;
    node.scale.set(height * 3.4, height, 1);
  });

  if (!map) return null;
  return (
    <sprite ref={sprite} position={[0, lift, 0]} {...pick(id)}>
      <spriteMaterial map={map} transparent depthWrite={false} />
    </sprite>
  );
}

function SimClock() {
  const acc = useRef(0);
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const { paused, speed, setDay } = useSolar.getState();
    if (!paused) simDays.current += (step * speed) / SECONDS_PER_DAY;
    acc.current += step;
    if (acc.current >= 0.2) {
      acc.current = 0;
      setDay(simDays.current);
    }
  });
  return null;
}

function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );
  return (
    <mesh material={material} frustumCulled={false} renderOrder={-20}>
      <sphereGeometry args={[640, 32, 24]} />
    </mesh>
  );
}

function Starfield() {
  const group = useRef<THREE.Group>(null);
  const { dim, bright } = useMemo(() => {
    const count = window.innerWidth < 760 ? 1400 : 2400;
    const band = Math.floor(count * 0.45);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 280 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const spread = i < band ? (Math.random() - 0.5) * 0.28 : Math.acos(2 * Math.random() - 1);
      const phi = i < band ? Math.PI / 2 + spread : spread;
      const tilt = 0.45;
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
      const shade = 0.62 + Math.random() * 0.38;
      colors[i * 3] = shade * (warm > 0.88 ? 1 : 0.82);
      colors[i * 3 + 1] = shade * 0.88;
      colors[i * 3 + 2] = shade * (warm > 0.88 ? 0.72 : 1);
    }
    const brightCount = 90;
    const brightPos = new Float32Array(brightCount * 3);
    for (let i = 0; i < brightCount; i++) {
      const radius = 260 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      brightPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      brightPos[i * 3 + 1] = radius * Math.cos(phi);
      brightPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const dimGeo = new THREE.BufferGeometry();
    dimGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dimGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const brightGeo = new THREE.BufferGeometry();
    brightGeo.setAttribute("position", new THREE.BufferAttribute(brightPos, 3));
    return { dim: dimGeo, bright: brightGeo };
  }, []);

  useFrame((_, delta) => {
    if (useSolar.getState().paused || !group.current) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.004;
  });

  return (
    <group ref={group}>
      <points geometry={dim}>
        <pointsMaterial size={1.25} sizeAttenuation={false} vertexColors transparent opacity={0.85} depthWrite={false} />
      </points>
      <points geometry={bright}>
        <pointsMaterial size={2.05} sizeAttenuation={false} color="#f4f7fb" transparent opacity={0.95} depthWrite={false} />
      </points>
    </group>
  );
}

function Sun() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: sunVert,
        fragmentShader: sunFrag,
      }),
    [],
  );
  const corona = useMemo(() => getTextures().corona, []);
  const glow = useRef<THREE.Sprite>(null);
  const halo = useRef<THREE.Sprite>(null);
  const showLabels = useSolar((state) => state.showLabels);

  useFrame(({ clock }) => {
    if (useSolar.getState().paused) return;
    material.uniforms.uTime.value = clock.elapsedTime;
    const pulse = 1 + Math.sin(clock.elapsedTime * 0.7) * 0.035;
    if (glow.current) glow.current.scale.setScalar(11 * pulse);
    if (halo.current) halo.current.scale.setScalar(18 * pulse);
  });

  return (
    <group>
      <mesh material={material} {...pick("sun")}>
        <sphereGeometry args={[2.6, 64, 48]} />
      </mesh>
      <sprite ref={halo} scale={18} renderOrder={-1}>
        <spriteMaterial map={corona} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
      </sprite>
      <sprite ref={glow} scale={11}>
        <spriteMaterial map={corona} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      {showLabels && <BodyLabel text="Солнце" lift={3.4} id="sun" />}
    </group>
  );
}

function makeTrail(color: string) {
  const positions = new Float32Array(TRAIL * 3);
  const ages = new Float32Array(TRAIL);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aAge", new THREE.BufferAttribute(ages, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(color) } },
    vertexShader: trailVert,
    fragmentShader: trailFrag,
  });
  const line = new THREE.Line(geometry, material);
  line.frustumCulled = false;
  return line;
}

function updateTrail(line: THREE.Line, planet: PlanetDef, theta: number) {
  const position = line.geometry.getAttribute("position") as THREE.BufferAttribute;
  const age = line.geometry.getAttribute("aAge") as THREE.BufferAttribute;
  const positions = position.array as Float32Array;
  const ages = age.array as Float32Array;
  const step = ARC / (TRAIL - 1);
  for (let k = 0; k < TRAIL; k++) {
    writeOrbit(planet, theta - (TRAIL - 1 - k) * step, scratch);
    positions[k * 3] = scratch.x;
    positions[k * 3 + 1] = scratch.y;
    positions[k * 3 + 2] = scratch.z;
    ages[k] = 1 - k / (TRAIL - 1);
  }
  position.needsUpdate = true;
  age.needsUpdate = true;
}

function Orbits() {
  const lines = useMemo(
    () =>
      PLANETS.map((planet) => {
        const count = 220;
        const positions = new Float32Array((count + 1) * 3);
        for (let i = 0; i <= count; i++) {
          writeOrbit(planet, (i / count) * Math.PI * 2, scratch);
          positions[i * 3] = scratch.x;
          positions[i * 3 + 1] = scratch.y;
          positions[i * 3 + 2] = scratch.z;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
          color: planet.swatch,
          transparent: true,
          opacity: 0.28,
          depthWrite: false,
        });
        const line = new THREE.Line(geometry, material);
        line.frustumCulled = false;
        return line;
      }),
    [],
  );

  useFrame(() => {
    const { showOrbits, selected } = useSolar.getState();
    lines.forEach((line, index) => {
      line.visible = showOrbits;
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = PLANETS[index].id === selected ? 0.75 : 0.24;
    });
  });

  return (
    <>
      {lines.map((line, index) => (
        <primitive key={PLANETS[index].id} object={line} />
      ))}
    </>
  );
}

function Moon({ moon, parentId }: { moon: MoonDef; parentId: string }) {
  const ref = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(moon.color) } },
        vertexShader: airVert,
        fragmentShader: solidFrag,
      }),
    [moon.color],
  );
  const geometry = useMemo(() => moonGeometry(moon.radius, moon.orbit * 3.1 + moon.phase), [moon]);

  useFrame(() => {
    const theta = (simDays.current / moon.period) * Math.PI * 2 + moon.phase;
    if (!ref.current) return;
    ref.current.position.set(Math.cos(theta) * moon.orbit, 0, Math.sin(theta) * moon.orbit);
    ref.current.rotation.y = theta;
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry} material={material} {...pick(parentId)} />
    </group>
  );
}

function Rings({ rings }: { rings: RingDef }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uInner: { value: rings.inner },
          uOuter: { value: rings.outer },
          uGap: { value: rings.gap ? 1 : 0 },
          uColorA: { value: new THREE.Color(rings.colorA) },
          uColorB: { value: new THREE.Color(rings.colorB) },
        },
        vertexShader: ringVert,
        fragmentShader: ringFrag,
      }),
    [rings],
  );

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} material={material}>
      <ringGeometry args={[rings.inner, rings.outer, 160]} />
    </mesh>
  );
}

function PlanetView({ planet, index }: { planet: PlanetDef; index: number }) {
  const anchor = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const showLabels = useSolar((state) => state.showLabels);
  const textures = useMemo(() => getTextures(), []);
  const trail = useMemo(() => makeTrail(planet.swatch), [planet.swatch]);
  const geometry = useMemo(() => planetGeometry(planet), [planet]);
  const surface = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: textures[planet.texture] },
          uCities: { value: planet.texture === "earth" ? 1 : 0 },
          uRadius: { value: planet.radius },
          uRelief: { value: isRocky(planet.id) ? 1 : 0 },
          uRim: { value: new THREE.Color(planet.air?.color ?? "#d5dbe6") },
        },
        vertexShader: litVert,
        fragmentShader: surfaceFrag,
      }),
    [planet, textures],
  );
  const cloudMaterial = useMemo(() => {
    if (planet.texture !== "earth") return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uMap: { value: textures.earthClouds } },
      vertexShader: litVert,
      fragmentShader: cloudFrag,
    });
  }, [planet.texture, textures.earthClouds]);
  const airMaterial = useMemo(() => {
    if (!planet.air) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(planet.air.color) },
        uPower: { value: planet.air.power },
        uStrength: { value: planet.air.strength },
      },
      vertexShader: airVert,
      fragmentShader: airFrag,
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
    if (spin.current) spin.current.rotation.y = (day / planet.spinDays) * Math.PI * 2;
    if (clouds.current) clouds.current.rotation.y = day * 0.22;
    const showOrbits = useSolar.getState().showOrbits;
    trail.visible = showOrbits;
    if (showOrbits) updateTrail(trail, planet, theta);
  });

  const hit = planet.radius * 1.28;

  return (
    <>
      <primitive object={trail} />
      <group ref={anchor}>
        <group rotation={[0, 0, planet.tilt]}>
          <group ref={spin}>
            <mesh geometry={geometry} material={surface} renderOrder={2} {...pick(planet.id)} />
            {cloudMaterial && (
              <mesh ref={clouds} material={cloudMaterial}>
                <sphereGeometry args={[planet.radius * 1.07, 48, 32]} />
              </mesh>
            )}
          </group>
          {airMaterial && (
            <mesh material={airMaterial}>
              <sphereGeometry args={[planet.radius * 1.14, 48, 32]} />
            </mesh>
          )}
          {planet.rings && <Rings rings={planet.rings} />}
          {planet.moons?.map((moon) => (
            <Moon key={moon.name} moon={moon} parentId={planet.id} />
          ))}
        </group>
        <mesh {...pick(planet.id)}>
          <sphereGeometry args={[hit, 14, 10]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {showLabels && <BodyLabel text={planet.name} lift={planet.radius + 0.45} id={planet.id} />}
      </group>
    </>
  );
}

type Rock = {
  orbit: number;
  phase: number;
  inc: number;
  period: number;
  scale: number;
  spin: number;
  tint: string;
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Asteroids() {
  const rocks = useMemo<Rock[]>(() => {
    const rand = mulberry32(7);
    const tints = ["#8a8176", "#6e675e", "#a3988c", "#7a7168"];
    const count = window.innerWidth < 760 ? 150 : 280;
    return Array.from({ length: count }, () => ({
      orbit: 15.85 + rand() * 0.85,
      phase: rand() * Math.PI * 2,
      inc: (rand() - 0.5) * 0.24,
      period: 1100 + rand() * 1000,
      scale: 0.03 + rand() * 0.065,
      spin: rand() * Math.PI * 2,
      tint: tints[Math.floor(rand() * tints.length)] ?? "#8a8176",
    }));
  }, []);
  const mesh = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial();
    const instanced = new THREE.InstancedMesh(geometry, material, rocks.length);
    const color = new THREE.Color();
    rocks.forEach((rock, index) => {
      const theta = rock.phase;
      const x = Math.cos(theta) * rock.orbit;
      const zFlat = Math.sin(theta) * rock.orbit;
      dummy.position.set(x, zFlat * Math.sin(rock.inc), zFlat * Math.cos(rock.inc));
      dummy.scale.setScalar(rock.scale);
      dummy.rotation.set(rock.spin, rock.spin * 0.4, 0);
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
      const theta = (day / rock.period) * Math.PI * 2 + rock.phase;
      const x = Math.cos(theta) * rock.orbit;
      const zFlat = Math.sin(theta) * rock.orbit;
      dummy.position.set(x, zFlat * Math.sin(rock.inc), zFlat * Math.cos(rock.inc));
      dummy.scale.setScalar(rock.scale);
      dummy.rotation.set(rock.spin + day * 0.002, rock.spin, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <primitive object={mesh} />;
}

function CameraRig() {
  const flight = useRef({
    active: false,
    elapsed: 0,
    duration: 1.2,
    id: null as string | null,
    fromPos: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
  });
  const follow = useRef(false);
  const intro = useRef(false);
  const seen = useRef(0);
  const reduced = useRef(false);
  const prev = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());
  const goalPos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const rig = asControls(state.controls);
    const camera = state.camera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 48;
    const sim = useSolar.getState();

    if (!intro.current) {
      intro.current = true;
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      flight.current.active = true;
      flight.current.elapsed = 0;
      flight.current.duration = reduced.current ? 0.01 : 1.25;
      flight.current.id = null;
      flight.current.fromPos.copy(camera.position);
      flight.current.fromTarget.copy(rig ? rig.target : look.current.set(0, 0, 0));
      follow.current = false;
      if (rig) rig.enabled = false;
    } else if (sim.focusNonce !== seen.current) {
      seen.current = sim.focusNonce;
      flight.current.active = true;
      flight.current.elapsed = 0;
      flight.current.duration = reduced.current ? 0.01 : 1.15;
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
  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <color attach="background" args={["#07080b"]} />
      <SimClock />
      <Sky />
      <Starfield />
      <Sun />
      <Orbits />
      {PLANETS.map((planet, index) => (
        <PlanetView key={planet.id} planet={planet} index={index} />
      ))}
      <Asteroids />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.72}
        zoomSpeed={0.85}
        minDistance={0.4}
        maxDistance={260}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI - 0.12}
      />
      <CameraRig />
    </>
  );
}

export function SolarScene() {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      camera={{ position: [20, 46, 52], fov: 48, near: 0.05, far: 1600 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
        gl.setClearColor("#07080b");
      }}
    >
      <SceneContents />
    </Canvas>
  );
}
