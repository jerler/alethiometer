# Alethiometer

A browser-based alethiometer inspired by the *His Dark Materials* triology by Philip Pullman.

This project lets you set three question arms, trigger a reading, and watch the fourth arm animate through a generated symbol sequence. The side panel includes Arms, Reading, and Dictionary views, with keyboard and mobile support.

## Features

- Interactive face with four arms
- Multiple input methods for question arms:
  - Drag arms
  - Drag dials
  - Wheel/trackpad rotation
  - Keyboard arrow controls
  - Dropdown selectors in the Arms panel
- Reading engine for generated answer sequences
- Animated fourth-arm behavior:
  - Idle drift
  - Directed landing and turn cycles during readings
- Reading cards with interpretation depth labels
- Dictionary with symbol meanings and descriptions
- Spotlight preview for selected symbol
- Modal help dialog and accessibility status announcements
- Responsive panel behavior for mobile and desktop

## Tech Stack

- Vite
- Vanilla JavaScript (ES modules)
- HTML + CSS

## Requirements

- Node.js 18+
- npm 9+

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production assets to `dist/`
- `npm run preview`: Preview production build locally

## Project Structure

```text
.
├─ index.html
├─ package.json
├─ vite.config.js
├─ public/
└─ src/
   ├─ app/
   │  └─ main.js
   ├─ data/
   │  └─ constants.js
   ├─ modules/
   │  ├─ answer-arm.js
   │  ├─ arms.js
   │  ├─ panel-ui.js
   │  └─ reading-engine.js
   ├─ utils/
   │  └─ shared.js
   ├─ assets/
   │  └─ symbols/
   ├─ styles/
   └─ style.css
```

## Architecture Overview

### `src/app/main.js`
Application coordinator.

Responsibilities:
- Collects DOM references
- Configures modules
- Wires top-level actions (`concentrate`, `reset`, center double-tap)
- Starts lifecycle (`init`, event bindings, idle loop)

### `src/modules/arms.js`
Question-arm controller (arms 1-3).

Responsibilities:
- Arm and dial interactions
- Selector UI for question symbols
- Snap/animation behavior
- Face wheel interactions
- Current question symbol degree snapshot

### `src/modules/reading-engine.js`
Reading generation and playback orchestration.

Responsibilities:
- Weighted symbol count generation
- Weighted turn count generation
- Sequence playback timing
- Interpretation depth labeling

### `src/modules/answer-arm.js`
Fourth-arm controller (answer arm).

Responsibilities:
- Idle state and drift loop
- Reading run state tracking/cancellation
- Directed animation primitives for reading playback

### `src/modules/panel-ui.js`
Panel, dictionary, reading cards, spotlight, and modal UI.

Responsibilities:
- Tab panel state and mobile panel behavior
- Dictionary rendering and navigation
- Spotlight rendering and preview scaling
- Reading card rendering and updates
- Modal and panel event listeners

### `src/data/constants.js`
Symbol data and lookup helpers.

Responsibilities:
- Symbol ring metadata
- Asset binding for symbol icons
- Degree-to-symbol lookup

### `src/utils/shared.js`
Shared helpers.

Responsibilities:
- Degree math
- Random helpers
- HTML/string utility helpers
- Symbol class/name helpers

## Development Notes

- Entry point is loaded from `index.html` via `/src/app/main.js`.
- Symbols are keyed by degree in 10-degree increments.
- The reading process can be invalidated when question-arm symbols change.
- Most module internals are grouped by topic using section comments for readability.

## Accessibility

Implemented patterns include:
- `aria` labeling for tabs/panels and symbol previews
- Keyboard navigation for tabs and selectors
- Screen-reader announcements for reading availability/completion
- Focus management for modal open/close and panel transitions

## Build Output

Production build artifacts are generated in `dist/`.

## Troubleshooting

- If assets fail to load, verify paths under `src/assets/` and `src/data/constants.js`.
- If module resolution fails after moving files, run:

```bash
npm run build
```

and fix any reported import paths.

## Roadmap Ideas

- Add unit tests around weighted sequence generation
- Persist reading history between sessions
- Add deterministic seeded reading mode for debugging
- Extract UI templates to reusable render helpers

## License

No license file is currently defined in this repository.
Add a `LICENSE` file if you plan to distribute this project.
