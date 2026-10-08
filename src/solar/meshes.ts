import * as THREE from "three";
import type { PlanetDef } from "@/solar/bodies";

function hash3(ix: number, iy: number, iz: number) {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + iz * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function noise3(x: number, y: number, z: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const z0 = Math.floor(z);
  const xf = x - x0;
  const yf = y - y0;
  const zf = z - z0;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const n = (ix: number, iy: number, iz: number) => hash3(x0 + ix, y0 + iy, z0 + iz);
  const x00 = lerp(n(0, 0, 0), n(1, 0, 0), u);
  const x10 = lerp(n(0, 1, 0), n(1, 1, 0), u);
  const x01 = lerp(n(0, 0, 1), n(1, 0, 1), u);
  const x11 = lerp(n(0, 1, 1), n(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

function fbm3(x: number, y: number, z: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < 4; i++) {
    value += amplitude * noise3(x * frequency, y * frequency, z * frequency);
    frequency *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

const ROCKY: Record<string, { amp: number; freq: number; seed: number; crater: number }> = {
  mercury: { amp: 0.1, freq: 3.1, seed: 1.4, crater: 0.14 },
  venus: { amp: 0.018, freq: 2.1, seed: 4.2, crater: 0 },
  earth: { amp: 0.045, freq: 2.5, seed: 2.4, crater: 0 },
  mars: { amp: 0.085, freq: 2.7, seed: 6.6, crater: 0.07 },
};

const FLATTEN: Record<string, number> = {
  jupiter: 0.935,
  saturn: 0.89,
  uranus: 0.98,
  neptune: 0.977,
};

function displace(geo: THREE.SphereGeometry, radius: number, amp: number, freq: number, seed: number, crater: number, flatten: number) {
  const pos = geo.attributes.position;
  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    vertex.fromBufferAttribute(pos, i);
    normal.copy(vertex).normalize();
    let bump = 0;
    if (amp > 0) {
      const h = fbm3(normal.x * freq + seed, normal.y * freq, normal.z * freq + seed);
      bump = (h - 0.46) * amp;
      if (crater > 0) {
        const c = noise3(normal.x * 6.5 + seed, normal.y * 6.5, normal.z * 6.5);
        if (c > 0.7) bump -= crater * ((c - 0.7) / 0.3);
      }
    }
    const r = radius * (1 + bump);
    pos.setXYZ(i, normal.x * r, normal.y * r * flatten, normal.z * r);
  }
  geo.computeVertexNormals();
  return geo;
}

export function planetGeometry(planet: PlanetDef) {
  const rocky = ROCKY[planet.id];
  const segments = planet.radius > 1.6 ? 96 : 72;
  const geo = new THREE.SphereGeometry(planet.radius, segments, Math.round(segments * 0.72));
  return displace(
    geo,
    planet.radius,
    rocky?.amp ?? 0,
    rocky?.freq ?? 1,
    rocky?.seed ?? 0,
    rocky?.crater ?? 0,
    FLATTEN[planet.id] ?? 1,
  );
}

export function moonGeometry(radius: number, seed: number) {
  const geo = new THREE.SphereGeometry(radius, 36, 28);
  return displace(geo, radius, 0.16, 3.4, seed, 0.1, 1);
}

export function isRocky(id: string) {
  return id in ROCKY;
}
