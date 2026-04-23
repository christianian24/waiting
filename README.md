# I’ll Be Here. 💖

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A sentimental, interactive single-page website featuring a personalized countdown timer, high-precision progress tracking, and immersive particle animations. This project is a dedicated digital space for keeping a promise and counting down to a significant life event.

---

## ✨ Features

- **🎯 Precise Countdown**: A robust timer tracking time elapsed or remaining until a specific target date with second-level accuracy.
- **📈 Progress Visualization**: A high-precision progress bar (four decimal places) providing real-time feedback on the "wait progress."
- **✨ Interactive Canvas Particles**: A custom-built particle engine that reacts to mouse movement and touch interaction, creating a mesmerizing backdrop.
- **🎵 Glassmorphism Audio Interface**: Custom-designed audio controls with smooth volume adjustment and playback persistence across sessions.
- **🐾 Animated Avatar**: An interactive Peach & Goma avatar with dynamic typing speech bubbles and engagement triggers.
- **🌙 Dynamic Lighting**: Automatic UI color shifts based on the time of day (Sunrise, Sunset, and Night modes).
- **🎁 Secret Easter Eggs**: Hidden interactions including a "Time Capsule" lock and secret keyboard commands.

---

## 📸 Screenshots

![Main Interface](img/Screenshot%202026-04-23%20181210.png)
*The modern glassmorphism interface with active countdown and particle background.*

---

## 🚀 Getting Started

No installation or dependencies are required. This is a standalone project that runs directly in any modern web browser.

### How to Run
1. Clone or download the project files.
2. Locate `index.html` in the root directory.
3. **Double-click `index.html`** or drag it into your browser (Chrome, Edge, Safari, etc.).
4. Press **F5** or Refresh to reload if needed.

---

## 📖 Usage

### Interaction Guide
- **Audio Controls**: Hover over the top-right button to reveal the volume slider. Click to toggle background atmosphere.
- **Avatar Interactions**: Click on the avatar to receive randomized supportive messages. Long-press (3s) to trigger a special visual effect.
- **Time Capsule**: Located in the bottom-right. It remains locked until the target date is reached.
- **Secrets**: Try typing specific keywords like (`*****` it's a secret lol) or `imissyou` anywhere on the page to unlock hidden animations.

### Desktop & Mobile
The project is fully responsive and supports both mouse pointer movement and touch gestures for particle interaction.

---

## ⚙️ Configuration

You can personalize the countdown by modifying the configuration constants in `script.js`:

```javascript
// --- Configuration in script.js ---
const COUNTDOWN_TARGET_DATE = new Date("2031-05-26T15:34:00+08:00");
const WAIT_START_DATE = new Date("2024-05-26T00:00:00+08:00");
```

- **`COUNTDOWN_TARGET_DATE`**: The date you are waiting for.
- **`WAIT_START_DATE`**: The date the promise or journey began.

---

## 📂 Folder Structure

```text
waiting/
├── .testsprite/          # TestSprite configuration
├── img/                  # Static image assets
├── mp3/                  # Background music files
├── testsprite_tests/     # Automated test reports and plans
├── index.html            # Main entry point
├── script.js             # Core application logic & particle engine
├── style.css             # Glassmorphism design system
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

---

## 🧪 Testing

This project can be manually verified by opening the page and interacting with the UI. For automated quality assurance, it is pre-configured for **TestSprite MCP**.

### Run Automated Tests
If you wish to run the automated test suite, ensure you have Node.js installed and run:
```bash
npx @testsprite/testsprite-mcp@latest generateCodeAndExecute
```

---

## 🤝 Contributing

Contributions are welcome to enhance the visual effects or optimize the particle engine.
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **ISC License**. See `LICENSE` (if applicable) or the `package.json` for more information.

---

## 💖 Acknowledgments

- **Peach & Goma**: For the adorable animated assets.
- **Vite**: For the blazing fast development experience.
- **TestSprite**: For ensuring the reliability of the countdown logic.

---
*Created with love and a promise. Stay strong. ♡*
