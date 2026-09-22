#!/usr/bin/env python3
"""Rasterise the house lockup for the native splash. Ivory lives in Expo, not in the PNG."""

from __future__ import annotations

import math
import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

INK = (27, 23, 20, 255)
INK_70 = (27, 23, 20, 178)
INK_55 = (27, 23, 20, 140)
RULE = (212, 203, 184, 255)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images" / "splash-lockup.png"
CACHE = Path("/tmp/kiano-splash-fonts")

FONTS = {
    "cormorant-medium.ttf": "https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@5.2.8/latin-500-normal.ttf",
    "jost-light.ttf": "https://cdn.jsdelivr.net/fontsource/fonts/jost@5.2.8/latin-300-normal.ttf",
}


def fetch_fonts() -> tuple[Path, Path]:
    CACHE.mkdir(parents=True, exist_ok=True)
    for name, url in FONTS.items():
        dest = CACHE / name
        if dest.exists() and dest.stat().st_size > 1000:
            continue
        urllib.request.urlretrieve(url, dest)
    return CACHE / "cormorant-medium.ttf", CACHE / "jost-light.ttf"


def tracked_width(font: ImageFont.FreeTypeFont, text: str, tracking_em: float) -> float:
    extra = tracking_em * font.size
    width = 0.0
    for index, char in enumerate(text):
        width += font.getlength(char)
        if index < len(text) - 1:
            width += extra
    return width


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    cx: float,
    y: float,
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    tracking_em: float,
) -> None:
    x = cx - tracked_width(font, text, tracking_em) / 2
    extra = tracking_em * font.size
    for index, char in enumerate(text):
        draw.text((x, y), char, font=font, fill=fill)
        x += font.getlength(char)
        if index < len(text) - 1:
            x += extra


def stroke_line(
    draw: ImageDraw.ImageDraw,
    start: tuple[float, float],
    end: tuple[float, float],
    width: float,
    fill: tuple[int, int, int, int],
) -> None:
    x1, y1 = start
    x2, y2 = end
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1
    ux, uy = dx / length, dy / length
    px, py = -uy, ux
    half = width / 2
    x1e, y1e = x1 - ux * half, y1 - uy * half
    x2e, y2e = x2 + ux * half, y2 + uy * half
    draw.polygon(
        [
            (x1e + px * half, y1e + py * half),
            (x2e + px * half, y2e + py * half),
            (x2e - px * half, y2e - py * half),
            (x1e - px * half, y1e - py * half),
        ],
        fill=fill,
    )


def render() -> None:
    cormorant_path, jost_path = fetch_fonts()
    cormorant = ImageFont.truetype(str(cormorant_path), 200)
    jost_city = ImageFont.truetype(str(jost_path), 42)
    jost_est = ImageFont.truetype(str(jost_path), 30)

    size = 2400
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    cx = size / 2

    mono_h = 210.0
    scale = mono_h / 48.0
    mono_w = 40.0 * scale
    stroke_w = 1.35 * scale
    ox = cx - mono_w / 2

    kiano_h = sum(cormorant.getmetrics())
    city_h = sum(jost_city.getmetrics())
    est_h = sum(jost_est.getmetrics())
    gap_mono, gap_word, gap_rule, rule_h, gap_est = 36, 26, 58, 3, 34
    block_h = mono_h + gap_mono + kiano_h + gap_word + city_h + gap_rule + rule_h + gap_est + est_h
    top = (size - block_h) / 2

    def mark(x: float, y: float) -> tuple[float, float]:
        return ox + x * scale, top + y * scale

    stroke_line(draw, mark(20, 5), mark(20, 43), stroke_w, INK)
    stroke_line(draw, mark(15.5, 5), mark(24.5, 5), stroke_w, INK)
    stroke_line(draw, mark(15.5, 43), mark(24.5, 43), stroke_w, INK)
    stroke_line(draw, mark(20, 16), mark(7, 8), stroke_w, INK)
    stroke_line(draw, mark(20, 16), mark(33, 8), stroke_w, INK)
    stroke_line(draw, mark(5, 8), mark(9, 8), stroke_w, INK)
    stroke_line(draw, mark(31, 8), mark(35, 8), stroke_w, INK)
    stroke_line(draw, mark(20, 32), mark(7, 40), stroke_w, INK)
    stroke_line(draw, mark(20, 32), mark(33, 40), stroke_w, INK)
    stroke_line(draw, mark(5, 40), mark(9, 40), stroke_w, INK)
    stroke_line(draw, mark(31, 40), mark(35, 40), stroke_w, INK)

    y = top + mono_h + gap_mono
    draw_tracked(draw, cx, y, "KIANO", cormorant, INK, 0.32)
    y += kiano_h + gap_word
    draw_tracked(draw, cx, y, "LONDON", jost_city, INK_70, 0.38)
    y += city_h + gap_rule
    draw.rectangle([cx - 42, y, cx + 42, y + rule_h], fill=RULE)
    y += rule_h + gap_est
    draw_tracked(draw, cx, y, "EST. MMXXIV", jost_est, INK_55, 0.28)

    box = image.getbbox()
    if box is None:
        raise RuntimeError("lockup did not draw")
    lockup = image.crop((box[0] - 96, box[1] - 88, box[2] + 96, box[3] + 88))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    lockup.save(OUT, "PNG")
    print(f"wrote {OUT} {lockup.size[0]}x{lockup.size[1]}")


if __name__ == "__main__":
    os.chdir(ROOT)
    render()
