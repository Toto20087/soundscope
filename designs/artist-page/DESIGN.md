# Design System Specification

## 1. Overview & Creative North Star: "The Living Archive"
This design system is built to transform music data into a high-end editorial experience. Our Creative North Star is **"The Living Archive."** Unlike standard music platforms that feel like utility-driven databases, this system treats every artist, track, and data point as a curated exhibition. 

We break the "template" look by favoring **intentional asymmetry** and **tonal depth** over rigid grids. By utilizing massive scale contrasts in typography and generous, "gallery-grade" whitespace, we elevate data visualization from mere charts into storytelling. The UI should feel like a premium physical magazine that has come to life—breathable, tactile, and authoritative.

---

### 2. Colors & Surface Philosophy
The palette is rooted in a "White-on-White" architectural philosophy. We rely on the interplay between pure light and subtle depth.

*   **Primary Accent (`primary` #91000a):** This is a dynamic token. For our Kendrick Lamar example, we use a deep crimson. This color is the "ink" of our editorial—used for highlights, active states, and data points.
*   **Neutral Palette:** 
    *   `surface-container-lowest`: #FFFFFF (The base layer, used for cards to pop).
    *   `surface`: #f9f9f9 (The primary background).
    *   `surface-container-high`: #e8e8e8 (For subtle nested sections).

#### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be created through:
1.  **Background Shifts:** Placing a `surface-container-lowest` card on a `surface` background.
2.  **Negative Space:** Using the Spacing Scale (specifically `12` through `24`) to create "voids" that act as separators.

#### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine vellum paper. Use the `surface-container` tiers to create hierarchy. A `surface-container-low` section can house several `surface-container-lowest` cards, creating a natural, soft "lift" without visual noise.

#### The "Glass & Gradient" Rule
To add "soul" to the minimalist aesthetic, use **Glassmorphism** for floating headers or navigation. Apply a semi-transparent `surface` color with a 20px backdrop-blur. For hero sections, apply a subtle linear gradient from `primary` to `primary_container` (at 10% opacity) to create an atmospheric glow rather than a flat fill.

---

### 3. Typography: The Editorial Voice
Typography is the primary driver of our brand identity. We use a high-contrast scale to guide the user’s eye through the narrative.

*   **Display & Headlines (Manrope):** These are the "Art Directors" of the page. Use `display-lg` (3.5rem) with a Black (900) weight for artist names. The tight tracking and massive scale command immediate attention.
*   **Body & Titles (Inter/Satoshi):** These are the "Editors." `body-lg` (1rem) provides the legibility of a high-end journal. 
*   **Labels (Inter):** Small, wide-tracked labels (`label-md`) are used for metadata, providing a technical, precise counterpoint to the bold headlines.

---

### 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` element placed on `surface-container-low` creates a perceived elevation of +1 without a single shadow pixel.
*   **Ambient Shadows:** If a floating element (like a player bar) requires a shadow, it must be an **Ambient Glow**: `0px 20px 40px rgba(26, 28, 28, 0.04)`. The shadow color is a tint of the `on-surface` token, never pure black.
*   **The "Ghost Border" Fallback:** If an edge must be defined (e.g., in accessibility-critical components), use the `outline-variant` token at **15% opacity**. This creates a "breath" of a line rather than a hard edge.

---

### 5. Components

#### Cards & Lists
*   **Style:** No borders. Use `roundedness-lg` (2rem) for artist cards and `roundedness-DEFAULT` (1rem) for track cards. 
*   **Spacing:** Use `spacing-6` (2rem) as the internal padding standard.
*   **Requirement:** Never use divider lines. Separate list items with a `spacing-2` vertical gap or a alternating `surface-container` backgrounds.

#### Action Components (Buttons & Chips)
*   **Primary Button:** Pill-shaped (`roundedness-full`). Background: `primary`. Text: `on-primary`. No shadow; use a subtle scale-up (1.02x) on hover.
*   **Pill Badges (Chips):** Use `surface-container-high` backgrounds with `on-surface-variant` text. These should feel like small physical tabs.

#### Minimalist Charts (The Data Story)
*   **Execution:** Use the `primary` dynamic color for the main data series.
*   **Radar/Scatter:** Remove all grid lines. Use the `outline-variant` (at 20% opacity) only for the outermost axes.
*   **Interaction:** On hover, data points should expand and trigger a semi-transparent `primary-container` tooltip with a 12px backdrop blur.

#### High-Quality Artist Photography
*   **The "Bleed" Effect:** Images should often bleed off the edge of their container or use asymmetrical `roundedness` (e.g., top-left 3rem, others 1rem) to create a custom, editorial feel.

---

### 6. Do’s and Don’ts

#### Do
*   **Do** use asymmetrical margins (e.g., a wider left margin than right) to mimic modern magazine layouts.
*   **Do** prioritize the `display-lg` typography scale for entry points of a page.
*   **Do** use `spacing-20` or higher to separate major content themes.

#### Don't
*   **Don't** use 1px solid borders for anything other than "Ghost Borders" at low opacity.
*   **Don't** use traditional "Material" drop shadows. If it feels "heavy," reduce the opacity.
*   **Don't** cram content. If you think there is enough whitespace, add 20% more.
*   **Don't** use standard blue/green for "Success" or "Info"—rely on the `primary` accent and neutral grays to maintain the high-end monochromatic feel.