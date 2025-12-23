import { Page, expect } from '@playwright/test';

/**
 * Clear localStorage to ensure test isolation
 * Note: Must be called after navigating to a page (not on about:blank)
 */
export async function clearLocalStorage(page: Page): Promise<void> {
	try {
		// Check if we're on a valid page with localStorage access
		const url = page.url();
		if (url && url !== 'about:blank') {
			await page.evaluate(() => {
				if (typeof window !== 'undefined' && window.localStorage) {
					localStorage.clear();
				}
			});
		}
	} catch (error) {
		// If localStorage is not accessible, that's okay - we'll clear it after navigation
	}
}

/**
 * Wait for experiment screen to be visible
 */
export async function waitForExperimentScreen(
	page: Page,
	screen: 'instructions' | 'trial' | 'debrief'
): Promise<void> {
	switch (screen) {
		case 'instructions':
			await expect(page.locator('h1.instructions-title')).toBeVisible({ timeout: 10000 });
			break;
		case 'trial':
			// Wait for either lottery cards (MCMC) or slider (GSP)
			await Promise.race([
				expect(page.locator('.lottery-comparison')).toBeVisible({ timeout: 15000 }),
				expect(page.locator('.slider-section')).toBeVisible({ timeout: 15000 }),
			]);
			break;
		case 'debrief':
			await expect(page.locator('h1.debrief-title')).toBeVisible({ timeout: 10000 });
			break;
	}
}

/**
 * Wait for loading spinner to disappear
 */
export async function waitForLoadingToComplete(page: Page): Promise<void> {
	await expect(page.locator('.loading-spinner, .loading-container')).not.toBeVisible({
		timeout: 30000,
	});
}

/**
 * Get experiment configuration from the page
 */
export async function getExperimentConfig(page: Page): Promise<{
	title: string;
	description: string;
	slug: string;
}> {
	const title = await page.locator('h1').first().textContent();
	const description = await page.locator('.experiment-description, .instructions-section p').first().textContent();
	const url = page.url();
	const slug = url.split('/experiments/')[1]?.split('/')[0] || '';

	return {
		title: title || '',
		description: description || '',
		slug,
	};
}

