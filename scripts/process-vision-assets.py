"""Prepare generated PNG masters and lightweight WebP runtime assets."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


VISION_DIR = Path(__file__).parents[1] / "public" / "images" / "marcos" / "vision"
LAYERS = ("marcos-layer-top.png", "marcos-layer-bottom.png")
RUNTIME_ASSETS = {
    "marcos-eye-base.png": ("marcos-eye-base.webp", 88),
    "marcos-eye-right.png": ("marcos-eye-right.webp", 88),
    "marcos-market-atmosphere.png": ("marcos-market-atmosphere.webp", 82),
    "marcos-vision-mobile.png": ("marcos-vision-mobile.webp", 86),
}


def remove_checkerboard(path: Path) -> None:
    source = Image.open(path)
    if source.mode == "RGBA":
        return

    image = source.convert("RGB")
    pixels = np.asarray(image, dtype=np.float32)
    maximum = pixels.max(axis=2)
    minimum = pixels.min(axis=2)
    luminance = pixels.mean(axis=2)
    chroma = maximum - minimum

    dark_material = np.clip((190.0 - luminance) / 52.0, 0.0, 1.0)
    copper_fibers = np.clip((chroma - 8.0) / 34.0, 0.0, 1.0)
    alpha = np.maximum(dark_material, copper_fibers)
    alpha[luminance < 126.0] = 1.0

    alpha_image = Image.fromarray((alpha * 255).astype(np.uint8), mode="L")
    alpha_image = alpha_image.filter(ImageFilter.GaussianBlur(radius=0.45))

    output = image.convert("RGBA")
    output.putalpha(alpha_image)
    output.save(path, optimize=True)


def save_runtime_assets() -> None:
    for source_name, (output_name, quality) in RUNTIME_ASSETS.items():
        source = Image.open(VISION_DIR / source_name).convert("RGB")
        source.save(
            VISION_DIR / output_name,
            "WEBP",
            quality=quality,
            method=6,
        )

    for layer_name in LAYERS:
        source = Image.open(VISION_DIR / layer_name).convert("RGBA")
        source.save(
            VISION_DIR / layer_name.replace(".png", ".webp"),
            "WEBP",
            quality=88,
            method=6,
        )


for layer_name in LAYERS:
    remove_checkerboard(VISION_DIR / layer_name)

save_runtime_assets()
