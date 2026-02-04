# Specification - Remove Backend Server & Multiplayer Logic

## Overview
This track focuses on streamlining the Genie application by removing all backend-related code and multiplayer functionality. The application will transition to a purely frontend-driven, single-player AI experience.

## Functional Requirements
- **Server Removal:**
    - Permanently delete the `server/` directory and all its contents (`server.js`, `marbleService.js`, `package.json`, etc.).
- **Multiplayer Cleanup (Frontend):**
    - Remove the Socket.io client integration.
    - Delete `src/services/socketManager.ts`.
    - Remove socket initialization and cleanup logic from `src/App.tsx`.
- **3D Scene Refactoring:**
    - Delete `src/components/RemotePlayerManager.tsx` and `src/components/RemotePlayer.tsx`.
    - Remove `<RemotePlayerManager />` from `src/Scene.tsx`.
- **Package Maintenance:**
    - Uninstall `socket.io-client` and any other purely backend-related dependencies from the root `package.json`.

## Non-Functional Requirements
- **Build Integrity:** Ensure the application builds and runs correctly in a purely local context after removal.
- **State Consistency:** Verify that `zustand` store no longer contains or expects multiplayer-related state.

## Acceptance Criteria
- [ ] The `server/` directory is gone.
- [ ] `src/services/socketManager.ts` is deleted.
- [ ] No Socket.io references remain in `src/App.tsx` or `src/Scene.tsx`.
- [ ] `npm run build` passes without errors.
- [ ] The application remains fully functional for image and 3D generation.

## Out of Scope
- Re-implementing multiplayer features.
- Changing the AI pipeline logic (Nano Banana/Marble/Decart).
