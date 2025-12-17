# Design Decisions Log

## 2025-12-17: Homepage Redesign (Reference: landingsite.ai)

### Analysis of Reference Site
- **Visual Style**: Clean, modern, high contrast.
- **Color Palette**:
    - Background: Pure White (`#FFFFFF`) to create a spacious feel.
    - Text: Dark Gray (`#2D3748`) for readability.
    - Primary Color: Bright, trustworthy Blue (`#3182CE`).
- **Typography**: System sans-serif (Clean, readable).
- **Layout**:
    - Navigation: Clean white header.
    - Hero: Left-aligned text, strong value proposition, dual CTA buttons.
- **UI Elements**:
    - Buttons: `rounded-lg` (8px), shadow effects.
    - Cards: Minimalist with white background.

### Design Decisions Implemented
1.  **Color Update**:
    - Updated `--primary` from `#2C5F8D` (muted blue) to `#3182CE` (brighter blue) for a more modern, energetic look.
    - Changed `--background` to `#FFFFFF` to match the reference site's clean aesthetic.
    - Adjusted `--radius` to `0.5rem` (8px) for a subtle, modern curvature.

2.  **Layout Refinement**:
    - **Hero Section**: Shifted from centered text to left-aligned text on desktop to improve readability and visual hierarchy.
    - **Header**: Simplified to be cleaner.

3.  **Content**:
    - Updated CTA buttons to specific actions ("Secure My Legacy", "Explore Solutions") rather than generic "Start".
    - Improved headline hierarchy.

### Rationale
The goal is to move from a generic "template" feel to a premium, trustworthy legal/fintech aesthetic. The brighter blue invokes confidence, while the white background feels professional and organized—critical for an estate planning app. Left-aligned typography is generally easier to scan for serious content.
