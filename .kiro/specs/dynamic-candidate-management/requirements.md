# Requirements Document

## Introduction

This document specifies the requirements for enhancing the dynamic candidate management feature in the Agora-Blockchain election creation form. The feature enables users to add, edit, and remove candidates directly during election creation, with real-time validation and improved user experience. The current implementation has basic functionality but lacks comprehensive validation, clear error states, and UX polish as specified in issue #157.

## Glossary

- **Election_Creation_Form**: The React component (`CreatePage`) that allows users to create new elections on the blockchain
- **Candidate**: An entity with a name and description that can be voted for in an election
- **Candidate_List**: The dynamic array of candidates being managed in the form state
- **Validation_Error**: A user-facing message displayed when input does not meet requirements
- **Candidate_Counter**: A visual indicator showing the current number of candidates added

## Requirements

### Requirement 1: Add Candidates Dynamically

**User Story:** As an election creator, I want to add candidates directly in the election creation form, so that I can set up the entire election in one step without navigating to separate pages.

#### Acceptance Criteria

1. WHEN the user clicks the "Add Candidate" button, THE Election_Creation_Form SHALL append a new empty candidate entry to the Candidate_List with input fields for name and description.
2. THE Election_Creation_Form SHALL allow unlimited candidate additions without imposing a maximum limit.
3. WHEN a new candidate entry is added, THE Election_Creation_Form SHALL animate the entry into view within 300 milliseconds.

### Requirement 2: Remove Candidates

**User Story:** As an election creator, I want to remove candidates with one click, so that I can easily correct mistakes or change my candidate list.

#### Acceptance Criteria

1. WHEN the user clicks the delete icon on a candidate entry, THE Election_Creation_Form SHALL remove that candidate from the Candidate_List.
2. WHEN a candidate is removed, THE Election_Creation_Form SHALL animate the removal within 300 milliseconds.
3. THE Election_Creation_Form SHALL display a delete icon for each candidate entry that is visible and accessible.

### Requirement 3: Edit Candidate Details

**User Story:** As an election creator, I want to edit candidate names and descriptions in real-time, so that I can refine candidate information before submitting.

#### Acceptance Criteria

1. WHEN the user types in a candidate name field, THE Election_Creation_Form SHALL update the corresponding candidate's name in the Candidate_List immediately.
2. WHEN the user types in a candidate description field, THE Election_Creation_Form SHALL update the corresponding candidate's description in the Candidate_List immediately.

### Requirement 4: Minimum Candidates Validation

**User Story:** As an election creator, I want to be informed when I have fewer than 2 candidates, so that I understand the minimum requirement for a valid election.

#### Acceptance Criteria

1. WHEN the user attempts to submit the form with fewer than 2 candidates, THE Election_Creation_Form SHALL display the Validation_Error "Minimum 2 candidates required".
2. WHILE the Candidate_List contains fewer than 2 candidates, THE Election_Creation_Form SHALL display a warning indicator near the candidate section.
3. THE Election_Creation_Form SHALL prevent form submission until at least 2 candidates are added.

### Requirement 5: Empty Fields Validation

**User Story:** As an election creator, I want to be notified about empty candidate fields, so that I can ensure all candidates have complete information.

#### Acceptance Criteria

1. WHEN the user attempts to submit the form with any candidate having an empty name or description, THE Election_Creation_Form SHALL display the Validation_Error "All candidates need name & description".
2. WHEN a candidate field loses focus and is empty, THE Election_Creation_Form SHALL highlight that field with an error state border color.
3. THE Election_Creation_Form SHALL prevent form submission until all candidate fields are filled.

### Requirement 6: Unique Candidate Names Validation

**User Story:** As an election creator, I want to be warned about duplicate candidate names, so that voters can distinguish between candidates.

#### Acceptance Criteria

1. WHEN the user attempts to submit the form with duplicate candidate names, THE Election_Creation_Form SHALL display the Validation_Error "Candidate names must be unique".
2. WHEN a candidate name matches another candidate's name in the Candidate_List, THE Election_Creation_Form SHALL highlight both duplicate name fields with an error state.
3. THE Election_Creation_Form SHALL prevent form submission until all candidate names are unique.

### Requirement 7: Visual Candidate Counter

**User Story:** As an election creator, I want to see how many candidates I have added, so that I can track my progress toward the minimum requirement.

#### Acceptance Criteria

1. THE Election_Creation_Form SHALL display a Candidate_Counter showing the current number of candidates in the format "X candidates" or "X/2 minimum".
2. WHEN a candidate is added or removed, THE Election_Creation_Form SHALL update the Candidate_Counter immediately.
3. WHILE the Candidate_List contains fewer than 2 candidates, THE Candidate_Counter SHALL display in a warning color to indicate insufficient candidates.

### Requirement 8: Mobile Responsiveness

**User Story:** As an election creator using a mobile device, I want the candidate management interface to be usable on small screens, so that I can create elections from any device.

#### Acceptance Criteria

1. THE Election_Creation_Form candidate section SHALL adapt its layout for screens narrower than 640 pixels.
2. THE Election_Creation_Form SHALL ensure all candidate input fields and buttons are accessible via touch with minimum tap targets of 44x44 pixels.
3. THE Election_Creation_Form SHALL maintain readable text sizes of at least 16 pixels on mobile devices to prevent auto-zoom on input focus.

### Requirement 9: Animation Performance

**User Story:** As an election creator, I want smooth animations that don't slow down the form, so that I have a pleasant experience while managing candidates.

#### Acceptance Criteria

1. THE Election_Creation_Form SHALL use CSS transforms and opacity for animations to ensure GPU acceleration.
2. THE Election_Creation_Form animations SHALL complete within 300 milliseconds to maintain responsiveness.
3. THE Election_Creation_Form SHALL not cause layout shifts during candidate add/remove animations.
