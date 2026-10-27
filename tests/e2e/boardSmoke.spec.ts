import { expect, type Locator, type Page, test } from "@playwright/test";

const uniqueSuffix = Date.now().toString(36);
const username = `smoke_${uniqueSuffix}`;

async function registerNewUser(page: Page) {
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Smoke Tester");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Email").fill(`${username}@example.test`);
  await page.getByLabel("Password").fill("smoke-test-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/projects$/);
}

// dnd-kit needs intermediate pointer moves before it activates a drag.
async function dragByMouse(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("Drag source or target is not visible");
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 20, { steps: 15 });
  await page.mouse.up();
}

async function createProject(page: Page, projectName: string) {
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill(projectName);
  await page.getByRole("button", { name: "Create project" }).click();
  await page.getByRole("link", { name: new RegExp(projectName) }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
}

test("a new user can plan work on a board and the order survives a reload", async ({ page }) => {
  await registerNewUser(page);
  await createProject(page, `Smoke project ${uniqueSuffix}`);

  const todoColumn = page.getByRole("region", { name: "To Do column" });
  await todoColumn.getByRole("button", { name: "+ Add task" }).click();
  await todoColumn.getByPlaceholder("What needs to be done?").fill("Ship the smoke test");
  await todoColumn.getByRole("button", { name: "Add", exact: true }).click();
  await expect(todoColumn.getByText("Ship the smoke test")).toBeVisible();

  await todoColumn.getByRole("button", { name: "Ship the smoke test" }).click();
  await page.getByPlaceholder(/Write a comment/).fill("Looks good to me");
  await page.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(page.getByText("Looks good to me")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();

  const card = todoColumn.getByRole("button", { name: /Ship the smoke test/ }).first();
  const inProgressColumn = page.getByRole("region", { name: "In Progress column" });
  await dragByMouse(page, card, inProgressColumn.getByRole("list"));
  await expect(inProgressColumn.getByText("Ship the smoke test")).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("region", { name: "In Progress column" }).getByText("Ship the smoke test"),
  ).toBeVisible();
});
