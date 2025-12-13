# Implementation Plan

- [x] 1. Create validation utilities and hook
  - [x] 1.1 Create candidate validation constants and utility functions
    - Create `Agora-Blockchain/client/app/helpers/candidateValidation.ts`
    - Define `VALIDATION_MESSAGES` constant with error message strings
    - Define `CandidateValidationErrors` interface
    - Implement `findDuplicateIndices(candidates)` function for case-insensitive duplicate detection
    - Implement `findEmptyFields(candidates)` function to identify empty name/description fields
    - _Requirements: 5.1, 6.1_

  - [x] 1.2 Create useCandidateValidation hook
    - Create `Agora-Blockchain/client/app/hooks/useCandidateValidation.ts`
    - Implement hook that takes candidates array and returns `ValidationResult`
    - Include `isValid`, `errors`, and `errorMessages` in return value
    - Use memoization to prevent unnecessary recalculations
    - _Requirements: 4.1, 4.3, 5.1, 5.3, 6.1, 6.3_

- [x] 2. Create CandidateCounter component
  - [x] 2.1 Implement CandidateCounter component
    - Create `Agora-Blockchain/client/app/create/components/CandidateCounter.tsx`
    - Accept `count` and `minimum` props
    - Display count in "X/2 minimum" format
    - Apply warning color (amber) when count < minimum
    - Apply success color (green) when count >= minimum
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 3. Create CandidateCard component
  - [x] 3.1 Implement CandidateCard component with validation states
    - Create `Agora-Blockchain/client/app/create/components/CandidateCard.tsx`
    - Accept candidate data, index, validation state props, and callbacks
    - Render name input with error styling when `isDuplicate` or name is in `emptyFields`
    - Render description textarea with error styling when description is in `emptyFields`
    - Include delete button with TrashIcon
    - Call `onBlur` callback when fields lose focus
    - Apply Framer Motion animation wrapper for enter/exit
    - Ensure minimum touch target of 44x44px for delete button
    - Use 16px minimum font size on inputs
    - _Requirements: 2.1, 2.3, 3.1, 3.2, 5.2, 6.2, 8.2, 8.3_

- [x] 4. Create CandidateSection component
  - [x] 4.1 Implement CandidateSection component
    - Create `Agora-Blockchain/client/app/create/components/CandidateSection.tsx`
    - Accept candidates array, validation errors, and callback props
    - Render CandidateCounter component
    - Render "Add Candidate" button with PlusIcon
    - Render list of CandidateCard components with AnimatePresence for animations
    - Show placeholder text when no candidates added
    - Display warning indicator when fewer than 2 candidates
    - Stack layout vertically on screens < 640px using Tailwind responsive classes
    - _Requirements: 1.1, 1.2, 1.3, 2.2, 4.2, 8.1_

- [x] 5. Integrate components into CreatePage
  - [x] 5.1 Refactor CreatePage to use new components
    - Import CandidateSection component and useCandidateValidation hook
    - Add state for tracking touched/blurred fields
    - Replace inline candidate section JSX with CandidateSection component
    - Pass candidates, validation errors, and callbacks to CandidateSection
    - Implement `handleFieldBlur` callback to track touched fields
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Update form submission validation
    - Use validation result from useCandidateValidation hook
    - Display specific error messages from hook (duplicate names, empty fields)
    - Show first validation error via toast on submit attempt
    - Ensure form submission is blocked when validation fails
    - _Requirements: 4.1, 5.1, 6.1_

- [x] 6. Ensure animation performance
  - [x] 6.1 Optimize animations for performance
    - Use CSS transforms (translate, scale) and opacity in Framer Motion variants
    - Set animation duration to 300ms or less
    - Use `layout` prop sparingly to prevent layout shifts
    - Test animations don't cause jank on candidate add/remove
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 6.2 Write unit tests for validation hook
    - Test returns valid when 2+ candidates with unique names and filled fields
    - Test returns duplicateIndices for matching names (case-insensitive)
    - Test returns emptyFields for empty name or description
    - Test returns correct error messages array
    - _Requirements: 4.1, 5.1, 6.1_
