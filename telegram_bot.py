#!/usr/bin/env python3
"""
GoodLife Telegram Mini App Bot
Token: 8825930433:AAHuO34DwB3A8CWTQj__9p32usy7qn-IPME
Bot: @goodlifekokand_bot
"""

import sys
import json
import time
import ssl
import urllib.request
import urllib.parse
from typing import Optional, Dict, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BOT_TOKEN = "8825930433:AAHuO34DwB3A8CWTQj__9p32usy7qn-IPME"
API_BASE = f"https://api.telegram.org/bot{BOT_TOKEN}"

# Default WebApp URL (GitHub Pages / production)
DEFAULT_WEBAPP_URL = "https://bespobobo-ctrl.github.io/Goodlife/"

# SSL context that bypasses local Windows root cert issues if needed
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE


def api_call(method: str, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = f"{API_BASE}/{method}"
    data = None
    headers = {"Content-Type": "application/json"}
    
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ssl_context, timeout=35) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"[-] API error on {method}: {e}", file=sys.stderr)
        return {"ok": False, "error": str(e)}


def set_bot_commands():
    """Register bot commands list"""
    commands = [
        {"command": "start", "description": "Do'konni ochish va ishga tushirish"},
        {"command": "shop", "description": "GoodLife Mini App-ni ochish"},
        {"command": "help", "description": "Yordam va qo'llab-quvvatlash"},
    ]
    res = api_call("setMyCommands", {"commands": commands})
    print(f"[*] setMyCommands: {res.get('ok')}")


def set_menu_button(webapp_url: str):
    """Sets the persistent bottom-left chat menu button to launch the Mini App"""
    payload = {
        "menu_button": {
            "type": "web_app",
            "text": "🛍️ Do'kon",
            "web_app": {
                "url": webapp_url
            }
        }
    }
    res = api_call("setChatMenuButton", payload)
    print(f"[*] setChatMenuButton -> {webapp_url}: {res.get('ok')}")
    return res.get('ok')


def send_message(chat_id: int, text: str, reply_markup: Optional[Dict] = None):
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    return api_call("sendMessage", payload)


def handle_start(chat_id: int, user_info: Dict, webapp_url: str):
    first_name = user_info.get("first_name", "Qadrli mijoz")
    
    welcome_text = (
        f"Assalomu alaykum, <b>{first_name}</b>! 👋\n\n"
        "🌟 <b>GoodLife Electronics</b> rasmiy Telegram Mini App do'koniga xush kelibsiz!\n\n"
        "Biz orqali siz:\n"
        "• Eng so'nggi smartfonlar, noutbuklar va maishiy texnikalarni ko'rishingiz;\n"
        "• Tungi va kunduzgi rejimda qulay xarid qilishingiz;\n"
        "• Xaritadan aniq manzilingizni belgilab, tezkor yetkazib berishga buyurtma berishingiz mumkin.\n\n"
        "👇 <i>Xaridni boshlash uchun quyidagi tugmani bosing:</i>"
    )

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🛍️ Do'konni ochish (Mini App)",
                    "web_app": {"url": webapp_url}
                }
            ],
            [
                {
                    "text": "📦 Mahsulotlar katalogi",
                    "web_app": {"url": f"{webapp_url}#products"}
                }
            ]
        ]
    }
    send_message(chat_id, welcome_text, keyboard)


def handle_help(chat_id: int, webapp_url: str):
    help_text = (
        "💡 <b>GoodLife Yordam Markazi</b>\n\n"
        "Savollaringiz bormi yoki buyurtma bo'yicha yordam kerakmi?\n"
        "• Ish vaqti: Har kuni 09:00 - 21:00\n"
        "• Manzil: Qo'qon shahri, Do'stlik ko'chasi\n"
        "• Telefon: +998 (90) 123-45-67\n\n"
        "Do'konga kirish uchun quyidagi tugmani bosing:"
    )
    keyboard = {
        "inline_keyboard": [
            [
                {"text": "🛍️ GoodLife Mini App", "web_app": {"url": webapp_url}}
            ]
        ]
    }
    send_message(chat_id, help_text, keyboard)


def handle_web_app_data(chat_id: int, data_str: str):
    """Handles order received directly from the WebApp via sendData"""
    try:
        order = json.loads(data_str)
        order_id = order.get("id", "Yangi")
        customer = order.get("customer", "Mijoz")
        phone = order.get("phone", "")
        address = order.get("address", "")
        region = order.get("region", "")
        total = order.get("total", 0)
        items = order.get("items", "")

        text = (
            "🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n\n"
            f"🆔 <b>Buyurtma:</b> #{order_id}\n"
            f"👤 <b>Mijoz:</b> {customer}\n"
            f"📞 <b>Telefon:</b> {phone}\n"
            f"📍 <b>Manzil:</b> {address} ({region})\n"
            f"📦 <b>Mahsulotlar:</b> {items}\n"
            f"💳 <b>To'lov:</b> {order.get('payment', 'Naqd pul')}\n"
            f"💰 <b>Jami summa:</b> {total:,.0f} so'm\n\n"
            "Operatorimiz tez orada siz bilan bog'lanadi! GoodLife bilan bo'lganingiz uchun rahmat! ✨"
        )
        send_message(chat_id, text)
    except Exception as e:
        print(f"[-] Error processing web_app_data: {e}", file=sys.stderr)
        send_message(chat_id, "✅ Buyurtmangiz qabul qilindi! Operatorimiz tez orada bog'lanadi.")


def run_bot(webapp_url: str):
    print("=" * 60)
    print("🚀 GoodLife Telegram Mini App Bot starting...")
    print(f"🤖 Bot Token: {BOT_TOKEN[:10]}...{BOT_TOKEN[-5:]}")
    print(f"🌐 WebApp URL: {webapp_url}")
    print("=" * 60)

    # 1. Get bot info
    me = api_call("getMe")
    if not me.get("ok"):
        print(f"[-] Failed to authenticate bot: {me}", file=sys.stderr)
        return
    bot_user = me["result"]
    print(f"[+] Bot authenticated: @{bot_user.get('username')} ({bot_user.get('first_name')})")

    # 2. Setup commands & menu button
    set_bot_commands()
    set_menu_button(webapp_url)

    offset = 0
    print("[+] Bot polling started. Listening for updates...")

    while True:
        try:
            updates = api_call("getUpdates", {"offset": offset, "timeout": 25})
            if not updates.get("ok"):
                time.sleep(3)
                continue

            for update in updates.get("result", []):
                offset = update["update_id"] + 1

                message = update.get("message")
                if not message:
                    continue

                chat_id = message["chat"]["id"]
                user_info = message.get("from", {})
                text = (message.get("text") or "").strip()

                # Check for WebApp data
                if "web_app_data" in message:
                    raw_data = message["web_app_data"].get("data", "")
                    print(f"[+] Received web_app_data from chat {chat_id}: {raw_data[:80]}...")
                    handle_web_app_data(chat_id, raw_data)
                    continue

                if text.startswith("/start"):
                    print(f"[+] /start from @{user_info.get('username', 'anonymous')} ({chat_id})")
                    handle_start(chat_id, user_info, webapp_url)
                elif text.startswith("/shop"):
                    handle_start(chat_id, user_info, webapp_url)
                elif text.startswith("/help"):
                    handle_help(chat_id, webapp_url)
                else:
                    handle_start(chat_id, user_info, webapp_url)

        except KeyboardInterrupt:
            print("\n[*] Bot stopped by user.")
            break
        except Exception as err:
            print(f"[-] Loop error: {err}", file=sys.stderr)
            time.sleep(2)


if __name__ == "__main__":
    url = DEFAULT_WEBAPP_URL
    if len(sys.argv) > 1:
        url = sys.argv[1]
    run_bot(url)
