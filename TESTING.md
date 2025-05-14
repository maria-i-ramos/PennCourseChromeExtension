# TESTING.md

This document outlines the testing strategy for the [PennCourseChromeExtension](https://github.com/maria-i-ramos/PennCourseChromeExtension), focusing on both interface behavior and prompt functionality. The testing approach combines **manual walkthroughs** and **prompt validation** using the OpenAI API.

---

## Interface Testing

### Approach
Manual walkthroughs were conducted to test all user-facing components of the Chrome extension popup interface.

### Steps Taken
- **Extension Load**  
  Verified successful load in Chrome via `chrome://extensions` without error logs in the console.

- **Highlight-to-Search Feature**  
  - Highlighted course names like `CIS 1200` on Path@Penn and other sites.
  - Clicked the extension icon to verify course data appeared in the popup.

- **Search Tab**  
  - Entered valid course codes (e.g. `CIS 1210`, `ENGL 1030`) to verify results fetched from Penn Course Review.
  - Entered invalid course codes to confirm the extension correctly displays “Course not found” or similar messages.

- **Data Caching**  
  - Repeated the same highlight and search actions to observe local storage behavior.
  - Checked that previously selected courses appear in the "Currently Selected" and "Previously Selected" sections.

- **UI Verification**  
  - Confirmed that key interface elements (checkboxes, result display, clear/reset buttons) are responsive and functioning.
  - Resized popup window to ensure layout remains user-friendly on small screens.

- **Error Handling**  
  - Tested offline behavior and invalid API responses to verify fallback messaging.
  - Ensured no app crashes or blank states during edge case scenarios.

### Result
- All expected elements rendered and responded correctly to input.
- Invalid inputs and API errors were handled gracefully.
- Local storage features for course history worked as intended.
- No visual or functional bugs were found during walkthroughs.

---

## Prompt Testing

### Model Used
- **OpenAI GPT-4o** via API (`gpt-4o`)
- Prompts tested manually using both the browser interface and console-logged API requests.

---

### Test Case 1

**Description**:  
User selects `CIS 1200` and `CIS 1210`, and enters the prompt:  
> “I want a class with a lighter workload and more engaging lectures.”

**Expected Output**:  
GPT recommends one course based on workload and engagement review data, such as instructor ratings and time commitment.

**Current Behavior**:  
GPT returns a thoughtful response comparing review metrics from Penn Course Review. Correctly recommends `CIS 1200` with rationale based on student workload data and engagement scores.

**Pass/Fail**: ✅ *Pass*

---

### Test Case 2

**Description**:  
User selects two different department courses: `ENGL 1030` and `PHYS 1500`, and enters:  
> “Which course is better if I prefer small discussions and frequent feedback?”

**Expected Output**:  
GPT distinguishes humanities vs STEM format differences and chooses the more discussion-oriented course, most likely ENGL 1030.

**Current Behavior**:  
GPT returns a reasoned response emphasizing writing-intensive courses’ feedback loops and discussion-based formats. Provides course-specific justification.

**Pass/Fail**: ✅ *Pass*

---

### Test Case 3

**Description**:  
User selects `STAT 1010` and `STAT 1110`, and enters:  
> “Which is better for a student with no prior statistics background who wants to go into business analytics?”

**Expected Output**:  
GPT should evaluate which course is more beginner-friendly and applicable to business contexts, likely leaning toward `STAT 1010`.

**Current Behavior**:  
GPT responds with a clear comparison of course depth and accessibility. It recommends `STAT 1010` as an introductory, practical course for business-minded students and explains the more theoretical nature of `STAT 1110`.

**Pass/Fail**: ✅ *Pass*

---

### Prompt Variation Coverage
- Compared two similar STEM courses.
- Compared cross-departmental courses.
- Compared beginner vs. advanced course accessibility.
- Tested prompts for workload, lecture quality, feedback frequency, discussion style, and grading.
- Verified response quality for vague vs. specific prompts.

---

## Future Testing Plans

- **Automated Testing**:
  - Integrate unit tests using Jest for core data-fetching and state-handling logic (React + Chrome APIs).
  - Automate UI testing with Puppeteer or Playwright for end-to-end flows.

- **Continuous Testing**:
  - Add GitHub Actions to run tests on push/pull requests.
  - Monitor for regression bugs on feature updates.

---
