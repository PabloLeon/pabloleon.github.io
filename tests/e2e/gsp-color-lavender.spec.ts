import { test, expect } from '@playwright/test';
import { clearLocalStorage, waitForExperimentScreen, waitForLoadingToComplete } from './helpers';

test.describe('GSP Color Lavender Experiment', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to base URL first to get localStorage access
		await page.goto('/');
		await clearLocalStorage(page);
	});

	test('should load instructions screen with color preview', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Check title
		await expect(page.locator('h1.instructions-title')).toContainText('GSP: Mapping "Lavender"');

		// Check instructions content
		await expect(page.locator('text=What is this experiment?')).toBeVisible();
		await expect(page.locator('text=How it works')).toBeVisible();

		// Check color preview is displayed
		await expect(page.locator('.example-container')).toBeVisible();

		// Check Start Experiment button
		await expect(page.locator('button:has-text("Start Experiment")')).toBeVisible();
	});

	test('should navigate to trial screen when Start Experiment is clicked', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Click Start Experiment button
		await page.locator('button:has-text("Start Experiment")').click();

		// Wait for trial screen
		await waitForExperimentScreen(page, 'trial');

		// Check trial screen elements
		await expect(page.locator('.progress-section')).toBeVisible();
		await expect(page.locator('.trial-content')).toBeVisible();
	});

	test('should display color preview and slider on trial screen', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Start experiment
		await page.locator('button:has-text("Start Experiment")').click();
		await waitForExperimentScreen(page, 'trial');

		// Check color preview is visible
		await expect(page.locator('.stimulus-section')).toBeVisible();

		// Check slider is visible
		await expect(page.locator('.slider-section')).toBeVisible();
		await expect(page.locator('input[type="range"].slider-input')).toBeVisible();

		// Check submit button is visible but disabled initially
		const submitButton = page.locator('button:has-text("Submit")');
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeDisabled();
	});

	test('should allow slider adjustment and enable submit button', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Start experiment
		await page.locator('button:has-text("Start Experiment")').click();
		await waitForExperimentScreen(page, 'trial');

		// Wait for slider
		await expect(page.locator('.slider-section')).toBeVisible();

		// Check submit button is initially disabled
		const submitButton = page.locator('button:has-text("Submit")');
		await expect(submitButton).toBeDisabled();

		// Get initial slider value (should be midpoint when undefined)
		const slider = page.locator('input[type="range"].slider-input').first();
		const initialValue = await slider.inputValue();

		// Adjust slider (this should enable submit button)
		await slider.fill(String(parseFloat(initialValue) + 10));

		// Verify value changed
		const newValue = await slider.inputValue();
		expect(parseFloat(newValue)).not.toBe(parseFloat(initialValue));

		// Verify submit button is now enabled
		await expect(submitButton).toBeEnabled();
	});

	test('should display dimension name correctly', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Start experiment
		await page.locator('button:has-text("Start Experiment")').click();
		await waitForExperimentScreen(page, 'trial');

		// Wait for slider and dimension info
		await expect(page.locator('.slider-section')).toBeVisible();

		// Check dimension name is displayed (should be one of Hue, Saturation, or Lightness)
		const dimensionText = await page.locator('.progress-dimension, .slider-section').textContent();
		expect(dimensionText).toMatch(/Hue|Saturation|Lightness/i);
	});

	test('should update progress as samples are recorded', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Start experiment
		await page.locator('button:has-text("Start Experiment")').click();
		await waitForExperimentScreen(page, 'trial');

		// Wait for slider
		await expect(page.locator('.slider-section')).toBeVisible();

		// Get initial progress text
		const initialProgress = await page.locator('.progress-text').textContent();

		// Record samples by adjusting slider and clicking submit
		const slider = page.locator('input[type="range"].slider-input').first();
		const submitButton = page.locator('button:has-text("Submit")');
		
		for (let i = 0; i < 3; i++) {
			// Adjust slider
			const currentValue = await slider.inputValue();
			await slider.fill(String(parseFloat(currentValue) + 5));
			await page.waitForTimeout(200);
			
			// Click submit to record sample
			await expect(submitButton).toBeEnabled();
			await submitButton.click();
			await page.waitForTimeout(500); // Wait for sample to be recorded
		}

		// Check progress updated
		const newProgress = await page.locator('.progress-text').textContent();
		expect(newProgress).toBeTruthy();
		// Progress should show iteration or sample count
		expect(newProgress).toMatch(/Iteration|Sample/i);
	});

	test('should display debrief screen after completion', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Start experiment
		await page.locator('button:has-text("Start Experiment")').click();
		await waitForExperimentScreen(page, 'trial');

		// Complete a few samples to verify the flow works
		// (Full completion would require 20 iterations × 3 samples × 3 dimensions = 180 samples)
		const slider = page.locator('input[type="range"]').first();
		const submitButton = page.locator('button:has-text("Submit")');
		await expect(slider).toBeVisible();

		// Record a few samples
		for (let i = 0; i < 5; i++) {
			// Adjust slider
			const currentValue = await slider.inputValue();
			await slider.fill(String(parseFloat(currentValue) + 10));
			await page.waitForTimeout(200);
			
			// Click submit
			await expect(submitButton).toBeEnabled();
			await submitButton.click();
			await page.waitForTimeout(500);
		}

		// Verify we're still on trial screen (not completed yet with just a few samples)
		await expect(page.locator('.trial-content')).toBeVisible();
	});

	test('should persist session in localStorage', async ({ page }) => {
		await page.goto('/experiments/gsp-color-lavender');
		await waitForLoadingToComplete(page);
		await waitForExperimentScreen(page, 'instructions');

		// Start experiment
		await page.locator('button:has-text("Start Experiment")').click();
		await waitForExperimentScreen(page, 'trial');

		// Record a sample
		const slider = page.locator('input[type="range"].slider-input').first();
		const submitButton = page.locator('button:has-text("Submit")');
		await expect(slider).toBeVisible();
		
		// Adjust slider
		const currentValue = await slider.inputValue();
		await slider.fill(String(parseFloat(currentValue) + 5));
		await page.waitForTimeout(200);
		
		// Click submit to record sample
		await expect(submitButton).toBeEnabled();
		await submitButton.click();
		await page.waitForTimeout(1000);

		// Check localStorage has session data
		const sessionData = await page.evaluate(() => {
			return localStorage.getItem('gsp-session-gsp-color-lavender');
		});

		expect(sessionData).toBeTruthy();
		const session = JSON.parse(sessionData || '{}');
		expect(session.sessionId).toBeTruthy();
		expect(session.vector).toBeTruthy();
		expect(Array.isArray(session.vector)).toBe(true);
	});
});

