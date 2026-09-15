#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fetch official app icons via iTunes Search API and save as PNG."""
import json
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

OUT = Path(__file__).parent

QUERIES = [
    # (filename, term, country, match keywords in trackName/sellerName)
    ("bilibili.png", "哔哩哔哩", "cn", ["bilibili", "哔哩"]),
    ("chatgpt.png", "ChatGPT", "us", ["chatgpt"]),
    ("keep.png", "Keep 健身", "cn", ["keep"]),
    ("baiducloud.png", "百度网盘", "cn", ["百度网盘"]),
    ("neteasemusic.png", "网易云音乐", "cn", ["网易云音乐"]),
    ("genshin.png", "原神", "cn", ["原神"]),
    ("ximalaya.png", "喜马拉雅", "cn", ["喜马拉雅"]),
]


def http_get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def search_app(term, country, keywords):
    qs = urllib.parse.urlencode({
        "term": term, "country": country, "entity": "software", "limit": 10,
    })
    data = json.loads(http_get(f"https://itunes.apple.com/search?{qs}"))
    results = data.get("results", [])
    for r in results:
        name = (r.get("trackName", "") + " " + r.get("sellerName", "")).lower()
        if any(k.lower() in name for k in keywords):
            return r
    return results[0] if results else None


def main():
    report = []
    for fname, term, country, keywords in QUERIES:
        try:
            app = search_app(term, country, keywords)
            if not app:
                report.append((fname, None, "NOT FOUND", term))
                continue
            art = app.get("artworkUrl512") or app.get("artworkUrl100")
            candidates = []
            if art:
                candidates.append(art.replace("512x512bb", "1024x1024bb"))
                candidates.append(art)
            raw, art_used = None, None
            for url in candidates:
                try:
                    raw = http_get(url)
                    art_used = url
                    break
                except Exception:
                    continue
            if raw is None:
                report.append((fname, None, "DOWNLOAD FAILED", term))
                continue
            img = Image.open(BytesIO(raw)).convert("RGBA")
            img.save(OUT / fname, "PNG")
            report.append((fname, img.size, art_used, app.get("trackName")))
        except Exception as e:
            report.append((fname, None, f"ERROR: {e}", term))

    for fname, size, src, name in report:
        print(f"{fname}\t{size}\t{name}\t{src}")


if __name__ == "__main__":
    main()
