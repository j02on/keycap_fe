from pathlib import Path

from PIL import Image


assets = Path(__file__).parents[1] / "public" / "assets"
files = {
    "guchipachi.png": "guchipachi-sticker.png",
    "well-done-stamp.png": "well-done-stamp-sticker.png",
}

for source_name, target_name in files.items():
    image = Image.open(assets / source_name).convert("RGBA")
    pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            brightness = min(red, green, blue)
            if brightness > 245:
                pixels[x, y] = (red, green, blue, 0)
            elif brightness > 220:
                pixels[x, y] = (red, green, blue, int(alpha * (245 - brightness) / 25))

    image.save(assets / target_name, optimize=True)
