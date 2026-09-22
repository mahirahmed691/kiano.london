#!/usr/bin/env python3
"""Rasterise the house lockup for the native splash. Ivory lives in Expo, not in the PNG."""

from __future__ import annotations

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
    scale = mono_h / 94.0
    mono_w = 102.0 * scale
    ox = cx - mono_w / 2

    kiano_h = sum(cormorant.getmetrics())
    city_h = sum(jost_city.getmetrics())
    est_h = sum(jost_est.getmetrics())
    gap_mono, gap_word, gap_rule = 48, 26, 36
    block_h = mono_h + gap_mono + kiano_h + gap_word + city_h + gap_rule + est_h
    top = (size - block_h) / 2

    def mark_poly(path: str) -> list[tuple[float, float]]:
        points: list[tuple[float, float]] = []
        for token in path.replace("L", " ").split():
            x_str, y_str = token.split(",")
            points.append((ox + float(x_str) * scale, top + float(y_str) * scale))
        return points

    for path in (
        "2.6,0.6 L2.2,1.4 L2.6,6.6 L12.4,6.9 L14.1,7.9 L16,10.2 L21.1,24.5 L21.3,26.6 L22.1,27.3 L23.2,32.4 L24.1,33.4 L24.2,35.3 L25.1,36.2 L26,39.2 L26.3,41.6 L27.1,42.4 L27.4,44.4 L28.4,46.2 L32.1,43 L35.6,41.4 L36.6,40.4 L35.8,39.7 L35.5,37.1 L33.9,33.4 L33.6,30.9 L32.8,29.6 L31.7,24.6 L30.9,23.6 L29.7,18.5 L28.9,17.6 L28.7,14.8 L26.9,11 L26.7,8.6 L25.8,7.5 L24.6,1.4 L23.4,0.8",
        "98.6,0.6 L99,1.4 L98.6,6.6 L88.8,6.9 L87.1,7.9 L85.2,10.2 L80.1,24.5 L79.9,26.6 L79.1,27.3 L78,32.4 L77.1,33.4 L77,35.3 L76.1,36.2 L75.2,39.2 L74.9,41.6 L74.1,42.4 L73.8,44.4 L72.8,46.2 L69.1,43 L65.6,41.4 L64.6,40.4 L65.4,39.7 L65.7,37.1 L67.3,33.4 L67.6,30.9 L68.5,29.6 L69.5,24.6 L70.3,23.6 L71.5,18.5 L72.3,17.6 L72.5,14.8 L74.3,11 L74.5,8.6 L75.4,7.5 L76.6,1.4 L77.8,0.8",
        "56.9,0.8 L45.9,0.9 L45.4,1.3 L45.8,3.2 L45.8,28.8 L45.7,41.6 L45.2,42.8 L39.2,44.3 L34.5,46.4 L31.3,48.4 L25.4,53.4 L21.3,58.4 L20.9,59.8 L16.3,66.4 L7.9,84.8 L3.7,88.9 L1.8,90.1 L0,90.2 L0,93.9 L16.9,93.9 L17.9,89.9 L20.6,83.6 L20.8,81.6 L21.7,80.4 L22.8,76.3 L23.7,75.4 L23.9,73.5 L29.9,62.1 L33.9,57.1 L37.2,54.2 L41.1,51.8 L44.3,50.7 L45.5,51.2 L45.8,53.3 L45.8,90.6 L45.2,93.9 L57.7,93.9 L57.6,51.4 L58.2,50.8 L61.8,51.9 L65.9,54.8 L71,60 L76,67.4 L81.1,77.3 L82.3,81.6 L83.1,82.4 L83.3,84.3 L84.9,87.8 L85.2,91.4 L86.2,93.9 L101.2,93.9 L101.2,91.7 L98.2,88.6 L95.9,85.2 L90.8,74.7 L90.7,73.6 L84.9,63.8 L84.6,62.4 L77.7,53.5 L74.5,50.4 L68.9,46.6 L57.6,46.6 L57.7,1.5 L57,0.8",
    ):
        draw.polygon(mark_poly(path), fill=INK)

    y = top + mono_h + gap_mono
    draw_tracked(draw, cx, y, "KIANO", cormorant, INK, 0.32)
    kiano_w = tracked_width(cormorant, "KIANO", 0.32)
    y += kiano_h + gap_word
    draw_tracked(draw, cx, y, "LONDON", jost_city, INK_70, 0.38)
    y += city_h + gap_rule
    est = "EST. MMXXIV"
    est_w = tracked_width(jost_est, est, 0.28)
    rule_h = 3
    rule_y = y + est_h / 2
    half = kiano_w / 2
    gap = 28
    draw.rectangle([cx - half, rule_y, cx - est_w / 2 - gap, rule_y + rule_h], fill=RULE)
    draw.rectangle([cx + est_w / 2 + gap, rule_y, cx + half, rule_y + rule_h], fill=RULE)
    draw_tracked(draw, cx, y, est, jost_est, INK_55, 0.28)

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
