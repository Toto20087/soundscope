# SoundScope Design Guide
## Comprehensive UI/UX Research & Recommendations

---

## Table of Contents
1. [Research Sources Summary](#research-sources)
2. [Design System Foundation](#design-system)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Landing/Home Page](#landing-page)
6. [Artist Profile Page](#artist-profile)
7. [Timeline Visualization](#timeline)
8. [Charts & Data Visualization](#charts)
9. [Component Library](#components)
10. [Animations & Micro-interactions](#animations)
11. [Responsive Strategy](#responsive)

---

## 1. Research Sources Summary <a name="research-sources"></a>

### Resource 1: UI/UX Pro Max Skill

**What it is:** An AI-powered design intelligence tool (`uipro-cli`) that integrates with Claude Code, Cursor, and other AI assistants. It provides industry-specific design matching across 161 product categories.

**Key offerings:**
- 8 landing page patterns (Hero-Centric, Conversion-Optimized, Feature-Rich Showcase, Minimal & Direct, Social Proof-Focused, Interactive Product Demo, Trust & Authority, Storytelling-Driven)
- 10 dashboard styles including Data-Dense, Real-Time Monitoring, Drill-Down Analytics, Comparative Analysis, and User Behavior Analytics
- 25 chart type recommendations
- 67 UI styles including Dark Mode (OLED), Glassmorphism, Liquid Glass, and Soft UI Evolution
- 57 font combination pairings
- 161 color palettes aligned to product types
- 99 UX/accessibility best practices

**Applicable design principles for SoundScope:**
- Use the "Feature-Rich Showcase" landing page pattern combined with "Hero-Centric" design
- Apply the "Drill-Down Analytics" dashboard style for artist deep-dives
- Use the "Comparative Analysis" dashboard for chart comparisons
- Apply "Dark Mode (OLED)" + "Glassmorphism" UI style combination
- Follow their pre-delivery checklist: no emojis as icons (use Lucide), cursor-pointer on clickables, hover states with 150-300ms transitions, text contrast minimum 4.5:1, focus states visible for keyboard navigation, `prefers-reduced-motion` respected
- Test at breakpoints: 375px, 768px, 1024px, 1440px

**Design system approach:** Auto-generates complete design systems via pattern matching, style selection, color palette assignment, and typography pairing -- all aligned to the specific product category.

### Resource 2: 21st.dev Community Components

**What it is:** A community-driven component marketplace built for React and Tailwind CSS, following a "copy and remix" model.

**Available component categories:**
- Shaders (visual effects, backgrounds)
- Heroes (hero sections for landing pages)
- Features (feature showcase sections)
- AI Chat Components
- Calls to Action
- Buttons
- Testimonials
- Pricing Sections
- Text Components

**Integration:** Built natively for Next.js with Tailwind CSS. Supports dark mode via `prefers-color-scheme` with localStorage persistence. Free/community-based.

**Useful for SoundScope:**
- **Heroes** -- for the landing page hero section with search
- **Shaders** -- for animated gradient backgrounds behind artist profiles
- **Buttons** -- for CTAs and filter controls
- **Text Components** -- for animated headings and stats displays
- **Features** -- adaptable for showcasing app capabilities on the landing page

**Limitation:** No specific music, chart, or timeline components -- those need to come from other libraries (Recharts, React-Chrono, etc.)

---

## 2. Design System Foundation <a name="design-system"></a>

### Visual Identity

SoundScope should feel like **"Spotify's analytics dashboard meets Bloomberg Terminal, wrapped in premium glassmorphism."** The design should convey:

- **Premium** -- glass effects, subtle gradients, refined spacing
- **Data-rich** -- information-dense but never cluttered
- **Musical** -- rhythm in spacing, harmony in color, flow in transitions
- **Modern** -- 2025-2026 design trends: dark glassmorphism, ambient gradients, micro-interactions

### Design Language Keywords
`Premium Dark` | `Glassmorphic` | `Data-Forward` | `Ambient Gradients` | `Musical Flow`

### Layout Grid

```
Container max-width: 1440px
Columns: 12-column grid
Gutter: 24px (desktop), 16px (tablet), 12px (mobile)
Page padding: 64px (desktop), 32px (tablet), 16px (mobile)
Section spacing: 96px (desktop), 64px (tablet), 48px (mobile)
```

### Spacing Scale (base 4px)

```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   16px  (1rem)
lg:   24px  (1.5rem)
xl:   32px  (2rem)
2xl:  48px  (3rem)
3xl:  64px  (4rem)
4xl:  96px  (6rem)
5xl:  128px (8rem)
```

### Border Radius Scale

```
sm:   6px   -- small chips, tags
md:   8px   -- buttons, inputs
lg:   12px  -- cards, containers
xl:   16px  -- large cards, modals
2xl:  24px  -- hero cards, featured items
full: 9999px -- avatars, pills
```

---

## 3. Color Palette <a name="color-palette"></a>

### Core Background Colors (Dark Theme)

```
--bg-primary:      #0A0A0F    (deepest background, page level)
--bg-secondary:    #12121A    (card backgrounds, sections)
--bg-tertiary:     #1A1A2E    (elevated surfaces, dropdowns)
--bg-quaternary:   #252540    (hover states, active surfaces)
```

**Rationale:** Avoid pure black (#000000). Use near-black with a subtle blue/purple undertone to create depth and a "night sky" feel that resonates with music/entertainment. Google Material Design recommends #121212; we shift slightly cooler for the music aesthetic.

### Glass Surface Colors

```
--glass-bg:        rgba(255, 255, 255, 0.05)    (default glass)
--glass-bg-hover:  rgba(255, 255, 255, 0.08)    (hover state)
--glass-bg-active: rgba(255, 255, 255, 0.12)    (active/pressed)
--glass-border:    rgba(255, 255, 255, 0.10)    (glass edge)
--glass-border-hover: rgba(255, 255, 255, 0.15) (hover edge)
```

### Text Colors

```
--text-primary:    #F5F5F7    (headings, primary content -- NOT pure white)
--text-secondary:  #A1A1AA    (descriptions, secondary labels)
--text-tertiary:   #71717A    (placeholders, disabled text)
--text-accent:     #C084FC    (highlighted text, links)
```

**Contrast check:** #F5F5F7 on #0A0A0F = ~18:1 ratio (exceeds WCAG AAA). #A1A1AA on #0A0A0F = ~8:1 ratio (exceeds WCAG AA).

### Accent Colors (Primary Palette)

```
--accent-purple:     #8B5CF6    (primary brand, main actions)
--accent-purple-light: #A78BFA  (hover states, secondary)
--accent-purple-dark:  #7C3AED  (pressed states)
--accent-violet:     #C084FC    (highlights, special emphasis)
```

### Chart / Data Visualization Colors

These are 20% desaturated compared to light mode equivalents, per dark-mode best practices:

```
--chart-purple:    #8B5CF6    (primary metric)
--chart-cyan:      #22D3EE    (secondary metric)
--chart-emerald:   #34D399    (positive/growth)
--chart-amber:     #FBBF24    (warning/neutral)
--chart-rose:      #FB7185    (negative/decline)
--chart-sky:       #38BDF8    (tertiary metric)
--chart-orange:    #FB923C    (quaternary metric)
--chart-indigo:    #818CF8    (additional series)
```

### Gradient Definitions

```css
/* Hero gradient -- the signature SoundScope gradient */
--gradient-hero: linear-gradient(135deg, #1a0533 0%, #0a0a1a 40%, #0a1628 70%, #0a0a0f 100%);

/* Card accent gradient (top border glow) */
--gradient-card-accent: linear-gradient(90deg, #8B5CF6 0%, #22D3EE 50%, #34D399 100%);

/* Ambient background gradient (animated, behind glass cards) */
--gradient-ambient: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.10) 0%, transparent 50%),
                    radial-gradient(circle at 50% 80%, rgba(251, 113, 133, 0.08) 0%, transparent 50%);

/* Track popularity bar gradient */
--gradient-popularity: linear-gradient(90deg, #8B5CF6 0%, #C084FC 50%, #22D3EE 100%);

/* Stat number glow */
--gradient-stat-text: linear-gradient(135deg, #F5F5F7 0%, #C084FC 100%);
```

### Semantic Colors

```
--success:     #34D399
--warning:     #FBBF24
--error:       #FB7185
--info:        #38BDF8
```

---

## 4. Typography <a name="typography"></a>

### Font Stack Recommendation

**Primary (Headings):** `Sora` or `Outfit`
- Geometric sans-serif with modern character
- Sora: designed for digital-first contexts, wide stance, sharp shapes -- "Inter with more edge"
- Outfit: geometric, clean, excellent weight range

**Secondary (Body/Data):** `Inter`
- Industry-standard screen font with large x-height for readability
- 9 weights + variable font support
- Excellent for data-dense interfaces

**Monospace (Numbers/Stats):** `JetBrains Mono` or `Space Mono`
- For displaying numerical data, stats, timestamps
- Tabular figures for aligned numbers in charts

### Type Scale

```
Display (hero headlines):     56px / 3.5rem  | font-weight: 700 | line-height: 1.1  | letter-spacing: -0.02em
H1 (page titles):            40px / 2.5rem  | font-weight: 700 | line-height: 1.2  | letter-spacing: -0.02em
H2 (section titles):         32px / 2rem    | font-weight: 600 | line-height: 1.25 | letter-spacing: -0.01em
H3 (subsection titles):      24px / 1.5rem  | font-weight: 600 | line-height: 1.3  | letter-spacing: 0
H4 (card titles):            20px / 1.25rem | font-weight: 600 | line-height: 1.4  | letter-spacing: 0
Body Large:                  18px / 1.125rem| font-weight: 400 | line-height: 1.6  | letter-spacing: 0
Body:                        16px / 1rem    | font-weight: 400 | line-height: 1.6  | letter-spacing: 0
Body Small:                  14px / 0.875rem| font-weight: 400 | line-height: 1.5  | letter-spacing: 0
Caption:                     12px / 0.75rem | font-weight: 500 | line-height: 1.4  | letter-spacing: 0.02em
Stat Number (large display):  72px / 4.5rem | font-weight: 700 | line-height: 1.0  | letter-spacing: -0.03em | font-family: monospace
```

### Tailwind Config

```js
fontFamily: {
  heading: ['Sora', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
```

---

## 5. Landing / Home Page <a name="landing-page"></a>

### Overall Approach
Use the **"Hero-Centric + Feature-Rich Showcase"** pattern (from UI/UX Pro Max). The landing page should be a single-scroll experience that draws users in with a dramatic hero, then reveals the app's power through progressive disclosure.

### Hero Section

**Layout: Full-viewport hero with centered content**

```
+------------------------------------------------------------------+
|                                                                  |
|  [Ambient gradient background with subtle animated mesh]         |
|                                                                  |
|              SOUNDSCOPE                                          |
|        Discover Music Like Never Before                          |
|                                                                  |
|     +--------------------------------------------------+        |
|     | [Search icon] Search for any artist...     [->]   |        |
|     +--------------------------------------------------+        |
|     | [Autocomplete suggestions with artist avatars]    |        |
|     +--------------------------------------------------+        |
|                                                                  |
|        Popular: Drake | Taylor Swift | Kendrick Lamar            |
|                                                                  |
+------------------------------------------------------------------+
```

**Hero design specifications:**

- **Background:** `--gradient-hero` with animated ambient gradient orbs floating slowly (CSS animated radial gradients or canvas-based particles)
- **Title:** Display size (56px), font-weight 700, with gradient text effect (`--gradient-stat-text`) using `background-clip: text`
- **Subtitle:** Body Large (18px), `--text-secondary` color, max-width 600px for optimal line length
- **Search bar:** The centerpiece. Large (56px height), glassmorphic background (`bg-white/5 backdrop-blur-xl border border-white/10`), rounded-2xl, with a subtle purple glow on focus (`ring-2 ring-purple-500/30`)
- **Popular artists:** Caption size, `--text-tertiary`, with hover effect revealing artist mini-avatar

**Search bar design (the most important interactive element):**

```
Idle:       bg-white/5, border-white/10, placeholder text "What do you want to explore?"
Focused:    bg-white/8, border-purple-500/30, ring-2 ring-purple-500/20, scale(1.02) transition
Typing:     Suggestions dropdown appears with glassmorphic panel
Suggestion: Each row has: [Artist avatar 32px] [Name] [Genre chip] [Chevron]
```

Inspired by Spotify's conversational placeholder: "What do you want to explore?" rather than generic "Search..."

**Micro-interactions:**
- Ambient gradient orbs drift slowly (15-20s animation cycle)
- Search bar has a breathing glow animation when idle (subtle pulse on the border)
- On scroll down, hero content fades and scales slightly, revealing the next section
- Popular artist names have a subtle underline animation on hover

### Below-the-fold Sections

**Section 1: "What You'll Discover" (Feature showcase)**
Three glassmorphic cards in a row showing:
1. Artist Deep Dives -- with an icon of a microphone
2. Album Timelines -- with an icon of a timeline
3. Track Analytics -- with an icon of a chart

Each card uses the GlassCard component with a colored top-border accent using `--gradient-card-accent`.

**Section 2: "Trending Now" (Social proof)**
A horizontal scroll of trending artist cards with album art, animated entrance using stagger.

---

## 6. Artist Profile Page <a name="artist-profile"></a>

### Hero Banner

**Layout: Full-width gradient banner with artist image**

```
+------------------------------------------------------------------+
| [Gradient overlay on blurred artist image background]            |
|                                                                  |
|  [Back arrow]                                      [Share] [Save]|
|                                                                  |
|   +--------+                                                     |
|   | Artist |  ARTIST NAME                                        |
|   | Image  |  Pop | R&B | Soul                                   |
|   | 200x200|  Monthly Listeners: 85.2M                           |
|   +--------+  Followers: 42.1M                                   |
|                                                                  |
|   [Albums: 12]  [Singles: 34]  [Features: 67]                    |
+------------------------------------------------------------------+
```

**Hero banner specifications:**

- **Background:** Artist image, heavily blurred (blur-3xl / 64px), with a gradient overlay from transparent to `--bg-primary` at the bottom. This creates a dramatic "emanating from the artist" effect
- **Artist image:** 200x200px, rounded-2xl with a subtle border (`border-2 border-white/10`), with a faint purple shadow (`shadow-[0_0_40px_rgba(139,92,246,0.3)]`)
- **Artist name:** H1 (40px), bold, white
- **Genre tags:** Small chips with glassmorphic background, rounded-full, `text-xs font-medium px-3 py-1`

**Genre tag/chip design:**

```css
/* Base chip */
bg-white/10 border border-white/10 rounded-full px-3 py-1
text-xs font-medium text-white/80

/* With genre-specific accent colors */
Pop:        border-purple-500/30 text-purple-300
Rock:       border-rose-500/30 text-rose-300
R&B:        border-cyan-500/30 text-cyan-300
Hip-Hop:    border-amber-500/30 text-amber-300
Electronic: border-emerald-500/30 text-emerald-300
Jazz:       border-sky-500/30 text-sky-300
```

### Stats Display

**Layout: Horizontal row of stat cards**

```
+----------------+  +----------------+  +----------------+
| [Icon]         |  | [Icon]         |  | [Icon]         |
| 85.2M          |  | 42.1M          |  | 12             |
| Monthly Listen.|  | Followers      |  | Albums         |
+----------------+  +----------------+  +----------------+
```

**Stat card design:**
- GlassCard with `bg-white/5 backdrop-blur-md border border-white/10`
- Icon: 24px Lucide icon in `--accent-purple` color
- Number: Stat Number size (48-72px depending on context), mono font, with gradient text effect
- Label: Caption size, `--text-secondary`
- On hover: subtle scale(1.02) with increased glass brightness

### Content Sections (below hero)

The page should use a section-based scroll layout with clear visual separation:

1. **Top Tracks** -- Numbered list with popularity bars
2. **Discography Timeline** -- See Timeline section below
3. **Related Artists** -- Horizontal scroll of artist cards
4. **Fun Facts** -- Glassmorphic card grid

**Top Tracks row design:**

```
+------------------------------------------------------------------+
| 1  [Album Art 48px]  Track Name             3:42    [=========  ]|
|                      Album Name                      87/100      |
+------------------------------------------------------------------+
```

- Row: `hover:bg-white/5 transition-colors duration-200 rounded-lg px-4 py-3`
- Track number: mono font, `--text-tertiary`
- Album art: 48x48px, rounded-md
- Track name: Body font, white
- Album name: Body Small, `--text-secondary`
- Duration: mono font, `--text-tertiary`
- Popularity bar: gradient fill (`--gradient-popularity`), height 4px, rounded-full, with background track in `--bg-quaternary`

**Popularity bar implementation:**

```html
<div class="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
  <div
    class="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-400"
    style="width: 87%"
  />
</div>
```

Add `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` for accessibility.

### Fun Fact Cards

```
+------------------------------------------+
| [Lightbulb icon]          "Did you know?" |
|                                          |
| This artist's most popular track was     |
| released on a Tuesday, which is the      |
| most common release day for #1 hits.     |
|                                          |
| [Source: SoundScope Analysis]            |
+------------------------------------------+
```

**Fun fact card specifications:**
- GlassCard with a colored left border (3px, `--accent-purple`)
- Lightbulb icon from Lucide in amber/yellow
- "Did you know?" label in Caption, uppercase, `--text-tertiary`
- Fact text in Body, white
- Source in Caption, `--text-tertiary`
- Subtle entrance animation: fade-in + slide-up when scrolled into view

---

## 7. Timeline Visualization <a name="timeline"></a>

### Recommended Approach: Horizontal Timeline

For SoundScope's album timeline, use a **horizontal timeline** on desktop (converts to vertical on mobile). This mirrors the natural left-to-right reading of chronological data and maps well to music release history.

**Timeline design:**

```
2015        2017         2019          2021         2023
  |           |            |             |            |
  o-----------o------------o-------------o------------o
  |           |            |             |            |
[Album 1]  [Album 2]   [Album 3]    [Album 4]    [Album 5]
 Debut      Platinum     Grammy       Comeback     Latest
```

### Node Design

Each node (album/single) should encode data visually:

- **Size:** Node diameter maps to album popularity (24px to 48px)
- **Color:** Node fill maps to album type:
  - Studio album: `--chart-purple` (#8B5CF6)
  - Single: `--chart-cyan` (#22D3EE)
  - EP: `--chart-emerald` (#34D399)
  - Live album: `--chart-amber` (#FBBF24)
  - Compilation: `--chart-sky` (#38BDF8)
- **Opacity:** Maps to commercial success (0.4 to 1.0 range)
- **Glow:** The most popular album gets a pulsing glow ring

### Node hover interaction

On hover, the node:
1. Scales to 1.2x with spring animation
2. Shows a glassmorphic tooltip card with:
   - Album artwork (80x80px)
   - Album name (H4)
   - Release date
   - Track count
   - Key stats (popularity, chart position)
3. Connecting line brightens

### Timeline track design

```css
/* The horizontal line connecting nodes */
height: 2px;
background: linear-gradient(90deg,
  transparent 0%,
  rgba(139, 92, 246, 0.3) 10%,
  rgba(139, 92, 246, 0.3) 90%,
  transparent 100%
);
```

### Interactive features

- **Scroll/drag** to navigate horizontally through time
- **Pinch-to-zoom** on touch devices to focus on a time period
- **Click a node** to expand into a detailed album view (inline or drawer)
- **Year labels** along the top axis, with month granularity on zoom
- On mobile: convert to a vertical timeline with alternating left/right cards

### Library recommendation

Use a custom implementation with `framer-motion` for animations and direct DOM positioning. React-Chrono is an option for rapid prototyping but limits visual customization. For the custom approach, position nodes absolutely within a scrollable container and use `useScroll` + `useTransform` from framer-motion for parallax effects.

---

## 8. Charts & Data Visualization <a name="charts"></a>

### Recharts Configuration for Dark Theme

**Global chart configuration:**

```jsx
const CHART_THEME = {
  // Axis and grid
  axisStroke: 'rgba(255, 255, 255, 0.1)',     // very subtle grid lines
  axisTickFill: '#71717A',                      // --text-tertiary for labels
  axisTickFontSize: 12,
  axisTickFontFamily: 'Inter, system-ui',

  // Tooltip
  tooltipBg: 'rgba(18, 18, 26, 0.95)',         // --bg-secondary with high opacity
  tooltipBorder: 'rgba(255, 255, 255, 0.1)',
  tooltipBorderRadius: 12,

  // Animation
  animationDuration: 800,
  animationEasing: 'ease-out',

  // Colors (in order of use)
  colors: [
    '#8B5CF6',  // purple  (primary)
    '#22D3EE',  // cyan    (secondary)
    '#34D399',  // emerald (tertiary)
    '#FBBF24',  // amber   (quaternary)
    '#FB7185',  // rose    (quinary)
    '#38BDF8',  // sky     (senary)
    '#FB923C',  // orange  (septenary)
    '#818CF8',  // indigo  (octonary)
  ],
};
```

**Use CSS variables for automatic dark/light switching:**

```css
:root {
  --chart-grid: rgba(255, 255, 255, 0.1);
  --chart-text: #71717A;
  --chart-tooltip-bg: rgba(18, 18, 26, 0.95);
}
```

### Chart Types Recommended for SoundScope

**1. Area Chart -- Listening Trends Over Time**

```jsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
    <XAxis dataKey="month" stroke="#71717A" fontSize={12} />
    <YAxis stroke="#71717A" fontSize={12} />
    <Tooltip content={<CustomTooltip />} />
    <Area
      type="monotone"
      dataKey="listeners"
      stroke="#8B5CF6"
      fill="url(#purpleGradient)"
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>
```

**2. Bar Chart -- Track Popularity Comparison**
- Use rounded bars (`radius={[6, 6, 0, 0]}`)
- Gradient fills per bar using `<linearGradient>` in `<defs>`
- Hover effect: bar brightens + tooltip appears

**3. Radar Chart -- Artist Profile Attributes**
- Use for showing artist dimensions: popularity, danceability, energy, valence, acousticness
- Fill area with `--chart-purple` at 0.2 opacity
- Stroke with `--chart-purple` at full opacity
- Grid lines in `rgba(255, 255, 255, 0.05)`

**4. Pie/Donut Chart -- Genre Distribution**
- Use donut (inner radius 60%) for genre breakdowns
- Each genre slice uses a chart color from the palette
- Center label shows total or dominant genre
- On hover: slice expands slightly (outerRadius + 8)

### Custom Tooltip Component

```jsx
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#12121A]/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-sm text-white/60 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};
```

### Chart Interaction Patterns

- **Toggle data series:** Use pill-shaped toggle buttons above the chart (glassmorphic, with colored dots matching the series)
- **Time range selector:** Pill buttons for 7D / 1M / 3M / 1Y / ALL
- **Responsive:** Charts should be wrapped in `<ResponsiveContainer>` and use percentage widths
- **Loading state:** Skeleton with animated gradient pulse in `--bg-tertiary`

---

## 9. Component Library <a name="components"></a>

### Foundation: shadcn/ui + Custom Extensions

Use **shadcn/ui** as the component foundation because:
- Built for Next.js and Tailwind CSS
- CSS variable-based theming with native dark mode
- Copy-paste model (full control, no dependency lock-in)
- Active community with regular updates (Tailwind v4 support as of 2026)

### Core Components Needed

#### GlassCard (Custom)

The foundational container component for SoundScope:

```jsx
const GlassCard = ({ children, className, accentColor, glow = false }) => (
  <div className={cn(
    "relative overflow-hidden",
    "bg-white/[0.05] backdrop-blur-xl",
    "border border-white/[0.1]",
    "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
    "rounded-2xl p-6",
    "transition-all duration-300",
    "hover:bg-white/[0.08] hover:border-white/[0.15]",
    glow && "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    className
  )}>
    {accentColor && (
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400" />
    )}
    {children}
  </div>
);
```

#### StatCard

```jsx
const StatCard = ({ icon: Icon, value, label, trend }) => (
  <GlassCard className="text-center">
    <Icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
    <div className="text-3xl font-bold font-mono bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent">
      {value}
    </div>
    <div className="text-sm text-white/50 mt-1">{label}</div>
    {trend && (
      <div className={cn(
        "text-xs mt-2 font-medium",
        trend > 0 ? "text-emerald-400" : "text-rose-400"
      )}>
        {trend > 0 ? "+" : ""}{trend}%
      </div>
    )}
  </GlassCard>
);
```

#### GenreChip

```jsx
const GENRE_COLORS = {
  Pop: { border: 'border-purple-500/30', text: 'text-purple-300' },
  Rock: { border: 'border-rose-500/30', text: 'text-rose-300' },
  'R&B': { border: 'border-cyan-500/30', text: 'text-cyan-300' },
  'Hip-Hop': { border: 'border-amber-500/30', text: 'text-amber-300' },
  Electronic: { border: 'border-emerald-500/30', text: 'text-emerald-300' },
};

const GenreChip = ({ genre }) => {
  const colors = GENRE_COLORS[genre] || { border: 'border-white/20', text: 'text-white/70' };
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      "bg-white/10 border",
      colors.border, colors.text
    )}>
      {genre}
    </span>
  );
};
```

#### PopularityBar

```jsx
const PopularityBar = ({ value, max = 100 }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-24 h-1 bg-white/10 rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-400 transition-all duration-500"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
    <span className="text-xs font-mono text-white/40">{value}</span>
  </div>
);
```

#### SearchBar (Hero)

```jsx
const HeroSearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto transition-all duration-300",
      focused && "scale-[1.02]"
    )}>
      <div className={cn(
        "flex items-center gap-3 px-6 h-14",
        "bg-white/[0.05] backdrop-blur-xl",
        "border rounded-2xl transition-all duration-300",
        focused
          ? "border-purple-500/30 ring-2 ring-purple-500/20 bg-white/[0.08]"
          : "border-white/[0.1]"
      )}>
        <Search className="w-5 h-5 text-white/40" />
        <input
          className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-lg"
          placeholder="What do you want to explore?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {query && (
          <ArrowRight className="w-5 h-5 text-purple-400 cursor-pointer hover:text-purple-300 transition-colors" />
        )}
      </div>

      {/* Autocomplete dropdown */}
      {focused && query && (
        <div className="absolute top-full mt-2 w-full bg-[#12121A]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {/* Suggestion rows */}
        </div>
      )}
    </div>
  );
};
```

### Additional shadcn/ui Components to Install

```
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add tooltip
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add skeleton
npx shadcn@latest add scroll-area
npx shadcn@latest add badge
npx shadcn@latest add toggle-group
npx shadcn@latest add separator
```

---

## 10. Animations & Micro-interactions <a name="animations"></a>

### Library: Framer Motion (motion.dev)

Use Framer Motion (now called "Motion") for all animations. It provides:
- Declarative animation API for React
- Spring physics for natural feel
- Scroll-triggered animations (`whileInView`, `useInView`)
- Layout animations for smooth re-ordering
- `AnimatePresence` for enter/exit transitions
- Predefined springs: snappy, smooth, gentle, bouncy

### Animation Inventory

#### Page-level Transitions

```jsx
// Page wrapper with fade + slide
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
>
```

#### Staggered Card Entrance

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } }
};
```

#### Scroll Reveal (Sections)

```jsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

#### Hover Interactions

```jsx
// Card hover
<motion.div
  whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
  whileTap={{ scale: 0.98 }}
>

// Button hover
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

#### Number Counter Animation

For stat numbers, animate from 0 to final value on scroll-into-view:

```jsx
const CountUp = ({ target, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration });
    }
  }, [isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};
```

#### Ambient Background Animation

```jsx
// Floating gradient orbs
const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -80, 60, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    {/* Add 2-3 more orbs with different colors and timing */}
  </div>
);
```

### Animation Guidelines

1. **Respect `prefers-reduced-motion`:** Wrap all animations in a check or use Framer Motion's built-in support
2. **Transitions should be 200-300ms** for hover/click interactions
3. **Use spring physics** for natural, non-robotic feel (damping: 20-30, stiffness: 200-400)
4. **Stagger delay: 50-100ms** between children for list/grid animations
5. **Scroll animations should use `once: true`** to prevent re-triggering
6. **Avoid animating `width`, `height`, `top`, `left`** -- use `transform` and `opacity` for GPU-accelerated performance

---

## 11. Responsive Strategy <a name="responsive"></a>

### Breakpoints (aligned with UI/UX Pro Max recommendations)

```
Mobile:       375px  (min-width: 375px)   -- single column
Tablet:       768px  (min-width: 768px)   -- 2 columns
Desktop:      1024px (min-width: 1024px)  -- full layout
Large Desktop: 1440px (min-width: 1440px) -- max-width container
```

### Page-specific Responsive Behavior

**Landing Page:**
- Mobile: Search bar full-width, popular artists wrap to 2 rows
- Tablet: Feature cards 2-column grid
- Desktop: Feature cards 3-column grid

**Artist Profile:**
- Mobile: Artist image centered above name, stats stack vertically (2-column grid)
- Tablet: Artist image beside name, stats 3-column
- Desktop: Full hero layout as designed
- Top tracks: Album art hidden on mobile, full row on desktop

**Timeline:**
- Mobile: Vertical timeline with cards alternating left/right
- Tablet+: Horizontal timeline with scroll/drag

**Charts:**
- Mobile: Single chart per row, stacked vertically
- Desktop: 2 charts side by side with toggle controls above

### Touch Considerations

- Minimum touch target: 44x44px
- Increase button padding on mobile
- Timeline nodes get larger touch areas (min 44px diameter)
- Swipe gestures for timeline navigation on mobile

---

## Quick Reference: Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js (App Router) | SSR, routing, performance |
| Styling | Tailwind CSS v4 | Utility-first styling |
| Components | shadcn/ui | Base component library |
| Charts | Recharts | Data visualization |
| Animation | Framer Motion (motion.dev) | All animations |
| Icons | Lucide React | Consistent icon set |
| Fonts | Sora + Inter + JetBrains Mono | Typography stack |
| State | React hooks / Zustand | Client state management |

---

## Design Inspiration References

- [Spotify Redesign concepts on Dribbble](https://dribbble.com/tags/spotify_redesign)
- [Spotify Dashboard UI Redesign by Rafael Marrama](https://dribbble.com/shots/9838093-Spotify-Dashboard-UI-Redesign)
- [Spotify UI Redesign by Atikur Rahman](https://dribbble.com/shots/25385099-Spotify-UI-redesign-Music-web-App-UI-design)
- [Dark Glassmorphism: The Aesthetic That Will Define UI in 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f)
- [Dark Mode UI: 7 Best Practices](https://atmos.style/blog/dark-mode-ui-best-practices)
- [Dark UI Design Principles - Toptal](https://www.toptal.com/designers/ui/dark-ui-design)
- [Ultimate Dashboard Color Palette - Data Rocks](https://medium.com/@datarocksnz/design-matters-6-the-ultimate-dashboard-colour-palette-6554adffc1fc)
- [CSS Glassmorphism Examples](https://freefrontend.com/css-glassmorphism/)
- [Glassmorphism CSS Generator](https://ui.glass/generator)
- [shadcn/ui Charts Library](https://www.shadcn.io/charts)
- [shadcn/ui Dashboard Example](https://ui.shadcn.com/examples/dashboard)
- [Recharts Data Visualization Guide](https://ecosire.com/blog/recharts-data-visualization-guide)
- [Framer Motion Scroll Animations](https://www.framer.com/motion/scroll-animations/)
- [21st.dev Community Components](https://21st.dev/community/components)
- [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Search Bar UI Best Practices - LogRocket](https://blog.logrocket.com/ux-design/design-search-bar-intuitive-autocomplete/)
- [Tailwind Progress Bars](https://freefrontend.com/tailwind-progress-bars/)
- [Best Timeline Components](https://www.jqueryscript.net/blog/best-timeline-components.html)
