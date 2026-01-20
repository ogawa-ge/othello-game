---
description: "Task list for Othello Game implementation"
---

# Tasks: Othello Game

**Input**: Design documents from `/specs/001-othello-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Included as requested in research.md (QUnit).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths follow the single project structure defined in `plan.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and test environment setup.

- [x] T001 [P] Create the initial file structure: `index.html`, `style.css`, `app.js`, and the `js/` and `tests/` directories.
- [x] T002 [P] Set up the QUnit testing environment by creating `tests/index.html` to load QUnit and the test files.
- [x] T003 [P] Create initial test files: `tests/test-setup.js`, `tests/test-game-logic.js`, and `tests/test-ai-logic.js`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and basic UI that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Create the basic HTML layout for the game board and controls in `index.html`.
- [x] T005 [P] Add initial CSS in `style.css` to style the game board grid and pieces.
- [x] T006 Implement the `Board` data model (8x8 array) and its initial state in `js/game-logic.js` as per `data-model.md`.
- [x] T007 Implement the initial `Game` class/object structure in `js/game-logic.js`, including `board`, `currentPlayer`, and `gameState` properties.
- [x] T008 [P] Write a QUnit test in `tests/test-game-logic.js` to verify the initial board setup is correct.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - 2-Player Versus Mode (Priority: P1) 🎯 MVP

**Goal**: Two players can play a full game of Othello, with the system enforcing rules and declaring a winner.

**Independent Test**: Two testers can open `index.html`, play a complete game against each other, and see the correct winner announced.

### Tests for User Story 1 (QUnit) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] [US1] Write a test in `tests/test-game-logic.js` to check the valid move calculation for a given player and board state.
- [x] T010 [P] [US1] Write a test in `tests/test-game-logic.js` to verify that placing a piece correctly flips the opponent's pieces.
- [x] T011 [P] [US1] Write a test in `tests/test-game-logic.js` to confirm that the turn correctly passes to the next player.
- [x] T012 [P] [US1] Write a test in `tests/test-game-logic.js` for the game-ending condition (no valid moves for either player).
- [x] T013 [P] [US1] Write a test in `tests/test-game-logic.js` to verify the win/loss/draw determination logic.

### Implementation for User Story 1

- [x] T014 [US1] Implement the valid move calculation logic within `js/game-logic.js`.
- [x] T015 [US1] Implement the piece-flipping logic in `js/game-logic.js` after a move is made.
- [x] T016 [US1] Implement the turn-switching and pass logic in `js/game-logic.js`.
- [x] T017 [US1] Implement the game end detection and winner calculation in `js/game-logic.js`.
- [x] T018 [US1] Implement UI rendering in `js/ui.js` to draw the board and pieces based on the `Game` state.
- [x] T019 [US1] In `app.js`, add event listeners to the board to handle player clicks and trigger the game logic.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Player vs. AI Mode (Priority: P1)

**Goal**: A single player can play a full game of Othello against a computer opponent with selectable difficulty.

**Independent Test**: A tester can start a game against the AI at each difficulty level, play to completion, and see a valid outcome.

### Tests for User Story 2 (QUnit) ⚠️

- [x] T020 [P] [US2] Write tests in `tests/test-ai-logic.js` for the "easy" AI to ensure it always returns a valid, random move.
- [x] T021 [P] [US2] Write tests in `tests/test-ai-logic.js` for the "medium" and "hard" AI, providing a board state and ensuring it returns the expected best move based on its evaluation function.

### Implementation for User Story 2

- [x] T022 [P] [US2] Add UI elements to `index.html` for selecting game mode (2P vs AI) and AI difficulty.
- [x] T023 [P] [US2] Implement the `AIPlayer` entity and the "easy" (random) move logic in `js/ai-logic.js`.
- [x] T024 [US2] Implement the "medium" AI (minimax depth 3) in `js/ai-logic.js`.
- [x] T025 [US2] Implement the "hard" AI (minimax with alpha-beta pruning) in `js/ai-logic.js`.
- [x] T026 [US2] Update `app.js` to handle game mode selection and initialize an AI opponent when chosen.
- [x] T027 [US2] Modify the game loop in `js/game-logic.js` to call the AI's makeMove function when it's the AI's turn.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work.

---

## Phase 5: User Story 3 - Rule Violation Prevention (Priority: P2)

**Goal**: The system prevents players from making illegal moves and guides them by showing valid move locations.

**Independent Test**: A tester attempts to click on various invalid squares (occupied, does not flip pieces) and confirms no piece is placed. The tester also confirms that highlighted valid moves are accurate.

### Tests for User Story 3 (QUnit) ⚠️

- [x] T028 [P] [US3] Write tests in `tests/test-game-logic.js` to ensure the Game.playMove function rejects moves not in the pre-calculated valid moves list.

### Implementation for User Story 3

- [x] T029 [US3] Implement logic in `js/ui.js` to visually highlight all valid moves for the current player on the board.
- [x] T030 [US3] Update the event handling in `app.js` to only proceed with a move if the clicked square is one of the valid moves.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the overall experience.

- [x] T031 [P] Add clear UI messaging for game state (e.g., current turn, winner announcement) in `js/ui.js`.
- [x] T032 [P] Add a "New Game" button to `index.html` and implement the reset logic in `app.js`.
- [ ] T033 Code cleanup and refactoring across all `.js` files to improve clarity and maintainability.
- [ ] T034 [P] Review and enhance styling in `style.css` for a more polished look and feel.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)** -> **Foundational (Phase 2)** -> **User Stories (Phases 3, 4, 5)** -> **Polish (Phase 6)**

### User Story Dependencies
- **US1, US2, US3**: All depend on the Foundational phase being complete.
- **US2 (AI vs Player)** builds upon the core logic from **US1 (2-Player)**. It's recommended to complete US1 first.
- **US3 (Rule Prevention)** enhances the experience of both US1 and US2.

### Parallel Opportunities
- Once the Foundational phase is done, work on US1, US2, and US3 can be parallelized, though there are dependencies in the game logic.
- **Recommended order**: US1 -> US3 -> US2, as the core rules and UI helpers should be stable before adding AI complexity.
- Tasks marked [P] can generally be worked on concurrently.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: A complete 2-player game is playable. This is the core product.

### Incremental Delivery
1. Deliver MVP (US1).
2. Add US3 (Rule Prevention) to improve the core experience.
3. Add US2 (AI Opponent) as a major feature enhancement.
4. Finish with Phase 6 (Polish).