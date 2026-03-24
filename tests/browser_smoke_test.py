from __future__ import annotations

import contextlib
import http.server
import socketserver
import sys
import threading
from pathlib import Path

try:
    from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
    from playwright.sync_api import sync_playwright
except ImportError as exc:  # pragma: no cover - developer guidance path
    raise SystemExit(
        "Playwright is not installed. Run: python -m pip install -r requirements-dev.txt"
    ) from exc


ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = ROOT / "tests" / "artifacts"
BROWSER_CANDIDATES = [
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files\Google\Chrome Dev\Application\chrome.exe"),
]

CHATBOT_CASES = [
    ("Hi", ["skills", "projects", "contact"]),
    ("What are your skills?", ["python", "sql", "backend"]),
    ("What email should I use?", ["alam22205341122@diu.edu.bd", "secondary"]),
    ("What is his phone number?", ["+8801610772313", "whatsapp"]),
    ("Can I see the resume?", ["resume", "pdf"]),
    ("Where is he based?", ["dhaka", "ashulia"]),
    ("Can you write code for me?", ["specifically trained", "portfolio"]),
    ("Can you write Python code for me?", ["specifically trained", "portfolio"]),
]


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        return


def find_browser_path() -> Path:
    for candidate in BROWSER_CANDIDATES:
        if candidate.exists():
            return candidate

    raise FileNotFoundError(
        "No supported local browser was found. Install Microsoft Edge or Google Chrome."
    )


def assert_contains(actual_text: str, expected_snippets: list[str], label: str) -> None:
    actual_normalized = actual_text.lower()
    missing = [snippet for snippet in expected_snippets if snippet.lower() not in actual_normalized]

    if missing:
        raise AssertionError(f"{label} is missing expected text: {missing}\nActual: {actual_text}")


def ask_chatbot(page, question: str) -> str:
    bot_messages = page.locator(".chatbot-message--bot")
    previous_count = bot_messages.count()
    page.locator("#chatbot-input").fill(question)
    page.locator("#chatbot-form button[type='submit']").click()
    page.wait_for_function(
        """expectedCount => {
            const typingCount = document.querySelectorAll('.chatbot-message--typing').length;
            const botCount = document.querySelectorAll('.chatbot-message--bot').length;
            return typingCount === 0 && botCount >= expectedCount;
        }""",
        arg=previous_count + 1,
        timeout=8000,
    )
    return bot_messages.nth(bot_messages.count() - 1).inner_text().strip()


def run() -> int:
    browser_path = find_browser_path()
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    with ReusableTCPServer(("127.0.0.1", 0), QuietHandler) as server:
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()

        try:
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(
                    headless=True,
                    executable_path=str(browser_path),
                )
                page = browser.new_page(viewport={"width": 1440, "height": 1200})

                try:
                    page.goto(f"http://127.0.0.1:{port}/", wait_until="networkidle", timeout=120000)

                    title = page.title()
                    assert "Farhan Alam" in title, f"Unexpected page title: {title}"
                    print(f"PASS title: {title}")

                    theme_before = page.locator("html").get_attribute("data-theme")
                    page.locator(".theme-toggle").click()
                    page.wait_for_timeout(250)
                    theme_after = page.locator("html").get_attribute("data-theme")
                    assert theme_before != theme_after, "Theme toggle did not change the theme."
                    print(f"PASS theme toggle: {theme_before} -> {theme_after}")

                    scroll_before = page.evaluate("() => window.scrollY")
                    page.locator(".nav-link--cta").click()
                    page.wait_for_timeout(900)
                    scroll_after = page.evaluate("() => window.scrollY")
                    assert scroll_after > scroll_before + 100, "Hire Me CTA did not scroll down the page."
                    print(f"PASS hire me CTA scroll: {scroll_before:.0f} -> {scroll_after:.0f}")

                    map_note = page.locator("#map-fallback-note").inner_text().strip()
                    assert "Interactive map ready" in map_note, f"Map did not initialize: {map_note}"
                    print(f"PASS map load: {map_note}")

                    page.locator("#chatbot-launcher").click()
                    page.wait_for_selector("#chatbot-panel.is-open", timeout=4000)
                    greeting = page.locator(".chatbot-message--bot").first.inner_text().strip()
                    assert "portfolio assistant" in greeting.lower(), "Chatbot greeting did not render."
                    print("PASS chatbot panel open")

                    for question, expected_snippets in CHATBOT_CASES:
                        reply = ask_chatbot(page, question)
                        assert_contains(reply, expected_snippets, f"Chatbot reply for '{question}'")
                        print(f"PASS chatbot: {question}")

                except (AssertionError, PlaywrightTimeoutError):
                    page.screenshot(path=str(ARTIFACTS_DIR / "portfolio-smoke-failure.png"), full_page=True)
                    raise
                finally:
                    browser.close()
        finally:
            server.shutdown()
            thread.join(timeout=3)

    return 0


if __name__ == "__main__":
    with contextlib.suppress(KeyboardInterrupt):
        raise SystemExit(run())
