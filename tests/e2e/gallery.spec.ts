import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark'])
  test(`gallery interaction and accessibility: ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Appearance').selectOption(theme);
    await page.getByLabel('Example user').selectOption('joanne');
    await expect(page.getByLabel('Destination *')).toHaveValue('Ozark Mountains');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByText(/Your 3-day trip/)).toBeVisible();
    await page.getByLabel('Example user').selectOption('alex');
    await expect(page.getByText(/Your 3-day trip/)).toHaveCount(0);
    await expect(page.getByLabel('Destination *')).toHaveValue('Scottish Highlands');
    await expect(page.locator('body')).toHaveJSProperty(
      'scrollWidth',
      await page.evaluate(() => document.body.clientWidth),
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

test('generative thread changes composition and clears user context', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Example user').selectOption('joanne');
  await page.getByRole('button', { name: 'Open generative example', exact: true }).click();
  const thread = page.locator('#generative-thread');
  await expect(thread.getByText('Hello Joanne. Plan an escape from Arkansas.')).toBeVisible();
  await thread.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(thread.getByText(/Your 3-day trip to Ozark Mountains/)).toBeVisible();
  await expect(thread.getByRole('heading', { name: 'Make a packing list' })).toBeVisible();
  await page.getByLabel('Example user').selectOption('alex');
  await expect(thread.getByText(/Your 3-day trip/)).toHaveCount(0);
  await expect(thread.getByText('Hello Alex. Plan an escape from London.')).toBeVisible();
});

test('agent perspective preserves submitted results and exposes semantic sections', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Example user').selectOption('joanne');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText(/Your 3-day trip/)).toBeVisible();
  await page.getByLabel('View', { exact: true }).selectOption('agent');
  await expect(page.locator('#agent-overview pre')).toContainText('Your 3-day trip to Ozark Mountains');
  await expect(page.locator('#approval pre')).toContainText('darwinui-agent-v1');
  await expect(page.locator('#threads pre')).toContainText('Weekend escape');
  await page.getByLabel('View', { exact: true }).selectOption('human');
  await expect(page.getByText(/Your 3-day trip/)).toBeVisible();
});
