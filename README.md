# Alethiometer

*A browser-based recreation of the alethiometer from **His Dark Materials**, built with modern vanilla JavaScript.*

The Alethiometer is an interactive instrument inspired by Philip Pullman's *His Dark Materials* trilogy. Users can compose questions by positioning three moveable arms, initiate a reading, and watch the fourth arm animate through a procedurally generated sequence of symbols which the user then interprets as the answer.

This project was designed as an exercise in building a modular front-end application with rich interaction, animation, state management, and full accessibility, all without relying on a UI framework.

---

## Demo


---

## Features

### Interactive Alethiometer

- Four independently animated arms
- Smooth rotation and snapping
- Idle animation for the answer arm
- Reading playback with directed movement
- Animated symbol spotlight

### Multiple Input Methods

Users can position the question arms using:

- Mouse or touch dragging
- Dial rotation
- Mouse wheel / trackpad scrolling
- Keyboard controls
- Dropdown selectors

### Reading Engine

- Procedurally generated answer sequences
- Weighted symbol selection
- Variable reading lengths
- Interpretation depth labels
- Reading history cards

### Symbol Dictionary

- Browse all symbols
- Primary and secondary meanings
- Detailed descriptions
- Live symbol preview

### Accessibility

- Keyboard navigation
- Screen reader announcements
- ARIA labels
- Focus management
- Responsive layout for desktop and mobile

---

## Technical Highlights

This project demonstrates:

- Modular ES module architecture
- State-driven UI updates
- Animation timing and sequencing
- Event-driven interaction design
- Responsive CSS layouts
- Accessibility best practices
- Separation of presentation, data, and application logic

---

## Tech Stack

- Vite
- Vanilla JavaScript (ES Modules)
- HTML5
- CSS3

---

## Getting Started

### Requirements

- Node.js 18+
- npm 9+

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Project Structure

```text
src/
├── app/
│   └── main.js
├── data/
│   └── constants.js
├── modules/
│   ├── answer-arm.js
│   ├── arms.js
│   ├── panel-ui.js
│   └── reading-engine.js
├── utils/
│   └── shared.js
├── assets/
└── styles/
```

The application follows a modular architecture where each major feature is encapsulated within its own module. The entry point (`main.js`) coordinates communication between modules while shared utilities and data remain isolated from UI logic.

---

## Architecture

### `main.js`

Coordinates the application lifecycle.

**Responsibilities**

- Initializes modules
- Collects DOM references
- Wires application events
- Starts animation loops
- Coordinates communication between components

---

### `arms.js`

Controls the three question arms.

**Responsibilities**

- Drag interactions
- Dial rotation
- Keyboard controls
- Symbol snapping
- Current symbol tracking

---

### `answer-arm.js`

Controls the fourth (reading) arm.

**Responsibilities**

- Idle animation
- Reading playback
- Directed turns
- Cancellation and reset logic

---

### `reading-engine.js`

Generates and orchestrates readings.

**Responsibilities**

- Weighted symbol generation
- Weighted turn generation
- Playback sequencing
- Reading metadata
- Interpretation depth

---

### `panel-ui.js`

Handles all side-panel interfaces.

**Responsibilities**

- Tabs
- Dictionary
- Reading cards
- Spotlight rendering
- Help dialog
- Mobile behaviour

---

### `constants.js`

Stores symbol metadata.

**Responsibilities**

- Symbol definitions
- Meanings
- Asset references
- Degree lookup

---

### `shared.js`

Provides reusable helper functions.

**Responsibilities**

- Degree calculations
- Randomization
- HTML helpers
- Symbol utilities

---

## Design Goals

The project was developed with several goals in mind:

- Create an intuitive interaction model that feels tactile despite running entirely in the browser.
- Keep business logic independent from presentation.
- Build reusable modules with clear responsibilities.
- Minimize dependencies by using modern browser APIs and vanilla JavaScript.
- Support keyboard and assistive technology users from the outset.

---

## Future Improvements

- Save readings between sessions
- Seeded readings for deterministic debugging
- Expanded animation customization
- Automated unit tests
- Additional accessibility enhancements

---

## License

This project is a fan-made recreation inspired by *His Dark Materials* by Philip Pullman and is intended for educational and portfolio purposes.