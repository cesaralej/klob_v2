import { test, expect } from '@playwright/test';

test('login and logout flow', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/login');

  // 2. Fill in credentials (assuming test@example.com is created)
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');

  // 3. Submit
  await page.click('button:has-text("Sign in")');

  // 4. Verify redirect to dashboard
  await expect(page).toHaveURL('/');
  
  // 5. Verify Dashboard content
  await expect(page.locator('h1')).toContainText('KLOB');
  await expect(page.locator('h2')).toContainText('Dashboard');

  // 6. Test Logout
  await page.click('button:has-text("Logout")');
  
  // 7. Verify back to login or session cleared (assuming logout redirects or UI changes)
  // Our current LogoutButton just calls signOut and router.refresh().
  // Middleware should catch the unauthed session and redirect to login on next navigation or refresh.
  // But router.refresh() might not trigger middleware redirect immediately if the page is still loaded?
  // Let's reload to be sure middleware kicks in.
  await page.reload();
  await expect(page).toHaveURL('/login');
});
