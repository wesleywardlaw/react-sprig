import { test, expect, type Locator, type Page } from '@playwright/test'

const STORYBOOK_URL =
  'http://localhost:6006/iframe.html?globals=&args=&id=components-sortablecontainer--basic&viewMode=story'

// Helper function to perform granular drag and drop
async function dragAndDrop(
  page: Page,
  sourceLocator: Locator,
  targetLocator: Locator,
  options?: { steps?: number }
) {
  const sourceBox = await sourceLocator.boundingBox()
  const targetBox = await targetLocator.boundingBox()

  expect(sourceBox).not.toBeNull()
  expect(targetBox).not.toBeNull()

  // Calculate center points for drag/drop
  const startX = sourceBox!.x + sourceBox!.width / 2
  const startY = sourceBox!.y + sourceBox!.height / 2
  const endX = targetBox!.x + targetBox!.width / 2
  const endY = targetBox!.y + targetBox!.height / 2

  // Perform the drag and drop using granular mouse actions
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(endX, endY, { steps: options?.steps || 20 }) // Default steps to 20
  await page.mouse.up()
}

test.describe('SortableContainer - Granular Mouse Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-sortablecontainer--basic`)
    await page.waitForSelector('[data-testid^="sortable-item-"]')
  })

  test('should reorder items correctly when dragging "Item A" (item-0) to "Item C" (item-2)', async ({
    page,
  }) => {
    const initialOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()
    expect(initialOrder).toEqual(['Item A', 'Item B', 'Item C'])
    const itemA = page.getByTestId('sortable-item-item-0')
    const itemC = page.getByTestId('sortable-item-item-2')

    await dragAndDrop(page, itemA, itemC)

    const finalOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()

    expect(finalOrder).toEqual(['Item B', 'Item C', 'Item A'])
  })

  test('should reorder items correctly when dragging "Item C" (item-2) to "Item A" (item-0)', async ({
    page,
  }) => {
    const initialOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()
    expect(initialOrder).toEqual(['Item A', 'Item B', 'Item C'])

    const itemC = page.getByTestId('sortable-item-item-2')
    const itemA = page.getByTestId('sortable-item-item-0')

    await dragAndDrop(page, itemC, itemA)

    const finalOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()

    expect(finalOrder).toEqual(['Item C', 'Item A', 'Item B'])
  })

  test('should reorder items correctly when dragging "Item B" (item-1) to "Item A" (item-0)', async ({
    page,
  }) => {
    const initialOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()
    expect(initialOrder).toEqual(['Item A', 'Item B', 'Item C'])

    const itemB = page.getByTestId('sortable-item-item-1')
    const itemA = page.getByTestId('sortable-item-item-0')

    await dragAndDrop(page, itemB, itemA)

    const finalOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()

    expect(finalOrder).toEqual(['Item B', 'Item A', 'Item C'])
  })

  test('should reorder items correctly when dragging "Item A" (item-0) to "Item B" (item-1)', async ({
    page,
  }) => {
    const initialOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()
    expect(initialOrder).toEqual(['Item A', 'Item B', 'Item C'])

    const itemA = page.getByTestId('sortable-item-item-0')
    const itemB = page.getByTestId('sortable-item-item-1')

    await dragAndDrop(page, itemA, itemB)

    const finalOrder = await page.locator('[data-testid^="sortable-item-"]').allTextContents()

    expect(finalOrder).toEqual(['Item B', 'Item A', 'Item C'])
  })
})
