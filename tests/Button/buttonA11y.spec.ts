import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

const storyUrls = [
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--default&viewMode=story',
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--disabled&viewMode=story',
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--loading&viewMode=story',
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--large-button&viewMode=story',
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--icon-after&viewMode=story',
  'http://localhost:6006/iframe.html?globals=&args=&id=components-button--full-width-button&viewMode=story',
  'http://localhost:6006/iframe.html?args=&globals=&id=components-button--small-button&viewMode=story',
  'http://localhost:6006/iframe.html?args=&globals=&id=components-button--outline-button&viewMode=story',
  'http://localhost:6006/iframe.html?args=&globals=&id=components-button--danger-button&viewMode=story',
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
