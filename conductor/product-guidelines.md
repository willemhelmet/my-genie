# Product Guidelines - Genie

## Voice and Tone
- **Inspirational and Friendly (Minimalist):** The prose should emphasize the "magic" of the AI pipeline while remaining extremely concise.
- **Action-Oriented:** Use short, impactful labels. Avoid verbose explanations in the UI.

## Visual Identity
- **Aesthetic:** Futuristic Glassmorphism. semi-transparent, blurred backgrounds with vibrant accents.
- **Color Palette:** High-Contrast Digital. Deep blacks and pure whites with a single bold accent color (e.g., "Genie Blue").
- **Typography:** Monospaced primary fonts to reinforce a "technical/developer" aesthetic, suitable for high-contrast digital layouts.

## User Experience (UX) Principles
- **Clarity through Contrast:** Use the high-contrast palette to guide the user's eye to primary actions (Generate, Review, Enter World).
- **Immersive Feedback:** While the UI is minimalist (showing a simple "Loading..." screen), the background operations should be extremely transparent to developers.
- **Developer Transparency:** **CRITICAL:** The application must `console.log` every step of the AI pipeline (Nano Banana, Marble World Labs, Decart) to facilitate debugging and understanding of the sequence.

## Interaction Design
- **Step-by-Step Flow:** The UI should strictly follow the sequential nature of the pipeline (Hero -> Generate -> Review/Edit -> 3D World).
- **Glassmorphic Elements:** UI panels should feel like overlays "floating" above the generated content or the 3D scene.
