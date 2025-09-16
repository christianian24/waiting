# I’ll Be Here.

A single-page interactive website featuring a personalized countdown timer with a beautiful particle animation system.

## Preview

[Live Demo](https://christianian24.github.io/waiting/)  

---

## ✨ Features

- **Personalized Countdown:** A live countdown timer that ticks down to a specific target date and time.
- **Dynamic Particle Animation:** A canvas-based animation where particles form text and shapes. The text sequence is fully customizable.
- **Dynamic Final Message:** The promise message at the bottom of the page updates automatically when the countdown finishes.
- **Animated Avatar:** A circular avatar/logo that rotates on hover.
- **Customizable Background:** Easily change the full-page background image.
- **Background Music:** An ambient audio track plays on a loop after the user first interacts with the page.
- **Zero Dependencies:** Built with pure HTML, CSS, and JavaScript—no external frameworks or libraries needed.

## 🚀 Installation & Setup

Since this is a client-side-only project, setup is simple.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/christianian24/waiting.git
    ```

2.  **Navigate to the directory:**
    ```bash
    cd your-repository-name
    ```

3.  **Open the file:**
    Simply open the `index.html` file in your favorite web browser.

    > **Note:** For the best experience (especially with audio playback), it's recommended to serve the file through a local web server, but opening it directly will also work.

## 🔧 Customization Guide

You can easily personalize this project by editing the `index.html` file.

### 1. Target Date

Change the countdown's target date by modifying the `COUNTDOWN_TARGET_DATE` constant. The format is `YYYY-MM-DDTHH:MM:SS+TIMEZONE`.

```html
<!-- In the first <script> block -->
<script>
    const COUNTDOWN_TARGET_DATE = new Date("2031-05-26T15:34:00+08:00");
    // ...
</script>
```

### 2. Background Image

Update the background by changing the `background-image` URL in the CSS `<style>` block. Place your image in the `img/` folder for consistency.

```css
/* In the <style> block */
body {
    background-image: url('img\1.jpg');
    /* ... */
}
```

### 3. Avatar / Logo

Change the avatar by updating the `src` attribute of the `<img>` tag with the `id="logo"`.

```html
<!-- Inside the <body> tag -->
<img src="https://media.tenor.com/YX7uvNo4bgEAAAAi/peach-goma-peach-and-goma.gif" id="logo" alt="Avatar">
```

### 4. Background Music

Replace the music file by changing the `src` attribute in the `<audio>` tag at the bottom of the file. Place your audio file in the `mp3/` folder.

```html
<!-- At the end of the <body> -->
<audio loop="loop" id="background_music">
    <source src="mp3/your-new-song.mp3" type="audio/mpeg" />
</audio>
```

### 5. Animation Text Sequence

Modify the text displayed by the particle animation by editing the string inside the `S.UI.simulate()` function call.

- Use a pipe `|` to separate different messages/frames.
- Use special commands like `#countdown 3` to create a numbered countdown within the animation.
- The `#livecountdown` command will display the remaining years, days, hours, and minutes.

```javascript
<script>
    var S = {
        init: function () {
            // ...
            S.UI.simulate("First Message|Second Message|#countdown 3|Final Message|#livecountdown");
            // ...
        }
    };
    // ...
</script>
```

## 💻 Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**

## 🌱 Future Improvements

- **Enhanced Mobile Responsiveness:** Improve the layout and scaling of the canvas and text on smaller mobile devices.
- **Theme Selector:** Add a toggle to switch between multiple color schemes or background images (e.g., a light/dark mode).
- **More Shape Animations:** Expand the `S.ShapeBuilder` to include more geometric shapes or even simple SVG path animations.

## 📄 License

This project is licensed under the MIT License.

---

**MIT License**

Copyright (c) 2024 [Your Name or Username]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.