import * as THREE from "three";
import type { TextureKey } from "@/solar/bodies";

export type TextureSet = Record<TextureKey, THREE.CanvasTexture> & {
  earthClouds: THREE.CanvasTexture;
  corona: THREE.CanvasTexture;
};

function hash2(ix: number, iy: number) {
  const s = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const xf = x - x0;
  const yf = y - y0;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(x0, y0);
  const b = hash2(x0 + 1, y0);
  const c = hash2(x0, y0 + 1);
  const d = hash2(x0 + 1, y0 + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number) {
  let v = 0;
  let a = 0.55;
  let f = 1;
  for (let i = 0; i < 3; i++) {
    v += a * noise(x * f, y * f);
    f *= 2.03;
    a *= 0.5;
  }
  return v;
}

function sphere(u: number, v: number) {
  const lon = u * Math.PI * 2;
  const lat = (v - 0.5) * Math.PI;
  return {
    lat,
    nx: Math.cos(lat) * Math.cos(lon),
    ny: Math.sin(lat),
    nz: Math.cos(lat) * Math.sin(lon),
  };
}

function put(
  data: Uint8ClampedArray,
  w: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a = 255,
) {
  const i = (y * w + x) * 4;
  data[i] = Math.max(0, Math.min(255, r));
  data[i + 1] = Math.max(0, Math.min(255, g));
  data[i + 2] = Math.max(0, Math.min(255, b));
  data[i + 3] = a;
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function makeCanvas(
  w: number,
  h: number,
  paint: (data: Uint8ClampedArray, w: number, h: number) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не удалось создать текстуру");
  const image = ctx.createImageData(w, h);
  paint(image.data, w, h);
  ctx.putImageData(image, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.LinearSRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function paintMercury(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { nx, ny, nz } = sphere(x / (w - 1), y / (h - 1));
      const n = fbm(nx * 3.2 + 1.2, ny * 3.4 + nz * 2.2);
      const crater = Math.pow(Math.abs(noise(nx * 9, nz * 9 + ny * 4) - 0.55), 0.45);
      const shade = 118 + n * 70 - crater * 36;
      put(data, w, x, y, shade, shade - 4, shade - 10);
    }
  }
}

function paintVenus(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { lat, nx, ny, nz } = sphere(x / (w - 1), y / (h - 1));
      const n = fbm(nx * 2.4 + ny, nz * 2.2 + 3);
      const bands = Math.sin(lat * 10 + n * 3) * 0.5 + 0.5;
      const r = mix(214, 242, bands) + (n - 0.5) * 18;
      const g = mix(170, 206, bands) + (n - 0.5) * 12;
      const b = mix(96, 132, bands);
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintEarth(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { lat, nx, ny, nz } = sphere(x / (w - 1), y / (h - 1));
      const n = fbm(nx * 1.7 + 2.2, ny * 1.9 + nz * 1.4);
      const n2 = fbm(nx * 3.4 + 8, nz * 3.1 + ny * 2);
      const ice = Math.max(0, (Math.abs(lat) - 1.05) / 0.45);
      let r: number;
      let g: number;
      let b: number;
      if (n > 0.56) {
        const desert = n2 > 0.58 && Math.abs(lat) < 0.7;
        if (desert) {
          r = 186;
          g = 154;
          b = 96;
        } else if (Math.abs(lat) > 0.95) {
          r = 96;
          g = 110;
          b = 86;
        } else {
          r = 58 + n2 * 30;
          g = 112 + n2 * 28;
          b = 62;
        }
      } else {
        const depth = (0.56 - n) / 0.56;
        r = 16 + (1 - depth) * 18;
        g = 58 + (1 - depth) * 46;
        b = 118 + (1 - depth) * 70;
      }
      if (ice > 0) {
        const k = Math.min(1, ice);
        r = mix(r, 236, k);
        g = mix(g, 242, k);
        b = mix(b, 246, k);
      }
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintClouds(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { nx, ny, nz } = sphere(x / (w - 1), y / (h - 1));
      const n = fbm(nx * 2.1 + 4, ny * 1.6 + nz * 2.4);
      const alpha = Math.max(0, (n - 0.52) / 0.38) * 170;
      put(data, w, x, y, 255, 255, 255, alpha);
    }
  }
}

function paintMars(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { lat, nx, ny, nz } = sphere(x / (w - 1), y / (h - 1));
      const n = fbm(nx * 2.2 + 1, ny * 2.4 + nz * 1.6);
      const ice = Math.max(0, (Math.abs(lat) - 1.2) / 0.35);
      let r = 176 + (n - 0.5) * 50;
      let g = 86 + n * 28;
      let b = 52 + n * 16;
      if (n > 0.62) {
        r = 120;
        g = 62;
        b = 46;
      }
      if (ice > 0) {
        const k = Math.min(1, ice);
        r = mix(r, 236, k);
        g = mix(g, 230, k);
        b = mix(b, 224, k);
      }
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintJupiter(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const { lat, nx, ny, nz } = sphere(u, y / (h - 1));
      const wobble = fbm(nx * 1.4 + 2, nz * 1.2) * 0.22;
      const band = Math.sin(lat * 14 + wobble * 8) * 0.5 + 0.5;
      const fine = Math.sin(lat * 28 + nx * 2) * 0.5 + 0.5;
      const light: [number, number, number] = [232, 214, 186];
      const mid: [number, number, number] = [196, 150, 104];
      const dark: [number, number, number] = [148, 96, 68];
      const pair = band > 0.55 ? light : band > 0.32 ? mid : dark;
      const t = fine * 0.18;
      let r = pair[0] * (1 - t) + light[0] * t;
      let g = pair[1] * (1 - t) + light[1] * t;
      let b = pair[2] * (1 - t) + light[2] * t;
      const lon = u * Math.PI * 2;
      const dx = Math.atan2(Math.sin(lon - 1.15), Math.cos(lon - 1.15));
      const dy = lat + 0.32;
      const spot = (dx * dx) / 0.16 + (dy * dy) / 0.055;
      if (spot < 1) {
        const k = 1 - spot;
        r = mix(r, 186, k);
        g = mix(g, 78, k);
        b = mix(b, 58, k);
      }
      void ny;
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintSaturn(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { lat, nx, nz } = sphere(x / (w - 1), y / (h - 1));
      const wobble = noise(nx * 2, nz * 2) * 0.15;
      const band = Math.sin(lat * 12 + wobble * 6) * 0.5 + 0.5;
      const r = mix(214, 242, band);
      const g = mix(186, 224, band);
      const b = mix(140, 186, band);
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintUranus(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { lat, nx, ny } = sphere(x / (w - 1), y / (h - 1));
      const n = fbm(nx * 1.5 + 3, ny * 1.4);
      const band = Math.sin(lat * 7) * 0.5 + 0.5;
      const r = mix(150, 186, band) + (n - 0.5) * 10;
      const g = mix(214, 236, band);
      const b = mix(210, 228, band);
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintNeptune(data: Uint8ClampedArray, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const { lat, nx, ny, nz } = sphere(u, y / (h - 1));
      const n = fbm(nx * 1.8, ny * 1.5 + nz);
      const band = Math.sin(lat * 9 + n) * 0.5 + 0.5;
      let r = mix(28, 52, band) + n * 8;
      let g = mix(62, 96, band);
      let b = mix(150, 196, band);
      const lon = u * Math.PI * 2;
      const dx = Math.atan2(Math.sin(lon - 2.4), Math.cos(lon - 2.4));
      const dy = lat - 0.35;
      const storm = (dx * dx) / 0.08 + (dy * dy) / 0.04;
      if (storm < 1) {
        const k = 1 - storm;
        r = mix(r, 180, k * 0.7);
        g = mix(g, 210, k * 0.7);
        b = mix(b, 230, k * 0.55);
      }
      put(data, w, x, y, r, g, b);
    }
  }
}

function paintCorona() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не удалось создать корону");
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, "rgba(255, 246, 230, 0.95)");
  g.addColorStop(0.16, "rgba(255, 214, 150, 0.55)");
  g.addColorStop(0.4, "rgba(255, 170, 80, 0.16)");
  g.addColorStop(1, "rgba(255, 150, 60, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.LinearSRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const painters: Record<TextureKey, (data: Uint8ClampedArray, w: number, h: number) => void> = {
  mercury: paintMercury,
  venus: paintVenus,
  earth: paintEarth,
  mars: paintMars,
  jupiter: paintJupiter,
  saturn: paintSaturn,
  uranus: paintUranus,
  neptune: paintNeptune,
};

let cache: TextureSet | null = null;
const previews = new Map<TextureKey, string>();

export function getTextures(): TextureSet {
  if (cache) return cache;
  const w = 256;
  const h = 128;
  const set = {} as TextureSet;
  (Object.keys(painters) as TextureKey[]).forEach((key) => {
    set[key] = makeCanvas(w, h, painters[key]);
  });
  set.earthClouds = makeCanvas(w, h, paintClouds);
  set.corona = paintCorona();
  cache = set;
  return set;
}

export function getSurfacePreview(key: TextureKey): string {
  const cached = previews.get(key);
  if (cached) return cached;
  const source = getTextures()[key].image as HTMLCanvasElement;
  const size = 160;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(source, source.width * 0.18, 0, source.width * 0.42, source.height, 0, 0, size, size);
  const light = ctx.createRadialGradient(size * 0.34, size * 0.3, size * 0.04, size * 0.5, size * 0.52, size * 0.62);
  light.addColorStop(0, "rgba(255,255,255,0.32)");
  light.addColorStop(0.42, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, size, size);
  const url = canvas.toDataURL("image/png");
  previews.set(key, url);
  return url;
}
