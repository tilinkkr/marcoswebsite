"""Optimize generated Capital Motion artwork for the website.

The image generator may render a checkerboard into RGB output even when a
transparent background is requested. This script removes only checker-like,
neutral pixels connected to the image border, preserving neutral engraving
inside each note.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "images" / "marcos" / "capital-motion"
SOURCE_DIR = ROOT / "scripts" / "source-assets" / "capital-motion"
NOTE_NAMES = (
    "note-hero-01.png",
    "note-hero-02.png",
    "note-mid-01.png",
    "note-mid-02.png",
    "note-far-01.png",
    "note-far-02.png",
    "note-transition.png",
)


def border_connected(mask: np.ndarray) -> np.ndarray:
    height, width = mask.shape
    connected = np.zeros_like(mask, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if mask[0, x]:
            queue.append((0, x))
        if mask[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if mask[y, 0]:
            queue.append((y, 0))
        if mask[y, width - 1]:
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if connected[y, x] or not mask[y, x]:
            continue
        connected[y, x] = True
        if y:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))
        if x:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))

    return connected


def extract_note(path: Path) -> None:
    original = Image.open(path).convert("RGBA")
    existing_alpha = np.asarray(original.getchannel("A"))
    source = original.convert("RGB")
    pixels = np.asarray(source).astype(np.int16)
    brightness = pixels.mean(axis=2)
    chroma = pixels.max(axis=2) - pixels.min(axis=2)

    checker_candidate = ((chroma < 24) & (brightness > 132)) | (
        existing_alpha < 128
    )
    background = border_connected(checker_candidate)

    alpha = Image.fromarray(np.where(background, 0, 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.65))
    rgba = source.convert("RGBA")
    rgba.putalpha(alpha)

    bbox = alpha.getbbox()
    if bbox:
        pad = 18
        left = max(0, bbox[0] - pad)
        top = max(0, bbox[1] - pad)
        right = min(rgba.width, bbox[2] + pad)
        bottom = min(rgba.height, bbox[3] + pad)
        rgba = rgba.crop((left, top, right, bottom))

    max_width = 1280 if "hero" in path.name or "transition" in path.name else 920
    if rgba.width > max_width:
        height = round(rgba.height * max_width / rgba.width)
        rgba = rgba.resize((max_width, height), Image.Resampling.LANCZOS)

    rgba.save(path, optimize=True, compress_level=9)


def convert_background(source_name: str, target_name: str, max_width: int) -> None:
    source_path = SOURCE_DIR / source_name
    image = Image.open(source_path).convert("RGB")
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    image.save(ASSET_DIR / target_name, "WEBP", quality=82, method=6)


for note_name in NOTE_NAMES:
    extract_note(ASSET_DIR / note_name)

convert_background("capital-bg.png", "capital-bg.webp", 1920)
convert_background("red-atmosphere.png", "red-atmosphere.webp", 1920)
convert_background("capital-mobile.png", "capital-mobile.webp", 960)
