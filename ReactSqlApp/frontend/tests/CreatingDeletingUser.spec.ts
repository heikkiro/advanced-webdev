import { test, expect } from '@playwright/test';

// Define the app URL
const appAddress = 'http://localhost:5173';

// Generate random user data
const username = (Math.random() + 1).toString(36).substring(7);
const birthDate = '1990-01-01';
const occupation = 'Engineer';

/**
 * Test Case: Adds a new user
 * - Opens the app
 * - Fills out the username, birth date, occupation, and premium user fields
 * - Clicks the "Create" button
 * - Verifies that the new user appears in the user list
 */
test('adds a new user', async ({ page }) => {
    // Navigate to the app
    await page.goto(appAddress);

    // Fill the form fields
    await page.fill('input[placeholder="Username"]', username);
    await page.fill('input#birthDate', birthDate);
    await page.fill('input[placeholder="Occupation"]', occupation);
    await page.check('input#premiumUser'); // Assuming we want to select premium user

    // Click the "Create" button
    await page.click('button:has-text("Create")');

    // Wait for success message
    await expect(page.locator(`text=User created successfully: ${username}`)).toBeVisible();

    // Ensure the new user appears in the list
    const userRow = page.locator(`tr:has-text("${username}")`);
    await expect(userRow).toBeVisible();
});

/**
 * Test Case: Deletes the correct user
 * - Opens the app
 * - Waits for the newly created user to appear
 * - Clicks the "Delete" button inside that user's row
 * - Verifies that the user is removed from the list
 */
test('deletes the correct user', async ({ page }) => {
    // Navigate to the app
    await page.goto(appAddress);

    // Wait for the user to be visible in the table
    const userRow = page.locator(`tr:has-text("${username}")`);
    await expect(userRow).toBeVisible();

    // Find and click the delete button inside the correct row
    const deleteButton = userRow.locator('button:has-text("Delete")');
    await deleteButton.click();

    // Ensure the user is no longer in the table
    await expect(userRow).not.toBeVisible();
});
