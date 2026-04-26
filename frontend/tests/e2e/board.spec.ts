import { test, expect, Page, Locator } from '@playwright/test'

async function dragTo(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox()
  const targetBox = await target.boundingBox()
  if (!sourceBox || !targetBox) throw new Error('Could not get bounding boxes for drag')

  const sx = sourceBox.x + sourceBox.width / 2
  const sy = sourceBox.y + sourceBox.height / 2
  const tx = targetBox.x + targetBox.width / 2
  const ty = targetBox.y + targetBox.height / 2

  await page.mouse.move(sx, sy)
  await page.mouse.down()
  await page.mouse.move(sx + 5, sy + 5, { steps: 3 })
  await page.mouse.move(tx, ty, { steps: 20 })
  await page.waitForTimeout(100)
  await page.mouse.up()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="column"]')
})

test('page loads with 5 columns and at least 10 cards', async ({ page }) => {
  const columns = page.locator('[data-testid="column"]')
  await expect(columns).toHaveCount(5)
  const cards = page.locator('[data-testid="card"]')
  expect(await cards.count()).toBeGreaterThanOrEqual(10)
})

test('rename column by clicking heading, typing, pressing Enter', async ({ page }) => {
  const columnName = page.locator('[data-testid="column-name"]').first()
  await columnName.click()
  const input = page.locator('[data-testid="column-rename-input"]').first()
  await input.fill('Sprint 1')
  await input.press('Enter')
  await expect(page.locator('[data-testid="column-name"]').first()).toHaveText('Sprint 1')
})

test('rename column cancel with Escape restores original name', async ({ page }) => {
  const columnName = page.locator('[data-testid="column-name"]').first()
  const originalName = await columnName.textContent()
  await columnName.click()
  const input = page.locator('[data-testid="column-rename-input"]').first()
  await input.fill('garbage')
  await input.press('Escape')
  await expect(page.locator('[data-testid="column-name"]').first()).toHaveText(originalName ?? '')
})

test('add card to column 3', async ({ page }) => {
  const column3 = page.locator('[data-testid="column"]').nth(2)
  const addBtn = column3.getByText('+ Add card')
  await addBtn.click()
  await column3.getByPlaceholder('Card title').fill('New task')
  await column3.getByRole('button', { name: 'Save' }).click()
  await expect(column3.getByText('New task')).toBeVisible()
})

test('add card with empty title is rejected', async ({ page }) => {
  const column3 = page.locator('[data-testid="column"]').nth(2)
  const countBefore = await column3.locator('[data-testid="card"]').count()
  await column3.getByText('+ Add card').click()
  await column3.getByRole('button', { name: 'Save' }).click()
  const countAfter = await column3.locator('[data-testid="card"]').count()
  expect(countAfter).toBe(countBefore)
})

test('clicking a card opens the modal with card title', async ({ page }) => {
  const firstCard = page.locator('[data-testid="card"]').first()
  const cardTitle = await firstCard.locator('p').first().textContent()
  await firstCard.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const titleInput = page.getByRole('dialog').locator('input').first()
  await expect(titleInput).toHaveValue(cardTitle ?? '')
})

test('editing card title in modal persists to board on close', async ({ page }) => {
  const firstCard = page.locator('[data-testid="card"]').first()
  await firstCard.click()
  const dialog = page.getByRole('dialog')
  const titleInput = dialog.locator('input').first()
  await titleInput.fill('Updated title')
  await dialog.getByRole('button', { name: 'Save & Close' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.locator('[data-testid="card"]').first().locator('p').first()).toHaveText('Updated title')
})

test('delete card via modal removes it from board', async ({ page }) => {
  const firstCard = page.locator('[data-testid="card"]').first()
  const cardTitle = await firstCard.locator('p').first().textContent()
  await firstCard.click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByText(cardTitle ?? '')).not.toBeVisible()
})

test('Escape key closes modal', async ({ page }) => {
  await page.locator('[data-testid="card"]').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('card count badge increments after adding a card', async ({ page }) => {
  const column1 = page.locator('[data-testid="column"]').first()
  const badge = column1.locator('[data-testid="card-count"]')
  const countBefore = parseInt(await badge.textContent() ?? '0')
  await column1.getByText('+ Add card').click()
  await column1.getByPlaceholder('Card title').fill('Badge test card')
  await column1.getByRole('button', { name: 'Save' }).click()
  await expect(badge).toHaveText(String(countBefore + 1))
})

test('drag card from column 1 to column 2', async ({ page }) => {
  const col1 = page.locator('[data-testid="column"]').nth(0)
  const col2 = page.locator('[data-testid="column"]').nth(1)

  const col1CountBefore = parseInt(await col1.locator('[data-testid="card-count"]').textContent() ?? '0')
  const col2CountBefore = parseInt(await col2.locator('[data-testid="card-count"]').textContent() ?? '0')

  const sourceCard = col1.locator('[data-testid="card"]').first()
  await dragTo(page, sourceCard, col2)

  await expect(col1.locator('[data-testid="card-count"]')).toHaveText(String(col1CountBefore - 1))
  await expect(col2.locator('[data-testid="card-count"]')).toHaveText(String(col2CountBefore + 1))
})
