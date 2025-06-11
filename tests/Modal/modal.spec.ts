import { test, expect } from '@playwright/test'

// This test assumes you have a Modal component with a trigger button that uses aria-controls
// and that the Modal renders with an id matching the aria-controls value when open.

test('Modal trigger aria-controls matches modal id', async ({ page }) => {
  // Go to the page where the Modal component is rendered
  // Adjust the URL if you have a dedicated storybook or test page for Modal
  await page.goto(
    'http://localhost:6006/iframe.html?args=&globals=&id=components-modal--with-trigger-prop&viewMode=story'
  ) // Change to your Modal story/test page if needed

  // Find the trigger button for the modal
  const trigger = await page.getByRole('button', { name: /open modal/i })
  const ariaControls = await trigger.getAttribute('aria-controls')
  expect(ariaControls).toBeTruthy()

  // Click the trigger to open the modal
  await trigger.click()

  // Wait for the modal to appear
  const modal = page.locator(`#${ariaControls}`)
  await expect(modal).toBeVisible()

  // Check that the modal's id matches the aria-controls value
  const modalId = await modal.getAttribute('id')
  expect(modalId).toBe(ariaControls)
})
