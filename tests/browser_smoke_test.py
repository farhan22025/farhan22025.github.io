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
    ("Give me a recruiter summary of Farhan.", ["projects", "resume", "backend"]),
    ("Which projects prove Farhan's backend skills?", ["smart waste", "banking", "coffee shop"]),
    ("Is he available for freelance work?", ["hire me", "projects", "contact"]),
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


def ask_chatbot(page, question: str):
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
    return bot_messages.nth(bot_messages.count() - 1)


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
                page.add_init_script(
                    """() => {
                        localStorage.removeItem('farhan-chatbot-scale');
                    }"""
                )

                try:
                    page.goto(f"http://127.0.0.1:{port}/", wait_until="networkidle", timeout=120000)

                    title = page.title()
                    assert "Farhan Alam" in title, f"Unexpected page title: {title}"
                    print(f"PASS title: {title}")

                    brand_src = page.locator(".brand-avatar").get_attribute("src")
                    assert brand_src and "farhan-profile.png" in brand_src, (
                        f"Brand avatar is missing the real profile photo: {brand_src}"
                    )
                    print("PASS brand avatar uses profile photo")

                    cta_before = page.locator(".nav-link--cta").evaluate(
                        "el => getComputedStyle(el).transform"
                    )
                    page.locator(".nav-link--cta").hover()
                    page.wait_for_timeout(180)
                    cta_after = page.locator(".nav-link--cta").evaluate(
                        "el => getComputedStyle(el).transform"
                    )
                    assert cta_before != cta_after, "Hire Me CTA hover animation did not change styles."
                    print("PASS hire me CTA hover animation")

                    theme_icon_before = page.locator(".theme-toggle__icon").evaluate(
                        "el => getComputedStyle(el).transform"
                    )
                    page.locator(".theme-toggle").hover()
                    page.wait_for_timeout(180)
                    theme_icon_after = page.locator(".theme-toggle__icon").evaluate(
                        "el => getComputedStyle(el).transform"
                    )
                    assert (
                        theme_icon_before != theme_icon_after
                    ), "Theme toggle hover animation did not change icon styles."
                    print("PASS theme toggle hover animation")

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
                    assert "ai portfolio assistant" in greeting.lower(), "Chatbot greeting did not render."
                    print("PASS chatbot panel open")

                    launcher_avatar_count = page.locator(".chatbot-launcher__avatar").count()
                    assert launcher_avatar_count == 2, (
                        f"Expected 2 launcher avatars, found {launcher_avatar_count}"
                    )
                    print("PASS chatbot launcher avatars")

                    prompt_groups_fit = page.locator("#chatbot-prompt-groups").evaluate(
                        "el => el.scrollWidth <= el.clientWidth + 1"
                    )
                    assert prompt_groups_fit, "Starter prompt cards are overflowing horizontally."
                    print("PASS chatbot prompt layout")

                    scale_before = page.locator(".chatbot-shell").get_attribute("data-chat-scale")
                    panel_width_before = page.locator("#chatbot-panel").bounding_box()["width"]
                    page.locator("#chatbot-scale-up").click()
                    page.wait_for_timeout(220)
                    scale_after_up = page.locator(".chatbot-shell").get_attribute("data-chat-scale")
                    panel_width_after_up = page.locator("#chatbot-panel").bounding_box()["width"]
                    assert scale_after_up == "comfortable", (
                        f"Expected comfortable scale after A+, got {scale_after_up}"
                    )
                    assert panel_width_after_up > panel_width_before + 5, (
                        "Chatbot panel did not grow after pressing A+."
                    )
                    page.locator("#chatbot-scale-down").click()
                    page.locator("#chatbot-scale-down").click()
                    page.wait_for_timeout(220)
                    scale_after_down = page.locator(".chatbot-shell").get_attribute("data-chat-scale")
                    panel_width_after_down = page.locator("#chatbot-panel").bounding_box()["width"]
                    assert scale_before == "default", f"Unexpected starting chat scale: {scale_before}"
                    assert scale_after_down == "compact", (
                        f"Expected compact scale after A- twice, got {scale_after_down}"
                    )
                    assert panel_width_after_down < panel_width_before - 5, (
                        "Chatbot panel did not shrink after pressing A-."
                    )
                    page.locator("#chatbot-scale-up").click()
                    page.wait_for_timeout(220)
                    print("PASS chatbot scaling controls")

                    page.locator("#chatbot-clear").click()
                    page.wait_for_timeout(350)
                    message_count_after_clear = page.locator(".chatbot-message--bot").count()
                    assert message_count_after_clear >= 1, "Chatbot clear did not reseed the greeting."
                    print("PASS chatbot clear action")

                    prompt_count_before = page.locator(".chatbot-message--bot").count()
                    page.locator(".chatbot-prompt-card").first.click()
                    page.wait_for_function(
                        """expectedCount => {
                            const typingCount = document.querySelectorAll('.chatbot-message--typing').length;
                            const botCount = document.querySelectorAll('.chatbot-message--bot').length;
                            return typingCount === 0 && botCount >= expectedCount;
                        }""",
                        arg=prompt_count_before + 1,
                        timeout=8000,
                    )
                    prompt_reply = page.locator(".chatbot-message--bot").last.inner_text().strip()
                    assert_contains(prompt_reply, ["projects", "resume", "backend"], "Starter prompt reply")
                    print("PASS chatbot starter prompt click")

                    suggestion_count_before = page.locator(".chatbot-message--bot").count()
                    page.locator(".chatbot-suggestion").first.click()
                    page.wait_for_function(
                        """expectedCount => {
                            const typingCount = document.querySelectorAll('.chatbot-message--typing').length;
                            const botCount = document.querySelectorAll('.chatbot-message--bot').length;
                            return typingCount === 0 && botCount >= expectedCount;
                        }""",
                        arg=suggestion_count_before + 1,
                        timeout=8000,
                    )
                    suggestion_reply = page.locator(".chatbot-message--bot").last.inner_text().strip()
                    assert_contains(suggestion_reply, ["smart waste", "coffee shop", "deepfake"], "Quick reply click")
                    print("PASS chatbot quick reply click")

                    for question, expected_snippets in CHATBOT_CASES:
                        reply_locator = ask_chatbot(page, question)
                        reply = reply_locator.inner_text().strip()
                        assert_contains(reply, expected_snippets, f"Chatbot reply for '{question}'")
                        print(f"PASS chatbot: {question}")

                    showcase_reply = ask_chatbot(page, "Show me Farhan's best projects.")
                    showcase_avatar = showcase_reply.locator(".chatbot-message__avatar").get_attribute(
                        "src"
                    )
                    assert showcase_avatar and "chatbot-avatar-showcase" in showcase_avatar, (
                        f"Expected showcase avatar for project highlights, got {showcase_avatar}"
                    )
                    print("PASS chatbot showcase persona")

                    formal_reply = ask_chatbot(page, "What email should I use?")
                    formal_avatar = formal_reply.locator(".chatbot-message__avatar").get_attribute(
                        "src"
                    )
                    assert formal_avatar and "chatbot-avatar-formal" in formal_avatar, (
                        f"Expected formal avatar for contact guidance, got {formal_avatar}"
                    )
                    print("PASS chatbot formal persona")

                    mobile = browser.new_page(viewport={"width": 390, "height": 844})
                    mobile.goto(f"http://127.0.0.1:{port}/", wait_until="networkidle", timeout=120000)
                    launcher_box = mobile.locator("#chatbot-launcher").bounding_box()
                    launcher_width = launcher_box["width"]
                    launcher_y = launcher_box["y"]
                    teaser_visible = mobile.locator("#chatbot-teaser").is_visible()
                    assert launcher_width < 90, f"Mobile launcher is still too wide: {launcher_width}"
                    assert launcher_y > 700, f"Mobile launcher should stay near the bottom-right, got y={launcher_y}"
                    assert not teaser_visible, "Chatbot teaser should stay hidden on mobile."
                    print("PASS mobile chatbot restraint")
                    mobile.close()

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
