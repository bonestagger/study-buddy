import { test, expect } from '@playwright/test';

test.describe('ICSE Grade 8 ClassNotes Hub - Complete UI & E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait until notes are hydrated and visible
    await expect(page.locator('text=Factorisation Ex 7.2').first()).toBeVisible({ timeout: 15000 });
  });

  test('01. Initial Load & Student Header Display', async ({ page }) => {
    // Check main title in desktop header
    await expect(page.locator('h1:has-text("ICSE Grade 8 StudyHub")')).toBeVisible();

    // Verify default student Aarav Patel and Division 8-B
    await expect(page.locator('header >> text=Aarav Patel')).toBeVisible();
    await expect(page.locator('header >> text=8-B')).toBeVisible();

    // Check dynamic island / status bar
    await expect(page.locator('text=5G')).toBeVisible();

    // Verify all 5 bottom navigation buttons
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('nav-requests')).toBeVisible();
    await expect(page.getByTestId('nav-upload')).toBeVisible();
    await expect(page.getByTestId('nav-qna')).toBeVisible();
    await expect(page.getByTestId('nav-profile')).toBeVisible();
  });

  test('02. Live 11-Subject Filtering & Expandable Grid', async ({ page }) => {
    // 1. Check all 11 subject buttons exist
    const subIds = ['MATH', 'PHYS', 'CHEM', 'BIO', 'HIST', 'GEOG', 'ENG1', 'ENG2', 'HINDI', 'COMP', 'MAR'];
    for (const id of subIds) {
      await expect(page.locator(`button[data-sub="${id}"]`).first()).toBeAttached();
    }

    // 2. Test Expand / Collapse toggle
    await page.click('button:has-text("View All 11")');
    await expect(page.locator('button:has-text("Collapse")')).toBeVisible();
    await page.click('button:has-text("Collapse")');
    await expect(page.locator('button:has-text("View All 11")')).toBeVisible();

    // 3. Filter by Math
    await page.click('button[data-sub="MATH"]');
    await expect(page.locator('text=Factorisation Ex 7.2').first()).toBeVisible();
    await expect(page.locator('text=Language of Chemistry: Valency')).not.toBeVisible();

    // 4. Filter by Physics
    await page.click('button[data-sub="PHYS"]');
    await expect(page.locator('text=Force and Pressure').first()).toBeVisible();
    await expect(page.locator('text=Factorisation Ex 7.2')).not.toBeVisible();

    // 5. Filter by Chemistry
    await page.click('button[data-sub="CHEM"]');
    await expect(page.locator('text=Language of Chemistry: Valency').first()).toBeVisible();
    await expect(page.locator('text=Factorisation Ex 7.2')).not.toBeVisible();

    // 6. Filter by Biology
    await page.click('button[data-sub="BIO"]');
    await expect(page.locator('text=Transport in Plants').first()).toBeVisible();
    await expect(page.locator('text=Factorisation Ex 7.2')).not.toBeVisible();

    // 7. Filter by Marathi
    await page.click('button[data-sub="MAR"]');
    await expect(page.locator('text=मराठी व्याकरण').first()).toBeVisible();
    await expect(page.locator('text=Factorisation Ex 7.2')).not.toBeVisible();

    // 8. Restore All
    await page.click('button:has-text("Show All")');
    await expect(page.locator('text=Factorisation Ex 7.2').first()).toBeVisible();
    await expect(page.locator('text=Language of Chemistry: Valency').first()).toBeVisible();
  });

  test('03. Live Search Functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search chapter or topic"]');
    await expect(searchInput).toBeVisible();

    // Search for Valency
    await searchInput.fill('Valency');
    await expect(page.locator('text=Language of Chemistry: Valency').first()).toBeVisible();
    await expect(page.locator('text=Factorisation Ex 7.2')).not.toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('text=Factorisation Ex 7.2').first()).toBeVisible();
    await expect(page.locator('text=Language of Chemistry: Valency').first()).toBeVisible();
  });

  test('04. Likes & Bookmark Interactions', async ({ page }) => {
    // Find like button on first worksheet card
    const likeBtn = page.locator('button[title="Like this worksheet"]').first();
    await expect(likeBtn).toBeVisible();
    await expect(likeBtn).toContainText('like');

    // Click like button
    await likeBtn.click();
    await expect(
      page.locator('text=Liked worksheet! (+10 XP to classmate author)').or(page.locator('text=Removed like from worksheet'))
    ).toBeVisible();

    // Click bookmark button
    const bookmarkBtn = page.locator('button[title="Bookmark for Exam Prep"]').first();
    await bookmarkBtn.click();
    await expect(page.locator('text=Saved for Exam Prep!').or(page.locator('text=Removed from bookmarks'))).toBeVisible();
  });

  test('05. Touch PDF Reader Modal (90° Rotation, Zoom, and Send Doubt)', async ({ page }) => {
    // Open PDF by tapping the Math Factorisation card
    await page.locator('article:has-text("Factorisation Ex 7.2")').first().click();

    // Verify PDF viewer opens
    await expect(page.locator('#pdfSheet')).toBeVisible();
    await expect(page.locator('text=Chapter 7: Factorisation')).toBeVisible();

    // Test 90° rotation
    const rotateBtn = page.locator('button[title="Turn / Rotate 90 degrees"]');
    await rotateBtn.click();
    await expect(page.locator('text=Turned worksheet to 90° 🔄')).toBeVisible();
    await rotateBtn.click();
    await expect(page.locator('text=Turned worksheet to 180° 🔄')).toBeVisible();

    // Test Zoom in and out
    const zoomInBtn = page.locator('button[title="Zoom in"]');
    await zoomInBtn.click();
    const zoomOutBtn = page.locator('button[title="Zoom out"]');
    await zoomOutBtn.click();

    // Test Save button
    await page.locator('button:has-text("Save")').click();
    await expect(page.locator('text=Worksheet saved to your phone')).toBeVisible();

    // Test inline quick doubt with Send button inside PDF Reader
    const doubtInput = page.locator('input[placeholder*="Ask a doubt about this worksheet"]');
    await doubtInput.fill('How did we factorise question 2?');
    const sendDoubtBtn = page.locator('form:has(input[placeholder*="Ask a doubt about this worksheet"]) button:has-text("Send")');
    await expect(sendDoubtBtn).toBeVisible();
    await sendDoubtBtn.click();
    await expect(page.locator('text=Doubt posted: "How did we factorise question 2?" 💬')).toBeVisible();

    // Close PDF Reader
    await page.locator('button:has-text("Back")').click();
    await expect(page.locator('#pdfSheet')).not.toBeVisible();
  });

  test('06. 3-Step Note Sharing Flow (+50 XP Award)', async ({ page }) => {
    // Click center Share button in navigation
    await page.getByTestId('nav-upload').click();

    // Verify Share Modal opens
    await expect(page.locator('text=Share Notes with Class')).toBeVisible();
    await expect(page.locator('text=+50 XP').first()).toBeVisible();

    // Step 1: Pick Subject (Chemistry)
    await page.locator('button:has-text("Chemistry")').last().click();

    // Step 2: Pick Material Type (Homework)
    await page.locator('button:has-text("Homework")').click();
    await expect(page.locator('text=Homework Deadline')).toBeVisible();

    // Step 3: Enter Title
    const testTitle = `E2E Chem Revision Test ${Date.now()}`;
    await page.locator('input[placeholder*="e.g. Chapter 7 Exercise 7.2"]').fill(testTitle);

    // Step 4: Attach Notebook Photos
    await page.locator('button:has-text("Snap Notebook")').click();
    await expect(page.locator('text=3 notebook pages snapped')).toBeVisible();

    // Submit Note
    await page.locator('button:has-text("Share with Classmates")').click();
    await expect(page.locator(`text=Shared "${testTitle}" with class!`)).toBeVisible();

    // Verify it appears in Home feed
    await expect(page.locator(`h3:has-text("${testTitle}")`).first()).toBeVisible();
  });

  test('07. Missed a Class Requests Board & Fulfillment (+75 XP)', async ({ page }) => {
    // Switch to Requests tab
    await page.getByTestId('nav-requests').click();
    await expect(page.locator('text=Missed a Class?')).toBeVisible();

    // 1. Create a new request
    await page.locator('button:has-text("Ask for Notes")').click();
    await expect(page.locator('text=Ask Class for Missing Notes')).toBeVisible();

    const reqTitle = `Need Math Ch 8 Ex 8.1 Notes ${Date.now()}`;
    await page.locator('input[placeholder*="Hindi Vyakaran: Sandhi"]').fill(reqTitle);
    await page.locator('button:has-text("Send Request to Classmates")').click();
    await expect(page.locator(`text=Request for "${reqTitle}" posted!`)).toBeVisible();
    await expect(page.locator(`h4:has-text("${reqTitle}")`).first()).toBeVisible();

    // 2. Fulfill an active request
    const sendNotesBtn = page.locator('button:has-text("Send Notes")').first();
    if (await sendNotesBtn.isVisible()) {
      await sendNotesBtn.click();
      await expect(page.locator('text=+75 XP! Sent notes')).toBeVisible();
    }
  });

  test('08. Class Doubts Board, Inline Ask with Send 🚀, Upvote & Answer (+25 XP)', async ({ page }) => {
    // Switch to Doubts tab
    await page.getByTestId('nav-qna').click();
    await expect(page.locator('text=Class Doubts')).toBeVisible();

    // 1. Check prominent inline Ask a Doubt box with Send button
    const inlineInput = page.locator('input[placeholder="Type your homework doubt here..."]');
    await expect(inlineInput).toBeVisible();

    const inlineSendBtn = page.locator('form:has(input[placeholder="Type your homework doubt here..."]) button:has-text("Send")');
    await expect(inlineSendBtn).toBeVisible();

    // Submit inline doubt
    const doubtText = `Why is nitrogen valency 3 in ammonia? ${Date.now()}`;
    await inlineInput.fill(doubtText);
    await inlineSendBtn.click();
    await expect(page.locator('text=Doubt posted to Class Doubts board! 💬')).toBeVisible();
    await expect(page.locator(`h3:has-text("${doubtText}")`).first()).toBeVisible();

    // 2. Upvote an existing question
    const upvoteBtn = page.locator('button:has-text("Helpful")').first();
    await upvoteBtn.click();
    await expect(page.locator('text=Marked doubt as helpful!')).toBeVisible();

    // 3. Answer a question (+25 XP)
    const answerBtn = page.locator('button:has-text("Answer (+25 XP)")').first();
    await answerBtn.click();
    await expect(page.locator('text=Answer Classmate Doubt')).toBeVisible();

    const solutionTextarea = page.locator('textarea[placeholder*="Write step-by-step steps"]');
    await solutionTextarea.fill('Nitrogen shares 3 valence electrons with 3 hydrogen atoms to complete its octet.');

    const sendSolutionBtn = page.locator('button:has-text("Send Solution (+25 XP)")');
    await expect(sendSolutionBtn).toBeVisible();
    await sendSolutionBtn.click();
    await expect(page.locator('text=+25 XP! Solution posted')).toBeVisible();
  });

  test('09. My Desk (Rank Progression, Rewards Cheatsheet & Bookmarks)', async ({ page }) => {
    // Switch to My Desk tab
    await page.getByTestId('nav-profile').click();

    // Verify Student Profile & Rank
    await expect(page.locator('h3:has-text("Aarav Patel")')).toBeVisible();
    await expect(page.locator('text=Class Rank')).toBeVisible();

    // Verify Reward chips with Likes (+10 XP)
    await expect(page.locator('text=+50 XP')).toBeVisible();
    await expect(page.locator('text=+75 XP')).toBeVisible();
    await expect(page.locator('text=+25 XP')).toBeVisible();
    await expect(page.locator('text=+10 XP')).toBeVisible();
    await expect(page.locator('text=Likes')).toBeVisible();

    // Verify Saved for Exam Prep revision sheets
    await expect(page.locator('text=Saved for Exam Prep')).toBeVisible();
  });

  test('10. Centralized Settings Hub (Retro B&W Theme, Reading Mode & Mascots)', async ({ page }) => {
    // Open Settings via gear button in header
    await page.locator('button[title="App Settings"]').click();
    await expect(page.locator('text=My App Settings')).toBeVisible();

    // 1. Verify Retro Black & White Monochrome Theme
    await expect(page.locator('text=Theme: Retro Black & White')).toBeVisible();
    await expect(page.locator('text=Active Theme')).toBeVisible();
    await expect(page.locator('text=B&W RETRO')).toBeVisible();

    // 2. Toggle Reading Mode (Retro Paper Light <-> Retro Terminal Dark)
    const readingModeBtn = page.getByTestId('toggle-reading-mode');
    await expect(readingModeBtn).toBeVisible();
    await readingModeBtn.click();
    await expect(page.locator('text=Switched to Retro').first()).toBeVisible();

    // 3. Select a mascot emoji
    await page.locator('button:has-text("🚀")').click();
    await expect(page.locator('text=Avatar mascot selected: 🚀')).toBeVisible();

    // 4. Verify PWA Mobile App Section & Home Screen prompt
    const pwaBtn = page.getByTestId('pwa-install-btn');
    await expect(pwaBtn).toBeVisible();
    await pwaBtn.click();
    await expect(page.locator('text=Add to Home Screen').first()).toBeVisible();

    // 5. Save Changes
    await page.locator('button:has-text("Save Changes")').click();
    await expect(page.locator('text=Settings saved successfully!')).toBeVisible();
  });

  test('11. Notification Drawer & Unread Counters', async ({ page }) => {
    // Open Notifications drawer via Bell icon
    await page.locator('button[title="Alerts"]').click();
    await expect(page.locator('#notifDrawer')).toBeVisible();

    // Check Homework Due notification inside drawer
    await expect(page.locator('#notifDrawer p:has-text("Homework Due Tomorrow!")')).toBeVisible();

    // Close drawer
    await page.locator('#notifDrawer button:has-text("Close")').click();
    await expect(page.locator('#notifDrawer')).not.toBeVisible();
  });

  test('12. Authentication Switch & Sign Out Flow', async ({ page }) => {
    // Open settings and sign out
    await page.locator('button[title="App Settings"]').click();
    await page.locator('button:has-text("Sign Out")').click();
    await expect(page.locator('text=Signed out successfully.')).toBeVisible();

    // Verify Login Gate screen
    await expect(page.locator('text=Sign in with Google Account')).toBeVisible();
    await expect(page.locator('h2:has-text("ClassNotes Hub")')).toBeVisible();

    // Test quick student switch as Priya Sharma (8-B)
    await page.locator('button:has-text("Priya Sharma")').click();
    await expect(page.locator('text=Welcome Priya Sharma!')).toBeVisible();
  });
});
