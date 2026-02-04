# Specification - Multi-screen AI Pipeline UI

## Overview
This track implements the sequential user journey for Genie:
1. **Hero Screen:** Immersive introduction with a gallery and a "Create" button.
2. **Generate Screen:** Prompt input for image generation using the Nano Banana API.
3. **Review/Edit Screen:** Display the generated image and allow prompt refinement before 3D conversion.
4. **3D World:** Transition to the existing Gaussian Splatting environment.

## Functional Requirements
- **State Management:** Extend the `zustand` store to handle new statuses (`generate`, `review`) and store pipeline data (prompts, image URLs).
- **Routing:** Integrate `wouter` for navigation between screens.
- **Service Layer:** Create a centralized service to handle sequential API calls (Nano Banana -> Marble World Labs -> Decart Realtime).
- **Glassmorphism UI:** Apply the futuristic aesthetic to all new UI components.
- **Developer Transparency:** Implement comprehensive `console.log` for every pipeline step.

## Technical Details
- **Router:** `wouter`
- **State:** `src/store/gameSlice.ts`
- **Services:** `src/services/aiPipeline.ts`
- **Components:** `src/components/ui/`
