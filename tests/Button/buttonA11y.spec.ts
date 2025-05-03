import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

const storyUrls = [
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--default&viewMode=story',
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--disabled&viewMode=story',
]

for (const url of storyUrls) {
  test.describe(`Accessibility test: ${url}`, () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto(url)

      const results = await new AxeBuilder({ page })
        .disableRules(['page-has-heading-one', 'landmark-one-main'])
        .analyze()

      for (const v of results.violations) {
        console.warn(`[${v.impact}] ${v.help} — ${v.helpUrl}`)
      }

      expect(results.violations).toEqual([])
    })
  })
}
