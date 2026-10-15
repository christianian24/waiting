# I’ll Be Here

“I’ll Be Here” is a romantic, single-page countdown and waiting experience. It combines a configurable countdown with music, animated visuals, settings, and written love notes. The project is a static HTML, CSS, and JavaScript site; it has no backend or package installation step.

## Features

- Countdown to the configured target date, or count-up from the configured wait start date.
- Standard years/days/hours/minutes/seconds display, with total days, seconds, weeks, or hours modes.
- Progress bar, milestone markers, and an optional completion percentage badge.
- Background music controls, volume adjustment, browser autoplay handling, and a first-interaction playback prompt.
- Settings for timer direction and format, color theme, font, blur, particle density and speed, lighting, and other display preferences.
- A canvas particle effect that animates text and heart shapes, plus decorative falling particles, fireflies, click sparkles, and parallax background movement.
- Love memos and a static deep-note library with timed text and heart slides.
- Avatar messages, a long-press crystal effect, a time capsule interaction, secret keyboard codes, and shortcut controls.
- Zen mode, fullscreen, an inactivity dimming option, and a compact display mode.
- Browser-local persistence for preferences through `localStorage`.

## Desktop and laptop access

The app is available only when all three viewport requirements are met:

- Width is at least `1024` CSS pixels.
- Height is at least `600` CSS pixels.
- Width divided by height is at least `1.35`.

If any requirement is not met, the desktop restriction notice appears and the application interface is hidden and disabled. The app delays normal initialization until the viewport is eligible. When an already-running page becomes ineligible, its main recurring timers, particle spawner, canvas drawing loop, and firefly animations are paused, and background music is paused. If music was playing when access was blocked, it is resumed when the viewport becomes eligible again. Resizing and orientation changes are checked without requiring a reload.

| Viewport | Aspect ratio | Expected result |
| --- | ---: | --- |
| `390 × 844` | 0.46 | Blocked |
| `768 × 1024` | 0.75 | Blocked |
| `1024 × 768` | 1.33 | Blocked |
| `1280 × 800` | 1.60 | Allowed |
| `1366 × 768` | 1.78 | Allowed |
| `1920 × 1080` | 1.78 | Allowed |
| `900 × 700` | 1.29 | Blocked |
| `1200 × 900` | 1.33 | Blocked |

The restriction is based on viewport dimensions and ratio, not user-agent detection. It is a client-side presentation gate, not a security boundary.

### Restriction screen

The notice is implemented in the page and styled with a dark navy and purple gradient, soft pink and violet glow effects, and a translucent glass-style panel. It includes a monitor-and-heart icon, the title “This Little World Is Made for a Bigger Screen,” and the label “Laptop or desktop required.” Its short entrance and glow animations are disabled when the visitor requests reduced motion.

## Run locally

No package manager, framework, build step, or server is required.

1. Download or clone the project.
2. Open `index.html` directly in a modern browser.
3. Use a viewport that meets the desktop and laptop access requirements above.

Browser audio policies may prevent music from starting automatically. If playback is blocked, use the audio control or interact with the page to enable playback. The site also uses remote font and image URLs, which may not load without an internet connection.

## Configuration

The countdown dates are constants near the top of `script.js`:

```javascript
const COUNTDOWN_TARGET_DATE = new Date("2031-05-26T15:34:00+08:00");
const WAIT_START_DATE = new Date("2024-05-26T00:00:00+08:00");
```

- `COUNTDOWN_TARGET_DATE` sets the countdown destination.
- `WAIT_START_DATE` sets the start used by count-up and progress calculations.

## Project structure

```text
waiting-main/
├── .vscode/
│   ├── launch.json          # VS Code launch configuration
│   └── settings.json        # VS Code workspace settings
├── img/
│   ├── 1.jpg                # Local page background image
│   └── Screenshot 2026-04-23 181210.png # Project screenshot used in this README
├── mp3/
│   └── Grand_Escape.mp3     # Local background music
├── index.html               # Page structure, interface, restriction notice, and asset references
├── style.css                # Application and restriction-screen styling
├── script.js                # Countdown, settings, persistence, interactions, and animation logic
├── deepNotes.js             # Static love-note content and timed slides
├── LICENSE                  # ISC license
└── README.md                # Project documentation
```

The browser loads `deepNotes.js` before `script.js`, so the note data is available to the application. There is no `package.json`, lockfile, backend, database, or automated test configuration in the project structure.

## Preferences and browser behavior

- Settings are stored in browser `localStorage` under the key `user_qol_prefs`. They remain local to that browser profile; the project has no account or server-side synchronization.
- The bundled music file is `mp3/Grand_Escape.mp3`. Playback depends on browser autoplay policy and may require a user gesture.
- The restriction notice is shown by a CSS media query as well as the JavaScript lifecycle gate. JavaScript checks viewport size and ratio on resize and orientation changes, then pauses or resumes the app's recurring visual activity as appropriate.
- The site uses remote Google Fonts and remote URLs for the favicon and snapshot avatar in addition to local image and audio assets.

## Screenshot

![Main interface](img/Screenshot%202026-04-23%20181210.png)

## License

This project is distributed under the ISC License. See [LICENSE](LICENSE).
