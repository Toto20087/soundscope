---
title: "feat: Polish SoundScope for Wollen Labs Technical Challenge"
type: feat
status: active
date: 2026-03-31
---

# Polish SoundScope for Wollen Labs Technical Challenge

## Overview

Llevar SoundScope de un MVP funcional a un producto que destaque en la prueba técnica de Wollen Labs. El challenge pide: insights interesantes sobre música, visualizaciones interactivas, y procesamiento de datos. Wollen Labs es una consultora AI-native que valora ingeniería de elite, product thinking, y velocidad.

## Gap Analysis: Lo que pide el challenge vs lo que tenemos

| Requisito del Challenge | Estado | Acción |
|---|---|---|
| React/Next.js frontend | ✅ Completo | — |
| Responsive y visualmente atractivo | ✅ Completo | — |
| Charts/graphs (Recharts) | ⚠️ Parcial | Solo bar chart + area chart. Necesitamos radar, pie, scatter |
| Node.js con API Routes | ✅ Completo | — |
| Consumir API pública de música | ✅ Completo | Last.fm + MusicBrainz + Deezer |
| **Longest vs shortest tracks** | ⚠️ Data existe, no se muestra | Agregar visualización |
| **Average tempo/key/loudness** | ❌ No disponible en Last.fm | Sustituir con métricas disponibles |
| **Trends in genres over time** | ❌ No existe | Crear chart de evolución de tags |
| **Outliers/patterns** | ⚠️ Fun facts hace algo | Agregar sección dedicada de Analysis |
| Search de artista/playlist | ✅ Completo | — |
| Fun fact generator | ✅ Completo (9 facts, top 4) | — |
| **Shareable visuals / exportable reports** | ❌ No existe | Agregar export |
| **README con setup instructions** | ❌ Default de Next.js | Escribir README profesional |
| **Live demo (Vercel)** | ❌ No deployado | Deploy |
| **Video/presentación** | ❌ | Responsabilidad del usuario |

---

## Implementation Plan

### Phase A: Data Insights & Visualizations (Lo que más impacta en la evaluación)

**Objetivo:** Cubrir todos los requisitos de "insights" del challenge con visualizaciones impactantes.

#### A1. Sección "Artist Insights" (nueva sección en el perfil)

Agregar una sección dedicada entre el Timeline y los Top Tracks que muestre análisis estadístico real de la data del artista. Esto cubre directamente: "Process and transform the data to extract insights" y "Detect outliers or patterns."

**Componente:** `src/app/artist/[name]/_components/artist-insights.tsx`

**Visualizaciones a incluir:**

1. **Track Duration Distribution** (Scatter/Dot Plot o Histogram)
   - Muestra la duración de cada track en el top 50 del artista
   - Identifica outliers: tracks anormalmente largos o cortos
   - Marca el promedio con una línea
   - **Cubre:** "Longest vs shortest tracks", "Detect outliers"
   - **Data source:** `artist.getTopTracks` con limit=50, luego `album.getInfo` para duraciones

2. **Genre Evolution Over Time** (Stacked Area Chart o Tag Cloud por año)
   - Muestra cómo cambiaron los tags/géneros del artista album por album
   - Eje X: años (chronológico), Eje Y: presencia de cada tag
   - **Cubre:** "Trends in genres over time"
   - **Data source:** Los tags de cada album (ya enriquecidos con `album.getInfo`)

3. **Album Metrics Radar** (Radar Chart)
   - 5 ejes: Popularidad (playcount), Tamaño (trackCount), Duración (totalDuration), Listeners, Era (releaseYear normalizado)
   - Compara el album seleccionado vs el promedio del artista
   - **Cubre:** Variedad de charts, análisis comparativo
   - **Data source:** Album data ya disponible

4. **Popularity Distribution** (Pie/Donut Chart)
   - Muestra qué porcentaje del total de plays corresponde a cada album
   - Destaca si hay un album dominante o distribución equitativa
   - **Cubre:** Patrón de distribución, outlier detection
   - **Data source:** Album playcounts

**Implementación técnica:**

```
src/app/artist/[name]/_components/artist-insights.tsx  (client, lazy-loaded)
src/components/charts/radar-chart-wrapper.tsx           (client, lazy)
src/components/charts/scatter-chart-wrapper.tsx          (client, lazy)
src/components/charts/pie-chart-wrapper.tsx              (client, lazy)
src/lib/insights.ts                                      (server-only, cálculos estadísticos)
```

**`src/lib/insights.ts`** — funciones de análisis:
```typescript
// Detectar outliers en duración de tracks (IQR method)
function detectDurationOutliers(tracks: Track[]): { track: Track; type: "long" | "short" }[]

// Calcular estadísticas de duración
function getTrackDurationStats(tracks: Track[]): {
  mean: number; median: number; stdDev: number;
  shortest: Track; longest: Track;
  outliers: Track[];
}

// Evolución de géneros por album
function getGenreEvolution(albums: Album[]): Array<{
  year: number; albumName: string; tags: string[];
}>

// Distribución de popularidad
function getPopularityDistribution(albums: Album[]): Array<{
  name: string; playcount: number; percentage: number;
}>

// Métricas normalizadas para radar chart
function getAlbumRadarMetrics(album: Album, allAlbums: Album[]): {
  popularity: number; size: number; duration: number; listeners: number;
}
```

#### A2. Mejorar Album Detail con más insights

En la página de detalle de album, agregar:

- **Track Duration Scatter** — en vez de solo bar chart, un scatter que muestra outliers
- **Estadísticas del album** — "This album's average track is X:XX, Y% longer/shorter than the artist's average"
- **Comparación con otros albums** — "This is the Xth most popular album, with Y% of total plays"

**Modificar:** `src/app/artist/[name]/album/[album]/page.tsx`

#### A3. Enriquecer Fun Facts con datos del Insights engine

Agregar 3 facts más basados en los nuevos cálculos:

```typescript
// 10. Duration Outlier
// "The track 'X' is Y minutes long — Z standard deviations above the artist's average"

// 11. Genre Shift
// "X started as [genre1] in YYYY but shifted to [genre2] by YYYY"

// 12. Popularity Concentration
// "YY% of X's total plays come from just 1 album: [name]"
```

---

### Phase B: Export & Share (Optional Extra del challenge)

**Objetivo:** "Shareable visuals or exportable reports"

#### B1. Export Artist Profile as Image

Botón "Export" en el header del perfil del artista que usa `html2canvas` para capturar la sección de insights como imagen PNG.

```bash
npm install html2canvas-pro
```

**Componente:** `src/app/artist/[name]/_components/export-button.tsx`

Captura las secciones clave (Hero + Stats + Insights) como una imagen descargable tipo "infographic".

#### B2. Export Data as JSON

Botón secundario "Download Data" que exporta el perfil completo del artista como JSON estructurado. Demuestra que procesamos la data, no solo la mostramos.

---

### Phase C: README Profesional (Deliverable obligatorio)

**Objetivo:** El challenge pide "GitHub repository with installation/setup instructions"

**Archivo:** `README.md` en la raíz

**Contenido:**
```markdown
# SoundScope 🎵

Music Data Explorer that uncovers insights about any artist's career evolution.

## What It Does
- Search any artist → Get a complete profile with data-driven insights
- Discography Timeline showing evolution chronologically
- Statistical Analysis: track duration outliers, genre trends, popularity distribution
- Interactive charts: Bar, Area, Radar, Scatter, Pie
- Fun Fact Generator with 12 auto-generated insights
- Album deep-dives with tracklist analytics

## Insights Uncovered
- **Longest vs shortest tracks** with outlier detection (IQR method)
- **Genre evolution over time** tracking how an artist's sound changed
- **Popularity concentration** revealing if one album dominates
- **Career statistics** (prolificacy, span, growth patterns)

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Recharts, Framer Motion
- **Backend:** Next.js API Routes (server-side proxy)
- **APIs:** Last.fm (music data) + MusicBrainz (dates/types) + Deezer (artist images)
- **Deploy:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Last.fm API key (free at https://www.last.fm/api/account/create)

### Setup
\`\`\`bash
git clone https://github.com/[user]/sound-scope.git
cd sound-scope
npm install
cp .env.example .env.local
# Add your LASTFM_API_KEY to .env.local
npm run dev
\`\`\`

Open http://localhost:3000

## Architecture

[Diagram or description of data flow]

## Live Demo

https://soundscope.vercel.app
```

---

### Phase D: Polish de UI para Light Mode

Varios componentes aún tienen vestigios del dark mode que se ven mal.

#### D1. Fixes específicos

- [ ] `GlassCard` — Verificar que usa `bg-white border border-gray-200` en vez de `bg-white/5`
- [ ] `GenreChip` — Los colores con `/30` opacity son para dark mode. Cambiar a colores sólidos light-friendly
- [ ] `PopularityBar` — El track `bg-white/10` es invisible. Cambiar a `bg-gray-200`
- [ ] `StatCard` — Verificar que `text-gradient` funciona en light mode
- [ ] `PageTransition` — Usa `bg-bg-primary` que ahora es claro, verificar que se ve bien
- [ ] `error.tsx` (artist) — Verificar colores
- [ ] `not-found.tsx` — Verificar colores (usaba `bg-hero-gradient` que ya no existe)
- [ ] `SearchDropdown` (hero-search-bar) — Verificar fondo y colores
- [ ] `AlbumComparisonChart` — Verificar ejes y tooltip contra fondo blanco
- [ ] `TopTracks` — El hover `bg-white/[0.03]` es invisible. Cambiar a `hover:bg-gray-50`
- [ ] `FunFacts` — GlassCard con left border accent, verificar
- [ ] `Footer` — Verificar que se ve en light mode
- [ ] `AlbumTimeline` mobile cards — Verificar bordes

---

### Phase E: Deploy a Vercel (Deliverable obligatorio)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurar env var en Vercel dashboard:
# LASTFM_API_KEY = [la key del usuario]
```

**Consideraciones:**
- `.env.local` NO se sube a Vercel — configurar `LASTFM_API_KEY` en el dashboard de Vercel
- Verificar que `next.config.ts` no tenga configs que solo funcionen en dev
- Testear todas las rutas en producción

---

### Phase F: AI-Powered Artist Evolution Analysis (FEATURE ESTRELLA)

**Objetivo:** Usar Claude API para generar un análisis narrativo profundo de la evolución musical y personal de un artista. Conectar datos duros (cambios de género, picos de popularidad, biografía) con una interpretación inteligente de POR QUÉ el artista cambió su sonido.

**Por qué es el diferenciador #1:**
- Wollen Labs es AI-native — esto demuestra product thinking con AI
- El challenge pide "uncover interesting or unexpected insights" — un AI que narra la historia del artista es el insight máximo
- SoundScope = "Discover the history behind music" — esta feature ES el producto

#### F1. API Route: `/api/analyze`

**Archivo:** `src/app/api/analyze/route.ts`

```typescript
// POST /api/analyze
// Body: { artistName: string }
// Returns: ReadableStream (streaming response)
```

**Implementación:**
- Recibe el nombre del artista
- Llama a `getArtistFullProfile()` para obtener toda la data
- Construye un prompt estructurado con:
  - Biografía del artista
  - Lista cronológica de albums con géneros, año, playcount
  - Top tracks con popularidad
  - Tags/géneros generales
  - Similar artists
- Llama a Claude API con streaming
- Devuelve un `ReadableStream` para que el frontend muestre el texto progresivamente

**Prompt para Claude:**
```
You are a music historian and critic. Analyze the musical evolution of {artistName}.

DATA:
- Biography: {bio}
- Albums (chronological): {albums with year, genres, playcount}
- Top Tracks: {tracks with playcount}
- Genres: {tags}
- Similar Artists: {similar}

Write a compelling analysis covering:
1. **Early Career & Origins** — How did they start? What influenced their initial sound?
2. **Key Turning Points** — Which albums marked a shift? What changed and why?
3. **Genre Evolution** — How did their sound evolve? Map the journey from genre to genre.
4. **Commercial vs Artistic Arc** — Did popularity align with their best work?
5. **Legacy & Context** — Where do they stand in music history?

Be specific. Reference actual album names and years. Connect biographical events to musical changes.
Write in English. Be analytical, not promotional. 800-1200 words.
```

#### F2. Client Component: `AiAnalysis.tsx`

**Archivo:** `src/app/artist/[name]/_components/ai-analysis.tsx`

**UX:**
- Botón "Analyze Evolution with AI" (no se auto-ejecuta, el usuario lo activa)
- Al clickear: muestra un contenedor con texto streaming apareciendo en tiempo real
- Icono de "sparkles" (Lucide) para indicar AI
- Animación de typing/streaming mientras llega el texto
- Una vez completo, el texto queda visible con formato rico (headings, bold, etc.)
- Botón "Regenerate" para pedir un nuevo análisis
- Cache en `sessionStorage` para no re-llamar si el usuario navega y vuelve

**Diseño:**
```
┌──────────────────────────────────────────────┐
│ ✨ AI Evolution Analysis                     │
│                                              │
│ [Analyze with AI]  ← botón que activa        │
│                                              │
│ (después de click:)                          │
│                                              │
│ ## Early Career & Origins                    │
│ Taylor Swift began her career in 2006 as a   │
│ country artist in Nashville...               │
│                                              │
│ ## Key Turning Points                        │
│ The release of "1989" in 2014 marked the     │
│ most dramatic shift in her career...█        │
│ (streaming cursor)                           │
│                                              │
└──────────────────────────────────────────────┘
```

#### F3. Dependencias

```bash
npm install @anthropic-ai/sdk
```

**Env var:** `ANTHROPIC_API_KEY` en `.env.local`

#### F4. Archivos

```
src/app/api/analyze/route.ts                           # API endpoint con streaming
src/app/artist/[name]/_components/ai-analysis.tsx       # UI con streaming text
src/lib/ai-prompt.ts                                    # Prompt builder
```

---

## Orden de Implementación Recomendado

| Prioridad | Fase | Impacto en Evaluación | Esfuerzo |
|---|---|---|---|
| 1 | **F: AI Evolution Analysis** (feature estrella) | MUY ALTO — Diferenciador para Wollen Labs | Alto |
| 2 | **A1: Sección Insights** (4 charts nuevos) | ALTO — Es lo que más pide el challenge | Alto |
| 3 | **D: Polish UI light mode** | MEDIO — Visual quality | Medio |
| 4 | **C: README** | ALTO — Deliverable obligatorio | Bajo |
| 5 | **A3: Fun facts nuevos** | MEDIO — Enriquece los insights | Bajo |
| 6 | **E: Deploy Vercel** | ALTO — Deliverable obligatorio | Bajo |
| 7 | **B: Export/Share** | BAJO — Optional extra | Medio |
| 8 | **A2: Album detail insights** | BAJO — Nice to have | Bajo |

---

## Acceptance Criteria

### Funcional
- [ ] **AI Analysis:** Botón "Analyze with AI" que genera análisis narrativo con streaming
- [ ] **AI Analysis:** Texto aparece progresivamente (streaming UX)
- [ ] **AI Analysis:** Cache en sessionStorage para evitar re-llamadas
- [ ] Sección "Insights" visible en perfil de artista con 4 visualizaciones
- [ ] Track duration distribution con outlier detection
- [ ] Genre evolution over time chart
- [ ] Radar chart de album metrics
- [ ] Popularity distribution pie chart
- [ ] 3 fun facts nuevos (outlier, genre shift, popularity concentration)
- [ ] README completo con instrucciones de setup
- [ ] Todos los componentes se ven correctos en light mode
- [ ] Deploy funcionando en Vercel

### Non-Funcional
- [ ] Página de artista carga en < 5 segundos (incluyendo MusicBrainz)
- [ ] Build sin errores TypeScript
- [ ] Responsive en mobile (375px)
- [ ] Charts lazy-loaded para performance
- [ ] AI streaming response feels smooth (< 1s to first token)

---

## Archivos Nuevos a Crear

```
src/app/api/analyze/route.ts                              # AI streaming endpoint
src/lib/ai-prompt.ts                                      # Prompt builder for Claude
src/app/artist/[name]/_components/ai-analysis.tsx          # AI analysis UI with streaming
src/lib/insights.ts                                       # Cálculos estadísticos
src/app/artist/[name]/_components/artist-insights.tsx      # Sección de insights
src/components/charts/radar-chart-wrapper.tsx               # Radar chart
src/components/charts/scatter-chart-wrapper.tsx             # Scatter chart
src/components/charts/pie-chart-wrapper.tsx                 # Pie/Donut chart
README.md                                                  # Reescribir completo
```

## Archivos a Modificar

```
src/lib/fun-facts.ts                  # Agregar 3 facts nuevos
src/lib/data-aggregator.ts            # Generar insights data
src/lib/types.ts                      # Agregar InsightsData type
src/app/artist/[name]/page.tsx        # Agregar sección AI Analysis + Insights
src/components/ui/glass-card.tsx       # Fix light mode
src/components/ui/genre-chip.tsx       # Fix light mode
src/components/ui/popularity-bar.tsx   # Fix light mode
src/app/artist/[name]/_components/top-tracks.tsx    # Fix hover
src/app/not-found.tsx                  # Fix light mode
src/app/error.tsx                      # Fix light mode
.env.local                             # Agregar ANTHROPIC_API_KEY
.env.example                           # Agregar ANTHROPIC_API_KEY template
```

---

## Sources

- Challenge spec: Wollen Labs Full Stack Development Challenge
- Company: https://www.wollenlabs.com/ — AI-native consulting, values elite engineering + product thinking
- Current codebase: 65+ files, Next.js 16, Recharts, Last.fm + MusicBrainz + Deezer APIs
