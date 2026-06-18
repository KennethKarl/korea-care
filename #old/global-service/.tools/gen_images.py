"""Generate images for demo.html via Gemini 2.5 Flash Image (Nano Banana).

Reads GEMINI_API_KEY from ../.env. Writes PNG files into prototype/assets/gen/.
Skips any image that already exists so the script is resumable.
"""
from __future__ import annotations

import base64
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_PATH = ROOT / ".env"
OUT_DIR = ROOT / "prototype" / "assets" / "gen"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MODEL = "gemini-2.5-flash-image"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"


def load_key() -> str:
    for line in ENV_PATH.read_text().splitlines():
        if line.startswith("GEMINI_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("GEMINI_API_KEY not found in .env")


def gen(prompt: str, out_path: Path, key: str, retries: int = 3) -> bool:
    if out_path.exists() and out_path.stat().st_size > 1024:
        print(f"  skip (exists): {out_path.name}")
        return True
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }
    body = json.dumps(payload).encode()
    headers = {"Content-Type": "application/json", "x-goog-api-key": key}
    for attempt in range(1, retries + 1):
        req = urllib.request.Request(ENDPOINT, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", "replace")[:400]
            print(f"  HTTP {e.code} attempt {attempt}: {err}")
            if e.code in (429, 500, 503) and attempt < retries:
                time.sleep(2 * attempt)
                continue
            return False
        except Exception as e:
            print(f"  error attempt {attempt}: {e}")
            if attempt < retries:
                time.sleep(2 * attempt)
                continue
            return False

        try:
            parts = data["candidates"][0]["content"]["parts"]
        except (KeyError, IndexError):
            print(f"  unexpected response: {json.dumps(data)[:300]}")
            return False
        for part in parts:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                out_path.write_bytes(base64.b64decode(inline["data"]))
                print(f"  wrote {out_path.name} ({out_path.stat().st_size//1024} KB)")
                return True
        print(f"  no image in response: {json.dumps(data)[:300]}")
        return False
    return False


STYLE_PHOTO = (
    "Editorial medical-travel photography, calm and trustworthy. "
    "Soft natural daylight, balanced whites, a hint of blue and aqua. "
    "Wide cinematic composition, depth, no text, no logos, no people facing camera. "
    "Tasteful, premium, magazine quality. Avoid stock-photo cliches."
)
STYLE_ABSTRACT = (
    "Editorial abstract still-life image, premium magazine quality. "
    "Soft natural daylight, calm palette, generous negative space. "
    "No text, no logos, no watermarks. Composition: rule of thirds with breathing room."
)
STYLE_BA = (
    "Soft-focus editorial macro detail, beauty-magazine aesthetic. "
    "Neutral warm tones — cream, sand, taupe. Negative space, gentle shadows. "
    "No faces, no patient identifiers, no text."
)

JOBS: list[tuple[str, str]] = [
    ("hero-skyline",
     f"{STYLE_PHOTO} Soft morning view of a modern Seoul medical campus skyline through "
     "frosted glass, blurred bokeh of city lights, foreground of a calm reception desk "
     "edge with fresh white orchids. Aspect ratio 2:1, wide cinematic."),

    ("hosp-samsung-mc",
     f"{STYLE_PHOTO} Modern tertiary hospital lobby, double-height atrium, polished stone "
     "floor reflecting daylight, navy and silver accents, glass curtain wall, subtle Korean "
     "wayfinding signage out of focus. Aspect 16:9."),
    ("hosp-asan-mc",
     f"{STYLE_PHOTO} Aerial dusk view of a major hospital campus near a riverside park, "
     "lit windows forming a quiet rhythm, faint mountain silhouette, navy-teal sky. Aspect 16:9."),
    ("hosp-severance",
     f"{STYLE_PHOTO} Heritage university hospital, classical brick facade meeting a new "
     "glass wing, autumn ginkgo leaves on a courtyard path, warm low-angle light. Aspect 16:9."),
    ("hosp-seoul-saint-marys",
     f"{STYLE_PHOTO} Quiet hospital chapel courtyard, soft afternoon light through tall "
     "trees, stone bench, a single white flower arrangement, calm contemplative mood. Aspect 16:9."),
    ("hosp-jk-plastic",
     f"{STYLE_PHOTO} Boutique cosmetic-surgery clinic reception in Apgujeong, ivory marble "
     "counter, brushed brass accents, a single orchid, floor-to-ceiling sheer drapes, "
     "Seoul rodeo street softly blurred outside. Aspect 16:9."),
    ("hosp-oracle-dental",
     f"{STYLE_PHOTO} Premium dental clinic, sage-and-white interior, sculptural pendant lamp, "
     "digital scanner on a clean counter, plants, no patients, calm Scandinavian-Korean "
     "aesthetic. Aspect 16:9."),
    ("hosp-snuh",
     f"{STYLE_PHOTO} Stately public university hospital, broad colonnade, evening blue hour, "
     "warm windows, leafy zelkova trees framing the entrance, deep navy palette. Aspect 16:9."),

    ("dept-derm",
     f"{STYLE_ABSTRACT} Translucent water droplet on satin skin-tone fabric, hint of "
     "cool blue light, macro detail, vertical aspect 4:5."),
    ("dept-ortho",
     f"{STYLE_ABSTRACT} Sculptural plaster cast suggestion of a human spine resting on a deep "
     "teal velvet surface, single side light, vertical 4:5."),
    ("dept-ophth",
     f"{STYLE_ABSTRACT} Concentric ripples of light on water seen from above, cobalt "
     "and teal tones, optical lens-like clarity, vertical 4:5."),
    ("dept-plastic",
     f"{STYLE_ABSTRACT} Carved alabaster facet, side-lit shadow play, deep violet "
     "background, sculptural, vertical 4:5."),
    ("dept-dental",
     f"{STYLE_ABSTRACT} Smooth white river pebbles arranged in a curved arc on sage "
     "linen, top-down minimal still life, vertical 4:5."),
    ("dept-screen",
     f"{STYLE_ABSTRACT} Layers of frosted glass discs stacked on a navy surface, soft "
     "side light revealing edges, calm precision, vertical 4:5."),
    ("dept-internal",
     f"{STYLE_ABSTRACT} Hand-blown amber glass vessel on terracotta linen, low warm "
     "light, single shadow, vertical 4:5."),
    ("dept-obgyn",
     f"{STYLE_ABSTRACT} Soft folded silk in dusty rose tones cradling a single white "
     "magnolia bud, overhead light, vertical 4:5."),

    ("ba-rhino-before",
     f"{STYLE_BA} Macro of folded ivory linen with a single small smooth stone, "
     "muted oat tones, negative space at bottom. Square."),
    ("ba-rhino-after",
     f"{STYLE_BA} Macro of brushed silk in soft champagne, single sculpted curve of "
     "light across the surface. Square."),
    ("ba-veneer-before",
     f"{STYLE_BA} Stack of white ceramic tiles, side light grazing the edges, soft "
     "shadow gradient, cream backdrop. Square."),
    ("ba-veneer-after",
     f"{STYLE_BA} Single porcelain tile with subtle pearl glaze on warm sand textile, "
     "highlight catching the curve. Square."),
    ("ba-laser-before",
     f"{STYLE_BA} Sun-warmed peach fabric draped, micro-grain texture, very soft "
     "midday light. Square."),
    ("ba-laser-after",
     f"{STYLE_BA} Polished alabaster surface, calm milky tone, single soft highlight, "
     "minimal still life. Square."),
    ("ba-eyelid-before",
     f"{STYLE_BA} Pale unbleached cotton with a soft fold, cream highlight, restrained "
     "still life. Square."),
    ("ba-eyelid-after",
     f"{STYLE_BA} Two parallel folds in soft champagne silk, gentle directional light, "
     "minimal composition. Square."),
    ("ba-aligner-before",
     f"{STYLE_BA} Quartz pebble line on linen, organic rhythm, daylight from left, "
     "warm neutrals. Square."),
    ("ba-aligner-after",
     f"{STYLE_BA} Same pebble line, now perfectly aligned in a precise row on warm "
     "stone, side light. Square."),
    ("ba-smile-before",
     f"{STYLE_BA} Frosted glass disc on cream linen with diffused light streak, soft "
     "still-life. Square."),
    ("ba-smile-after",
     f"{STYLE_BA} Same glass disc, clearer and crisp now, edge-lit with a defined "
     "highlight, warm cream backdrop. Square."),
]


def main() -> int:
    key = load_key()
    if not key:
        print("Missing key")
        return 1
    ok = 0
    fail = 0
    for slug, prompt in JOBS:
        out = OUT_DIR / f"{slug}.png"
        print(f"[{slug}]")
        if gen(prompt, out, key):
            ok += 1
        else:
            fail += 1
        time.sleep(1.0)
    print(f"\nDone. ok={ok} fail={fail} out={OUT_DIR}")
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
