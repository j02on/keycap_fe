from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).parents[1] / "public" / "assets" / "craft"
SHEETS = {
    "sheet-keycap-transparent.png": [
        "keycap-base",
        "glue",
        "keycap-finished",
        "part-strawberry",
        "part-star",
        "part-ribbon",
        "part-heart",
        "part-flower",
        "part-rainbow",
    ],
    "sheet-squishy-transparent.png": [
        "slime-base",
        "activator",
        "sequins-all",
        "clear-ball",
        "fill-ball",
        "seal-ball",
        "squishy-purple",
        "squishy-blue",
        "squishy-white",
    ],
}


for sheet_name, names in SHEETS.items():
    sheet = Image.open(ASSETS / sheet_name).convert("RGBA")
    cell_width = sheet.width // 3
    cell_height = sheet.height // 3

    for index, name in enumerate(names):
        column = index % 3
        row = index // 3
        cell = sheet.crop(
            (
                column * cell_width,
                row * cell_height,
                (column + 1) * cell_width,
                (row + 1) * cell_height,
            )
        )
        alpha = cell.getchannel("A")
        bounds = alpha.getbbox()
        if bounds:
            cell = cell.crop(bounds)
        canvas = Image.new("RGBA", (512, 512))
        cell.thumbnail((460, 460), Image.Resampling.LANCZOS)
        canvas.alpha_composite(cell, ((512 - cell.width) // 2, (512 - cell.height) // 2))
        canvas.save(ASSETS / f"{name}.png", optimize=True)
