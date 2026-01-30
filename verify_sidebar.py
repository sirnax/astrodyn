from playwright.sync_api import sync_playwright, expect

def test_sidebar_toggle(page):
    print("Navigating to home page...")
    page.goto("http://localhost:3000")

    print("Waiting for page content...")
    expect(page.get_by_role("heading", name="Astrodynamics Playground")).to_be_visible(timeout=30000)

    print("Taking initial screenshot (sidebar open)...")
    page.screenshot(path="verification_initial.png")

    # Locate toggle button
    # The button has aria-label="Toggle sidebar"
    toggle_btn = page.get_by_label("Toggle sidebar")

    print("Collapsing sidebar...")
    toggle_btn.click()

    # Wait a bit for animation
    page.wait_for_timeout(1000)

    print("Taking screenshot (sidebar collapsed)...")
    page.screenshot(path="verification_collapsed.png")

    print("Expanding sidebar...")
    toggle_btn.click()

    # Wait a bit for animation
    page.wait_for_timeout(1000)

    print("Taking screenshot (sidebar expanded again)...")
    page.screenshot(path="verification_expanded.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to simulate desktop
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        try:
            test_sidebar_toggle(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"Verification script failed: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()
