/* ============================================================
   EFFECTS LIBRARY — Ambient + Reactive shader presets
   ------------------------------------------------------------
   AMBIENT_PRESETS  : continuous, time-based effects.
                       signature: function(nx, ny, t, params)

   REACTIVE_PRESETS  : keypress-triggered effects.
                       signature: function(nx, ny, t, params, reactive)

   `reactive` shape (per key, per frame):
     {
       held:    boolean            // true if THIS key is currently held down
       count:   number             // how many presses are still active
       nearest: {dist, age, dx, dy} | null   // closest active press
       presses: [{dist, age, dx, dy}, ...]   // ALL active presses, nearest-first
     }
     - dist: distance (same 0..1 scale as nx/ny) from this key to the press origin
     - age:  seconds since that key was pressed (grows every frame)
     - dx/dy: signed offset (this key minus the press origin), for directional FX

   Both preset types return a CSS color string, or 'transparent'/null
   to leave the key unlit (so the layer underneath can show through).

   This file depends on nothing and must be loaded before the main
   engine script.
   ============================================================ */

const hexToRgb = `let hex = params.color.replace('#',''); let r = parseInt(hex.substring(0,2), 16), g = parseInt(hex.substring(2,4), 16), b = parseInt(hex.substring(4,6), 16);`;

// --- AMBIENT PRESETS (unchanged from the original engine) ---
const AMBIENT_PRESETS = {
    // RAINBOW
    rainbowFast: `// LABEL: 🌈 Fast Directional Rainbow
/*CONFIG\n{"speed": {"type": "slider", "min": 0.1, "max": 10, "value": 2.8, "step": 0.1},\n "direction": {"type": "select", "options": {"Left \u2192 Right": 1.0, "Right \u2190 Left": 2.0, "Inward \u2192\u2190": 3.0, "Outward \u2190\u2192": 4.0}, "value": 1.0}}\nCONFIG*/\nlet pos = nx; if (params.direction == 2.0) pos = 1.0 - nx; else if (params.direction == 3.0) pos = Math.abs(nx - 0.5) * 2.0; else if (params.direction == 4.0) pos = 1.0 - (Math.abs(nx - 0.5) * 2.0);\nconst hue = fmod((pos * 380.0 + t * params.speed * 55.0), 360.0);\nreturn \`hsl(\${hue}, 100%, 50%)\`;`,
    rainbowSlick: `// LABEL: 🌈 Prismatic Slick
/*CONFIG\n{"speed": {"type": "slider", "min": 10, "max": 100, "value": 60, "step": 1}, "spread": {"type": "slider", "min": 1, "max": 10, "value": 4, "step": 0.5}}\nCONFIG*/\nconst mirrorX = Math.abs(nx - 0.5) * 2.0; \nconst flow = Math.sin(mirrorX * params.spread - ny * 3.0 + t * 2.5);\nreturn \`hsl(\${fmod((mirrorX * 180.0 + flow * 45.0 + t * params.speed), 360.0)}, 100%, \${45.0 + Math.sin(flow * 3.0) * 15.0}%)\`;`,

    // DYNAMIC ELEMENTS
    worm: `// LABEL: 🐛 Animated Sine Worm
/*CONFIG\n{\n  "speed": { "type": "slider", "min": 0.1, "max": 10, "value": 2.0, "step": 0.1 },\n  "thickness": { "type": "slider", "min": 0.01, "max": 0.3, "value": 0.08, "step": 0.01 },\n  "glow": { "type": "slider", "min": 0.0, "max": 1.0, "value": 0.6, "step": 0.05 },\n  "color": { "type": "color", "value": "#cc5533" }\n}\nCONFIG*/\nlet wave = 0.5 + 0.25 * Math.sin((nx * 6.0) + (t * params.speed));\nlet dist = Math.abs(ny - wave);\nfunction smoothstep(e0, e1, x) { let val = Math.max(0.0, Math.min(1.0, (x - e0) / (e1 - e0))); return val * val * (3.0 - 2.0 * val); }\nlet body = smoothstep(params.thickness, 0.0, dist);\nlet halo = smoothstep(params.thickness + 0.1, params.thickness, dist) * params.glow;\nlet intensity = Math.max(body, halo);\nif (intensity < 0.01) return 'rgba(0,0,0,1)';\n${hexToRgb}\nreturn \`rgb(\${r}, \${g}, \${b}, \${intensity})\`;`,
    ocean: `// LABEL: 🌊 Directional Ocean Waves
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 3}, "color": {"type": "color", "value": "#0066cc"}, "direction": {"type": "select", "options": {"\u2190 Left": -1.0, "\u2192 Right": 1.0, "\u2191 Up": -2.0, "\u2193 Down": 2.0}, "value": -1.0}}\nCONFIG*/\nlet phase = Math.abs(params.direction) == 1.0 ? nx * 8.0 * params.direction : ny * 8.0 * (params.direction > 0.0 ? 1.0 : -1.0);\nlet wave = Math.sin(phase - t * params.speed);\n${hexToRgb}\nreturn \`rgba(\${r}, \${g}, \${b}, \${(wave + 1.0) / 2.0})\`;`,
    heartbeat: `// LABEL: ❤️ Pulse Heartbeat
/*CONFIG\n{"bpm": {"type": "slider", "min": 30, "max": 180, "value": 72}, "color": {"type": "color", "value": "#ff0000"}}\nCONFIG*/\nconst beatFreq = params.bpm / 60.0;\nlet heartbeat = Math.pow(Math.sin(t * beatFreq * Math.PI) * 0.5 + 0.5, 4.0);\nheartbeat = Math.max(heartbeat, Math.max(0.0, Math.sin(t * beatFreq * Math.PI - 0.6) * 0.6) * 0.7);\n${hexToRgb}\nreturn \`rgba(\${r}, \${g}, \${b}, \${heartbeat * 0.85 + Math.sin(nx * 8.0 + ny * 6.0 + t * 1.5) * 0.08})\`;`,
    ripple: `// LABEL: 💧 Water Ripple
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 15, "value": 5}, "color": {"type": "color", "value": "#0099ff"}}\nCONFIG*/\nlet wave = Math.sin(Math.sqrt(Math.pow(nx - 0.5, 2.0) + Math.pow(ny - 0.5, 2.0)) * 20.0 - t * params.speed);\n${hexToRgb} return \`rgba(\${r}, \${g}, \${b}, \${(wave + 1.0) / 2.0})\`;`,
    fire: `// LABEL: 🔥 Campfire
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 15, "value": 8}, "intensity": {"type": "slider", "min": 0.1, "max": 1.0, "value": 0.3, "step": 0.05}}\nCONFIG*/\nlet noise = Math.sin(nx*20.0 + ny*50.0 - t*params.speed) * Math.cos(nx*15.0 - t*(params.speed/2.0));\nlet heat = (1.0 - ny) + noise * params.intensity;\nreturn \`rgb(\${Math.min(255.0, heat * 300.0)}, \${Math.min(255.0, heat * 150.0 - 50.0)}, \${Math.min(255.0, heat * 50.0 - 100.0)})\`;`,

    // TECH & AUDIO REACT
    eqBands: `// LABEL: 📊 Harmonic EQ Analyzer
/*CONFIG\n{"speed": {"type": "slider", "min": 0.5, "max": 3, "value": 1.0, "step": 0.1}, "hueBase": {"type": "slider", "min": 0, "max": 360, "value": 120}}\nCONFIG*/\nconst bands = 16.0; const bandId = Math.floor(nx * bands);\nconst isGap = (fmod(nx * bands, 1.0) < 0.15) ? 1.0 : 0.0;\nconst beat1 = Math.sin(bandId * 12.9898 + t * (8.0 * params.speed));\nconst beat2 = Math.sin(bandId * 78.233 + t * (14.0 * params.speed));\nconst barHeight = (beat1 + beat2) * 0.2 + 0.4;\nconst yPos = 1.0 - ny;\nconst inBar = (yPos <= barHeight) ? 1.0 : 0.0;\nconst peakPos = barHeight + 0.1 - (fmod((t * 2.0 + bandId * 0.1), 0.15));\nconst isPeakDot = (yPos > barHeight && Math.abs(yPos - peakPos) < 0.05) ? 1.0 : 0.0;\nconst h = fmod((params.hueBase - (yPos * 140.0)), 360.0);\nlet l = 0.0; if (isGap == 0.0) { if (inBar == 1.0) l = 50.0; else if (isPeakDot == 1.0) l = 60.0; }\nreturn \`hsl(\${h}, 100%, \${l}%)\`;`,
    synthwave: `// LABEL: 🕶️ Synthwave Cascade
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 4}, "hueBase": {"type": "slider", "min": 0, "max": 360, "value": 240}}\nCONFIG*/\nconst centerDist = nx - 0.5; const dir = centerDist < 0.0 ? -1.0 : 1.0;\nconst cascade = Math.sin(ny * 6.0 + Math.abs(centerDist) * 5.0 - t * params.speed);\nif (Math.sin(nx * 123.4 + ny * 456.7 + t * 42.0) > 0.96 && cascade > 0.6) return 'white';\nreturn \`hsl(\${fmod((params.hueBase + Math.sin(ny * 3.0 + t * 1.5) * 60.0 + dir * 15.0), 360.0)}, 100%, \${cascade > 0.1 ? 50.0 + cascade * 25.0 : 8.0}%)\`;`,

    // SPLIT / ERGO
    splitIgnition: `// LABEL: 🚀 Dual-Core Ignition Wave
/*CONFIG\n{"speed": {"type": "slider", "min": 0.1, "max": 3, "value": 0.8, "step": 0.1}, "baseHue": {"type": "slider", "min": 0, "max": 360, "value": 230}}\nCONFIG*/\nconst dist = Math.min(Math.sqrt(Math.pow(nx-0.25, 2.0) + Math.pow(ny-0.5, 2.0)), Math.sqrt(Math.pow(nx-0.75, 2.0) + Math.pow(ny-0.5, 2.0)));\nconst waveFront = t * params.speed;\nconst flare = Math.pow(Math.max(0.0, 1.0 - (Math.abs(dist - waveFront) / 0.15)), 3.0);\nconst h = params.baseHue + Math.sin(Math.abs(nx - 0.5) * 8.0 - t * 1.5) * 50.0;\nlet l = ((waveFront > dist ? 1.0 : 0.0) * (35.0 + Math.sin(dist * 12.0 - t * 3.0) * 10.0)) + (flare * 80.0);\nreturn \`hsl(\${fmod(h, 360.0)}, 100%, \${Math.min(100.0, Math.max(0.0, l))}%) \`;`,
    dualRadar: `// LABEL: 📡 Dual-Core Radar Ping
/*CONFIG\n{"speed": {"type": "slider", "min": 0.1, "max": 3, "value": 0.6, "step": 0.1}, "hue": {"type": "slider", "min": 0, "max": 360, "value": 160}}\nCONFIG*/\nlet dx = nx - (nx < 0.5 ? 0.25 : 0.75); let dy = ny - 0.5;\nconst dist = Math.sqrt(dx * dx + dy * dy);\nconst sweep = fmod(((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2.0) - t * params.speed + 1000.0), 1.0);\nconst l = 2.0 + (Math.pow(sweep, 3.0) * 45.0) + (Math.pow(Math.max(0.0, 1.0 - Math.abs(dist - fmod((t * 1.2), 1.5)) * 10.0), 2.0) * 50.0);\nreturn \`hsl(\${params.hue}, 100%, \${Math.min(100.0, Math.max(0.0, l))}%)\`;`,
    vLaser: `// LABEL: 🤺 V-Field Laser Sweep
/*CONFIG\n{"speed": {"type": "slider", "min": 0.5, "max": 5, "value": 1.8, "step": 0.1}, "hue": {"type": "slider", "min": 0, "max": 360, "value": 180}}\nCONFIG*/\nconst dist = Math.abs((Math.abs(nx - 0.5) * 1.5 + ny) - fmod((t * params.speed), 3.0));\nconst laserIntensity = Math.pow(Math.max(0.0, 1.0 - (dist / 0.08)), 4.0);\nconst gridMesh = Math.max(0.0, Math.sin(nx * 50.0) * Math.sin(ny * 50.0));\nreturn \`hsl(\${params.hue - (laserIntensity * 60.0)}, 100%, \${Math.min(100.0, 2.0 + (gridMesh * 8.0) + (laserIntensity * 85.0))}%)\`;`,

    // SCANNERS & SWEEPS
    cylon: `// LABEL: 🤖 Cylon Eye Scanner
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 4, "step": 0.1}, "color": {"type": "color", "value": "#ff0000"}, "axis": {"type": "select", "options": {"Horizontal": 1.0, "Vertical": 2.0}, "value": 1.0}}\nCONFIG*/\nlet scanPos = (Math.sin(t * params.speed) + 1.0) / 2.0;\nlet intensity = Math.max(0.0, 1.0 - Math.abs((params.axis == 1.0 ? nx : ny) - scanPos) * 8.0);\n${hexToRgb}\nreturn \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`,
    radar: `// LABEL: 🛰️ Radar Sweep
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 3}, "color": {"type": "color", "value": "#00ff64"}}\nCONFIG*/\nlet diff = Math.atan2(ny - 0.5, nx - 0.5) - (fmod((t * params.speed), (Math.PI * 2.0)) - Math.PI);\nif (diff < 0.0) diff += Math.PI * 2.0;\n${hexToRgb}\nreturn \`rgba(\${r}, \${g}, \${b}, \${diff < 1.0 ? 1.0 - diff : 0.0})\`;`,
    energyBeam: `// LABEL: 🔫 Energy Beam
/*CONFIG\n{"speed": {"type": "slider", "min": 0.5, "max": 5, "value": 1.5, "step": 0.1}, "color": {"type": "color", "value": "#ff0000"}}\nCONFIG*/\nlet scanPos = Math.pow((Math.sin(t * params.speed) + 1.0) / 2.0, 0.6);\nlet dx = nx - scanPos; let dy = ny - 0.5;\nlet dist = Math.sqrt(dx * dx + dy * dy);\nlet intensity = Math.max(0.0, Math.min(1.0, (Math.exp(-dx * dx * 80.0) * 1.5 + Math.exp(-dist * 10.0) * 0.5) * (0.85 + 0.15 * Math.sin(t * 2.0))));\n${hexToRgb}\nreturn \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`,
    needleH: `// LABEL: ➖ Horizontal Needle
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 2.8, "step": 0.1}, "hue": {"type": "slider", "min": 0, "max": 360, "value": 200}}\nCONFIG*/\nconst sweep = fmod((t * params.speed), 2.0);\nconst dist = Math.abs(nx - (sweep < 1.0 ? sweep : 2.0 - sweep) + ny * 0.08);\nconst core = Math.exp(-dist * 38.0);\nconst intensity = core * 1.0 + Math.exp(-dist * 9.5) * 0.65 * (Math.sin(t * 6.5) * 0.07 + 0.93);\nreturn \`hsl(\${params.hue}, 100%, \${Math.min(100.0, intensity * 50.0 + core * 50.0)}%)\`;`,
    needleV: `// LABEL: │ Vertical Needle
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 3.1, "step": 0.1}, "hue": {"type": "slider", "min": 0, "max": 360, "value": 280}}\nCONFIG*/\nconst sweep = fmod((t * params.speed), 2.0);\nconst dist = Math.abs(ny - (sweep < 1.0 ? sweep : 2.0 - sweep) + nx * 0.07);\nconst core = Math.exp(-dist * 42.0);\nconst intensity = core * 1.1 + Math.exp(-dist * 11.5) * 0.68 * (Math.sin(t * 7.2) * 0.08 + 0.92);\nreturn \`hsl(\${params.hue}, 100%, \${Math.min(100.0, intensity * 50.0 + core * 50.0)}%)\`;`,

    // COSMIC
    starry: `// LABEL: ✨ Starry Night
/*CONFIG\n{"speed": {"type": "slider", "min": 1, "max": 10, "value": 3}, "density": {"type": "slider", "min": 0.90, "max": 0.99, "value": 0.95, "step": 0.01}}\nCONFIG*/\nlet rand = Math.sin(nx * 12.98 + ny * 78.23) * 43758.54;\nif (Math.sin(t * params.speed + (rand - Math.floor(rand)) * 100.0) > params.density) return 'white';\nreturn 'transparent';`,
    nebula: `// LABEL: 🌌 Nebula Supernova
/*CONFIG\n{"speed": {"type": "slider", "min": 0.5, "max": 5, "value": 2.0, "step": 0.1}, "hueOffset": {"type": "slider", "min": 0, "max": 360, "value": 0}}\nCONFIG*/\nlet dx = nx - 0.5; let dy = ny - 0.5;\nlet dist = Math.sqrt(dx*dx + dy*dy);\nlet spiral = Math.sin(Math.atan2(dy, dx) * 3.0 + t * params.speed + dist * 5.0);\nreturn \`hsl(\${fmod((t * 20.0 + dist * 100.0 + params.hueOffset), 360.0)}, 100%, \${Math.min(100.0, (5.0 / (dist + 0.1)) + spiral * 30.0)}%)\`;`,
    aurora: `// LABEL: 🧊 Aurora Borealis
/*CONFIG\n{"speed": {"type": "slider", "min": 0.5, "max": 5, "value": 1.0, "step": 0.1}, "hue": {"type": "slider", "min": 0, "max": 360, "value": 180}}\nCONFIG*/\nlet wave = Math.sin(nx * 4.0 + t * params.speed) * 0.2;\nlet band = Math.max(0.0, 1.0 - Math.abs(ny - 0.5 - wave) * 3.0);\nreturn \`hsl(\${params.hue}, 100%, \${band * 50.0}%)\`;`
};

// --- REACTIVE PRESETS (new — fire from the key(s) you actually press) ---
const REACTIVE_PRESETS = {
    rippleBurst: `// LABEL: 💥 Ripple Burst
/*CONFIG
{
  "speed": { "type": "slider", "min": 1, "max": 15, "value": 6, "step": 0.5 },
  "duration": { "type": "slider", "min": 0.2, "max": 3, "value": 1.2, "step": 0.1 },
  "thickness": { "type": "slider", "min": 0.02, "max": 0.5, "value": 0.12, "step": 0.01 },
  "color": { "type": "color", "value": "#00eeff" }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const progress = age / params.duration;
const ringRadius = progress * params.speed * 0.3;
const dist = reactive.nearest.dist;
const ringDist = Math.abs(dist - ringRadius);
const intensity = Math.max(0.0, 1.0 - ringDist / params.thickness) * (1.0 - progress);
if (intensity < 0.02) return 'transparent';
${hexToRgb}
return \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`,

    keyFlash: `// LABEL: ⚡ Key Flash
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.1, "max": 2, "value": 0.4, "step": 0.05 },
  "spread": { "type": "slider", "min": 0.0, "max": 1.0, "value": 0.35, "step": 0.05 },
  "color": { "type": "color", "value": "#ffaa00" }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const fade = 1.0 - (age / params.duration);
const falloff = Math.max(0.0, 1.0 - (reactive.nearest.dist / (params.spread + 0.001)));
const intensity = fade * falloff;
if (intensity < 0.02) return 'transparent';
${hexToRgb}
return \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`,

    pulseHold: `// LABEL: 🔴 Pulse & Hold
/*CONFIG
{
  "holdColor": { "type": "color", "value": "#ff2266" },
  "releaseDuration": { "type": "slider", "min": 0.1, "max": 2, "value": 0.6, "step": 0.05 },
  "spread": { "type": "slider", "min": 0.05, "max": 1.0, "value": 0.3, "step": 0.05 }
}
CONFIG*/
function toRGB(hexColor) {
  let hex = hexColor.replace('#', '');
  return [parseInt(hex.substring(0,2),16), parseInt(hex.substring(2,4),16), parseInt(hex.substring(4,6),16)];
}
if (reactive.held) {
  const rgbHeld = toRGB(params.holdColor);
  return \`rgb(\${rgbHeld[0]}, \${rgbHeld[1]}, \${rgbHeld[2]})\`;
}
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.releaseDuration) return 'transparent';
const fade = 1.0 - (age / params.releaseDuration);
const falloff = Math.max(0.0, 1.0 - (reactive.nearest.dist / (params.spread + 0.001)));
const intensity = fade * falloff * 0.8;
if (intensity < 0.02) return 'transparent';
const rgbFade = toRGB(params.holdColor);
return \`rgba(\${rgbFade[0]}, \${rgbFade[1]}, \${rgbFade[2]}, \${intensity})\`;`,

    colorSplashChord: `// LABEL: 🎨 Color Splash (Chord)
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.2, "max": 3, "value": 1.0, "step": 0.1 },
  "spread": { "type": "slider", "min": 0.05, "max": 1.0, "value": 0.4, "step": 0.05 },
  "color": { "type": "color", "value": "#33ff99" }
}
CONFIG*/
if (!reactive.count) return 'transparent';
let total = 0.0;
for (const p of reactive.presses) {
  if (p.age > params.duration) continue;
  const fade = 1.0 - (p.age / params.duration);
  const falloff = Math.max(0.0, 1.0 - (p.dist / (params.spread + 0.001)));
  total += fade * falloff;
}
const intensity = Math.min(1.0, total);
if (intensity < 0.02) return 'transparent';
${hexToRgb}
return \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`,

    sparkTrail: `// LABEL: ✨ Spark Trail
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.1, "max": 2, "value": 0.5, "step": 0.05 },
  "length": { "type": "slider", "min": 0.1, "max": 2, "value": 0.6, "step": 0.05 },
  "hue": { "type": "slider", "min": 0, "max": 360, "value": 45 }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const fade = 1.0 - (age / params.duration);
const streak = Math.max(0.0, 1.0 - (Math.abs(reactive.nearest.dy) * 6.0)) * Math.max(0.0, 1.0 - (Math.abs(reactive.nearest.dx) / params.length));
const intensity = fade * streak;
if (intensity < 0.02) return 'transparent';
return \`hsla(\${params.hue}, 100%, 60%, \${intensity})\`;`,

    rowColumnCross: `// LABEL: ➕ Row/Column Cross
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.1, "max": 2, "value": 0.5, "step": 0.05 },
  "thickness": { "type": "slider", "min": 0.01, "max": 0.3, "value": 0.05, "step": 0.01 },
  "color": { "type": "color", "value": "#00ffaa" }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const fade = 1.0 - (age / params.duration);
const onRow = Math.abs(reactive.nearest.dy) < params.thickness;
const onCol = Math.abs(reactive.nearest.dx) < params.thickness;
if (!onRow && !onCol) return 'transparent';
const intensity = fade * (onRow && onCol ? 1.0 : 0.6);
if (intensity < 0.02) return 'transparent';
${hexToRgb}
return \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`,

    windGust: `// LABEL: 💨 Wind Gust
/*CONFIG
{
  "speed": { "type": "slider", "min": 1, "max": 10, "value": 4, "step": 0.5 },
  "duration": { "type": "slider", "min": 0.2, "max": 2, "value": 0.8, "step": 0.05 },
  "thickness": { "type": "slider", "min": 0.02, "max": 0.5, "value": 0.15, "step": 0.01 },
  "direction": { "type": "select", "options": {"Right \u2192": 1.0, "\u2190 Left": -1.0}, "value": 1.0 },
  "hue": { "type": "slider", "min": 0, "max": 360, "value": 200 }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const dxDir = reactive.nearest.dx * params.direction;
if (dxDir < 0.0) return 'transparent';
const gustFront = age * params.speed * 0.3;
const behind = Math.max(0.0, gustFront - dxDir);
const trail = Math.min(1.0, behind / (params.speed * 0.15 + 0.01));
const vertical = Math.max(0.0, 1.0 - Math.abs(reactive.nearest.dy) / params.thickness);
const fade = 1.0 - (age / params.duration);
const intensity = trail * vertical * fade;
if (intensity < 0.02) return 'transparent';
return \`hsla(\${params.hue}, 100%, 55%, \${intensity})\`;`,

    confettiScatter: `// LABEL: 🎉 Confetti Scatter
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.3, "max": 3, "value": 1.0, "step": 0.1 },
  "density": { "type": "slider", "min": 0.05, "max": 0.6, "value": 0.25, "step": 0.05 },
  "radius": { "type": "slider", "min": 0.1, "max": 1.0, "value": 0.5, "step": 0.05 }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const p = reactive.nearest;
if (p.age > params.duration || p.dist > params.radius) return 'transparent';
const seed = Math.sin((nx * 91.7 + ny * 53.3) * 1000.0) * 43758.5453;
const rand = seed - Math.floor(seed);
if (rand > params.density) return 'transparent';
const fade = 1.0 - (p.age / params.duration);
const twinkle = 0.6 + 0.4 * Math.sin(t * 20.0 + rand * 60.0);
const hue = rand * 360.0;
return \`hsla(\${hue}, 100%, 60%, \${fade * twinkle})\`;`,

    globalFlashPulse: `// LABEL: 📸 Global Flash Pulse
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.05, "max": 1, "value": 0.15, "step": 0.01 },
  "color": { "type": "color", "value": "#ffffff" }
}
CONFIG*/
if (!reactive.nearest) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const intensity = Math.pow(1.0 - (age / params.duration), 2.0);
if (intensity < 0.02) return 'transparent';
${hexToRgb}
return \`rgba(\${r}, \${g}, \${b}, \${intensity * 0.9})\`;`,

    heatMapGlow: `// LABEL: 🌡️ Heat Map Glow
/*CONFIG
{
  "duration": { "type": "slider", "min": 1, "max": 10, "value": 4, "step": 0.5 },
  "hueHot": { "type": "slider", "min": 0, "max": 360, "value": 50 },
  "hueCold": { "type": "slider", "min": 0, "max": 360, "value": 260 }
}
CONFIG*/
if (!reactive.nearest || reactive.nearest.dist > 0.01) return 'transparent';
const age = reactive.nearest.age;
if (age > params.duration) return 'transparent';
const heat = 1.0 - (age / params.duration);
const hue = params.hueCold + (params.hueHot - params.hueCold) * heat;
return \`hsla(\${hue}, 100%, 55%, \${Math.pow(heat, 0.6)})\`;`,

    chainLightning: `// LABEL: ⚡ Chain Lightning (Chord)
/*CONFIG
{
  "duration": { "type": "slider", "min": 0.1, "max": 1.5, "value": 0.4, "step": 0.05 },
  "thickness": { "type": "slider", "min": 0.01, "max": 0.2, "value": 0.05, "step": 0.01 },
  "color": { "type": "color", "value": "#aaddff" }
}
CONFIG*/
if (reactive.count < 2) return 'transparent';
const p1 = reactive.presses[0];
const p2 = reactive.presses[1];
const age = Math.min(p1.age, p2.age);
if (age > params.duration) return 'transparent';
const ax = nx - p1.dx, ay = ny - p1.dy;
const bx = nx - p2.dx, by = ny - p2.dy;
const abx = bx - ax, aby = by - ay;
const lenSq = abx*abx + aby*aby;
let tSeg = lenSq > 0.0001 ? ((nx-ax)*abx + (ny-ay)*aby) / lenSq : 0.0;
tSeg = Math.max(0.0, Math.min(1.0, tSeg));
const px = ax + abx*tSeg, py = ay + aby*tSeg;
const dist = Math.sqrt(Math.pow(nx-px, 2.0) + Math.pow(ny-py, 2.0));
const jitter = Math.sin(nx*40.0 + ny*40.0 + t*30.0) * params.thickness * 0.3;
const core = Math.max(0.0, 1.0 - Math.abs(dist - jitter) / params.thickness);
const fade = 1.0 - (age / params.duration);
const intensity = core * fade;
if (intensity < 0.02) return 'transparent';
${hexToRgb}
return \`rgba(\${r}, \${g}, \${b}, \${intensity})\`;`
};
