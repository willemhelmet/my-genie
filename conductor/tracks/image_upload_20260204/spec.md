# Specification - User Image Upload

## Overview
This track adds the ability for users to upload their own 2D images directly into the Genie pipeline, bypassing the Nano Banana generation stage. This provides more control for users who have pre-existing assets they want to convert into 3D environments.

## Functional Requirements
- **Upload UI (Generate Screen):**
    - Implement a "Drop Zone" for Drag and Drop support.
    - Provide a fallback "Select File" button using a standard file input.
    - **Interleaved Preview:** Once a file is selected/dropped, show a thumbnail preview directly on the "Generate Screen".
- **File Support:**
    - Formats: `.jpg`, `.jpeg`, `.png`, `.webp`.
    - Handle file reading on the client side to generate a data URL for preview and storage.
- **Workflow Integration:**
    - Uploading an image replaces any currently generated image in the `zustand` store (`generatedImage`).
    - The user remains on the "Generate Screen" after selection to confirm or change the image.
    - Add a "Proceed to Review" button that appears only after an image is uploaded or generated.
- **State Management:**
    - Update the `zustand` store to track whether the `generatedImage` was "uploaded" or "ai-generated" (optional, for logging).

## Non-Functional Requirements
- **UX Consistency:** Maintain the "Futuristic Glassmorphism" aesthetic for the drop zone and preview UI.
- **Developer Transparency:** `console.log` file metadata (name, size, type) upon selection.

## Acceptance Criteria
- [ ] User can drag and drop an image onto the "Generate Screen".
- [ ] User can select an image via a file picker.
- [ ] The selected image is previewed instantly on the screen.
- [ ] The "Proceed to Review" button correctly navigates to the "Review Screen" with the uploaded image.
- [ ] The uploaded image successfully flows through the Marble World Labs pipeline when "ENTER WORLD" is clicked.

## Out of Scope
- Server-side storage of uploaded images.
- Image cropping or editing tools within the Genie app.
- Multiple file uploads (batch processing).
