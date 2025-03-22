# 🛠️ Contributing Guidelines for Agora-Blockchain

---

## ✅ 1. Creating an Issue

- For any **feature requests, bugs, security concerns**, or other issues:
  - Create a new **issue** in the repository.
  - Wait to be **assigned** before proceeding with development.
- **Avoid unassigned PRs**: They will be closed without review.

---

## 🌿 2. Branch Management

- Always create a **new branch** on your forked repository before committing changes.
- Use a clear and consistent branch naming convention:
  - `feature/<issue-name>` for new features.
  - `fix/<issue-name>` for bug fixes.
  - `docs/<issue-name>` for documentation updates.

---

## 🔥 3. Pull Request (PR) Guidelines

- **Detailed Descriptions:**
  - Provide a clear and detailed explanation of the changes made.
  - Include the **reasoning** behind the changes.
- **Small Changes:**
  - If a frontend change involves **fewer than 20 lines of code** or is a documentation update, you may directly create a PR without prior assignment.
- **Avoid Duplication:**
  - Check existing **issues and PRs** to prevent overlap.
- **Open Review Period:**
  - PRs will remain open for **one week** to allow time for reviews and suggestions.

---

## 💬 4. Community Engagement

- **Stay active** on the Agora-Blockchain Discord channel:
  - Share updates regarding your issues and PRs.
  - Participate in discussions to gather feedback.

---

## 🔍 5. Code Quality and Testing

- Ensure all changes are thoroughly **tested**.
- Maintain **code quality** and avoid introducing code smells.
- Follow **project standards** for consistency and readability.

---

## 🚫 6. Assignment and Progress Updates

- **Assignment Required:**
  - Do not submit unassigned PRs; they will be closed.
- **Regular Updates:**
  - If your work takes longer than expected, provide **frequent updates** in the issue or PR comments.
- **Completion Timeline:**
  - Issues are expected to be completed within **5-30 days**, based on complexity.
  - Incomplete issues may be reassigned.

---

## 🔗 7. Working on Blockchain Components

- **Error Interface Changes:**
  - When modifying an error interface, ensure the corresponding error is added to:  
    `client/app/helper/ErrorMessage.ts`
- **Contract ABI Updates:**
  - For changes to `ElectionFactory`, `Election`, or `CCIPSender` contracts:
    - Manually update the ABI files in:  
      `client/abi/artifacts/`
    - ⚠️ **Do not configure Hardhat** to auto-generate these paths in the client directory.

---

## 🚀 8. Mentor Notification

- If your PR is left unattended for **1-2 weeks**, depending on its size:
  - Tag the **mentors** of Agora-Blockchain to get their attention.

---

✅ **Thank you for contributing to Agora-Blockchain!** 🎉
