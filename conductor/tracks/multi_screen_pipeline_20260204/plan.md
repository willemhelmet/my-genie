# Implementation Plan - Multi-screen AI Pipeline UI

## Phase 1: Foundation & Routing
- [ ] Task: Install `wouter` and set up basic routing in `App.tsx`.
- [ ] Task: Update `gameSlice.ts` to include `generate` and `review` statuses and data storage.
- [ ] Task: Create `aiPipeline.ts` service with placeholder functions for the three APIs.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Routing' (Protocol in workflow.md)

## Phase 2: UI Implementation
- [ ] Task: Refactor `MainMenu.tsx` into the new "Hero" screen with a gallery.
- [ ] Task: Implement `GenerateScreen.tsx` with prompt input and Glassmorphism styling.
- [ ] Task: Implement `ReviewScreen.tsx` with image display and refinement input.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Implementation' (Protocol in workflow.md)

## Phase 3: Pipeline Integration & Polish
- [ ] Task: Connect UI screens to the `aiPipeline` service.
- [ ] Task: Implement the `console.log` transparency layer across the pipeline.
- [ ] Task: Final visual polish using Tailwind v4 Glassmorphic utilities.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Pipeline Integration & Polish' (Protocol in workflow.md)
