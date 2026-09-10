"""Create the optimized runtime image for the MARCOS live-session section."""

from pathlib import Path

from PIL import Image


ASSET_DIR = (
    Path(__file__).parents[1]
    / "public"
    / "images"
    / "marcos"
    / "how-it-works"
)
SOURCE = ASSET_DIR / "marcos-live-session.png"
OUTPUT = ASSET_DIR / "marcos-live-session.webp"


with Image.open(SOURCE) as image:
    image.convert("RGB").save(OUTPUT, "WEBP", quality=86, method=6)
