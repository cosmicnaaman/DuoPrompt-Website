import { test, expect } from "@playwright/test";

test("landing page, navigation, FAQs, and studio entry work without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/DuoPrompt/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your words.",
  );
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "FAQs" })
    .click();
  await page
    .getByRole("button", { name: "Where are my scripts saved?" })
    .click();
  await expect(
    page.getByRole("region", { name: "Where are my scripts saved?" }),
  ).toContainText("stored locally");
  await page
    .getByRole("button", { name: "Find your flow", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Find your flow", exact: true }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test("script editing persists, playback progresses and pauses, controls and export work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Find your flow", exact: true })
    .click();
  const editor = page.getByLabel("Your script", { exact: false });
  await editor.fill(
    "A fresh idea.\n\n" +
      "This is your moment to share your story. ".repeat(35),
  );
  await page.getByLabel("Reading speed").fill("180");
  await page.getByLabel("Text size").fill("44");
  await page.getByRole("button", { name: "Mirror text" }).click();
  await expect(page.locator(".reader-text")).toHaveClass(/mirrored/);
  await page.getByRole("button", { name: "Play teleprompter" }).click();
  await expect
    .poll(() =>
      page.locator(".reader-scroll").evaluate((element) => element.scrollTop),
    )
    .toBeGreaterThan(10);
  await expect
    .poll(() => page.locator(".reader-time").textContent())
    .not.toBe("00:00");
  await page.getByRole("button", { name: "Pause teleprompter" }).click();
  const pausedPosition = await page
    .locator(".reader-scroll")
    .evaluate((element) => element.scrollTop);
  await page.waitForTimeout(300);
  expect(
    await page
      .locator(".reader-scroll")
      .evaluate((element) => element.scrollTop),
  ).toBe(pausedPosition);
  await page.getByRole("button", { name: "Restart script" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  expect(
    await page
      .locator(".reader-scroll")
      .evaluate((element) => element.scrollTop),
  ).toBe(0);
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("duoprompt-script.txt");
  await page.reload();
  await page
    .getByRole("button", { name: "Find your flow", exact: true })
    .click();
  await expect(page.getByLabel("Your script", { exact: false })).toHaveValue(
    /A fresh idea/,
  );
});

test("file import, empty script validation and keyboard playback work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Find your flow", exact: true })
    .click();
  await page.locator("input[type=file]").setInputFiles({
    name: "hello.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(
      "A new story.\n\n" + "Your ideas deserve to be heard. ".repeat(20),
    ),
  });
  await expect(page.getByLabel("Your script", { exact: false })).toHaveValue(
    /A new story/,
  );
  await page.getByLabel("Teleprompter script", { exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Pause teleprompter" }),
  ).toBeVisible();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Play teleprompter" }),
  ).toBeVisible();
  await page.getByLabel("Your script", { exact: false }).fill("");
  await page.getByRole("button", { name: "Play teleprompter" }).click();
  await expect(page.getByRole("status")).toContainText("Add a few words");
});

test("mobile navigation and studio fit a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "How it works" })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page
    .getByRole("button", { name: "Find your flow", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(async () => (await dialog.boundingBox())?.width).toBe(390);
  await page.getByRole("button", { name: "Play teleprompter" }).click();
  await expect
    .poll(() =>
      page.locator(".reader-scroll").evaluate((element) => element.scrollTop),
    )
    .toBeGreaterThan(5);
  await page.getByRole("button", { name: "Close studio" }).click();
  await expect(dialog).toHaveCount(0);
});
