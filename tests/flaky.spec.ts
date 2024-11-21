import { expect, test } from '@playwright/test';

// // Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// // Login 3 times sucessfully
test('Login multiple times sucessfully @c1', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge1.html']`).click();
  for (let i = 1; i <= 3; i++) {
    await page.locator('#email').fill(`test${i}@example.com`);
    await page.locator('#password').fill(`password${i}`);
    await page.locator('#submitButton').click();
    await expect(page.locator(`#successMessage`)).toContainText('Successfully submitted!');
    await expect(page.locator(`#successMessage`)).toContainText(`Email: test${i}@example.com`);
    await expect(page.locator(`#successMessage`)).toContainText(`Password: password${i}`);
    // Both of below methods can work, do whatever you need
    // await page.reload();
    await expect(page.locator(`#successMessage`)).not.toBeVisible();
  }
});

// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout successfully @c2', async ({ page }) => {
  await page.goto('/');
  await page.locator("//*[@href='/challenge2.html']").click();
  await page.locator('#email').fill(`test1@example.com`);
  await page.locator('#password').fill(`password1`);
  const submitButton = page.locator('#submitButton');
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const button = document.querySelector('#submitButton');
    const computedStyle = window.getComputedStyle(button);
    const currentLeft = computedStyle.left;
    const currentTransform = computedStyle.transform;
    button.style.animation = 'none';
    button.style.transition = 'none';
    button.style.left = currentLeft;
    button.style.transform = currentTransform;
  });
  await submitButton.click();
  const menuButton = page.locator('#menuButton');
  await expect(menuButton).toBeVisible();
  await page.waitForSelector('[data-initialized="true"]');
  await menuButton.click();
  await page.waitForSelector('.dropdown-menu.show');
  const logoutOption = page.locator('#logoutOption');
  await expect(logoutOption).toBeVisible();
  await expect(logoutOption).toBeEnabled();
  await logoutOption.click();
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge3.html']`).click();
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  await page.locator('#email').waitFor({ state: 'visible' });
  await page.locator('#email').click();
  await page.locator('#email').fill('test@example.com');
  await page.locator("//button[text()='Reset Password']").click();
  await page.locator('h3:has-text("Success!")').waitFor({ state: 'attached' });
  await page.locator('h3:has-text("Success!")').waitFor({ state: 'visible' });
  await expect(page.locator('#mainContent')).toContainText('Password reset link sent!');
});

//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge4.html']`).click();
  await page.evaluate(() => new Promise(resolve => {
  if (window.isAppReady) resolve();
  else {
    const interval = setInterval(() => {
      if (window.isAppReady) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  }
  }));
  await page.locator('#email').fill('test@example.com');
  await page.locator('#password').fill('password');
  await page.locator('#submitButton').click();
  await page.waitForSelector('#profileButton');
  await page.locator('#profileButton').click();
  await page.getByText('Logout').click();
  await page.waitForSelector('h2:has-text("Login")');
});
