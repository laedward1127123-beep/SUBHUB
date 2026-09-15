#!/usr/bin/env python3
"""把 docs/logos/ 下的官方 logo 处理成 256x256 圆形 PNG，
并生成 SubHub 演示订阅数据 docs/demo-data.json（可直接在应用内导入）。"""
import base64
import io
import json
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
LOGO_DIR = ROOT / "docs" / "logos"
OUT_JSON = ROOT / "docs" / "demo-data.json"

SIZE = 256


def circle_png_dataurl(path: Path) -> str:
    img = Image.open(path).convert("RGBA")
    img = ImageOps.fit(img, (SIZE * 2, SIZE * 2), Image.LANCZOS)  # 512 采样再缩到 256，边缘更平滑
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, img.size[0], img.size[1]), fill=255)
    img.putalpha(mask)
    img = img.resize((SIZE, SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def days_ago(n: int) -> str:
    return (date.today() - timedelta(days=n)).isoformat()


def days_ahead(n: int) -> str:
    return (date.today() + timedelta(days=n)).isoformat()


def make_subs():
    now = datetime.now(timezone.utc).isoformat()
    logos = {p.stem: circle_png_dataurl(p) for p in LOGO_DIR.glob("*.png")}

    def sub(id_, name, cat, amount, currency, cycle, start, pay, notes, tags,
            status, color, logo, is_trial=False, trial_end="", is_ai=False, ai=None):
        return {
            "id": id_, "name": name, "categoryId": cat, "amount": amount,
            "currency": currency, "cycle": cycle, "customDays": None,
            "startDate": start, "paymentMethod": pay, "notes": notes,
            "tags": tags, "status": status, "isTrial": is_trial,
            "trialEndDate": trial_end, "isAI": is_ai, "ai": ai,
            "color": color, "iconType": "image", "icon": logos[logo],
            "createdAt": now,
        }

    return [
        sub("demo-bilibili", "哔哩哔哩大会员", "video", 148, "CNY", "yearly",
            days_ago(45), "支付宝", "年度大会员，自动续费", ["视频", "追番"],
            "active", "#FB7299", "bilibili"),
        sub("demo-chatgpt", "ChatGPT Pro 5x", "ai", 200, "USD", "monthly",
            days_ago(6), "信用卡", "GPT-5 Pro 高额度套餐", ["AI", "办公"],
            "active", "#10A37F", "chatgpt", is_ai=True, ai={
                "endpoint": "https://api.openai.com/v1",
                "apiKey": "sk-proj-demo8f3k2jd92ks01mcxz74hfd0a",
                "tokenTotal": 5000000, "tokenUsed": 3912000,
                "tokenResetPeriod": "monthly", "tokenResetDate": days_ahead(24),
            }),
        sub("demo-keep", "Keep 会员", "member", 19, "CNY", "monthly",
            days_ago(3), "微信支付", "", ["健身", "运动"],
            "active", "#24C789", "keep", is_trial=True, trial_end=days_ahead(11)),
        sub("demo-baiducloud", "百度网盘 SVIP", "cloud", 298, "CNY", "yearly",
            days_ago(60), "支付宝", "2TB 空间 + 极速下载", ["云盘", "备份"],
            "active", "#06A7FF", "baiducloud"),
        sub("demo-neteasemusic", "网易云音乐 · 黑胶VIP", "music", 15, "CNY", "monthly",
            days_ago(20), "微信支付", "", ["音乐"],
            "active", "#EC4141", "neteasemusic"),
        sub("demo-genshin", "原神 · 空月祝福", "member", 30, "CNY", "monthly",
            days_ago(28), "微信支付", "月卡，每日 90 原石", ["游戏", "月卡"],
            "active", "#14C0FF", "genshin"),
        sub("demo-ximalaya", "喜马拉雅 VIP", "music", 198, "CNY", "yearly",
            days_ago(200), "支付宝", "听书会员，暂时停用", ["播客", "有声书"],
            "paused", "#F86442", "ximalaya"),
    ]


def main():
    subs = make_subs()
    payload = {
        "app": "SubHub",
        "version": 1,
        "exportedAt": datetime.now(timezone.utc).isoformat(),
        "subscriptions": subs,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print(f"已生成 {OUT_JSON}（{len(subs)} 条订阅，{OUT_JSON.stat().st_size // 1024} KB）")


if __name__ == "__main__":
    main()
