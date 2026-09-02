// --- Configuration ---
const COUNTDOWN_TARGET_DATE = new Date("2031-05-26T15:34:00+08:00");
// Adjust this start date to when the wait actually began!
const WAIT_START_DATE = new Date("2024-05-26T00:00:00+08:00");

// --- Dynamic Lighting ---
function updateDynamicLighting() {
    const hour = new Date().getHours();
    let overlayColor = 'rgba(0, 0, 0, 0)';
    if (hour >= 19 || hour < 5) {
        overlayColor = 'rgba(10, 15, 30, 0.4)'; // Night
    } else if (hour >= 17 && hour < 19) {
        overlayColor = 'rgba(255, 100, 50, 0.15)'; // Sunset
    } else if (hour >= 5 && hour < 7) {
        overlayColor = 'rgba(255, 200, 100, 0.1)'; // Sunrise
    }
    document.body.style.setProperty('--time-overlay', overlayColor);
}
updateDynamicLighting();
setInterval(updateDynamicLighting, 60000); // Check every minute

// --- Interaction State ---
window.isMouseDown = false;
let isCursorMoving = false;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isCursorMoving) {
        isCursorMoving = true;
        requestAnimationFrame(() => {
            // Parallax background
            const x = (mouseX / window.innerWidth - 0.5) * 20;
            const y = (mouseY / window.innerHeight - 0.5) * 20;
            document.body.style.setProperty('--bg-x', `calc(50% + ${-x}px)`);
            document.body.style.setProperty('--bg-y', `calc(50% + ${-y}px)`);
            isCursorMoving = false;
        });
    }
});

document.addEventListener('mousedown', () => {
    window.isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    window.isMouseDown = false;
});

// --- State Variables ---
let currentTimerMode = 'standard'; // 'standard', 'days', 'seconds', 'weeks', 'hours'
let currentTheme = 'cyan'; // 'cyan', 'rose', 'purple', 'emerald'
let currentTimerDirection = 'down'; // 'down', 'up'
let currentDensity = 'low'; // 'low', 'med', 'high'
let currentFallSpeed = 'gentle'; // 'gentle', 'normal', 'quick'
let currentFont = 'sans'; // 'sans', 'serif', 'mono'
let currentBlur = 'standard'; // 'subtle', 'standard', 'deep'
let isFadeInEnabled = true;
let isGlowEnabled = true;
let isVignetteEnabled = true;
let isAutoSleepEnabled = true;
let isMiniModeEnabled = true;
let isSecondsVisible = true;
let isMilestonesVisible = true;
let isPercentBadgeVisible = false;
let isAutoQuoteEnabled = true;
let isClickSoundEnabled = true;
let autoSleepTimer = null;

// --- Countdown Logic ---
function calculateCountdown(targetDate) {
    const now = new Date();
    if (now >= targetDate) {
        return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    let years = targetDate.getFullYear() - now.getFullYear();
    let tempDate = new Date(now);
    tempDate.setFullYear(now.getFullYear() + years);

    if (tempDate > targetDate) {
        years--;
        tempDate = new Date(now);
        tempDate.setFullYear(now.getFullYear() + years);
    }

    let remainingMs = targetDate.getTime() - tempDate.getTime();

    const msPerDay = 1000 * 60 * 60 * 24;
    const msPerHour = 1000 * 60 * 60;
    const msPerMinute = 1000 * 60;
    const msPerSecond = 1000;

    const days = Math.floor(remainingMs / msPerDay);
    remainingMs %= msPerDay;
    const hours = Math.floor(remainingMs / msPerHour);
    remainingMs %= msPerHour;
    const minutes = Math.floor(remainingMs / msPerMinute);
    remainingMs %= msPerMinute;
    const seconds = Math.floor(remainingMs / msPerSecond);

    return { years, days, hours, minutes, seconds, isFinished: false };
}

function updateCountdownDisplay() {
    const now = new Date();
    const targetDate = currentTimerDirection === 'up' ? WAIT_START_DATE : COUNTDOWN_TARGET_DATE;

    let count;
    if (currentTimerDirection === 'up') {
        let years = now.getFullYear() - WAIT_START_DATE.getFullYear();
        let tempDate = new Date(WAIT_START_DATE);
        tempDate.setFullYear(WAIT_START_DATE.getFullYear() + years);
        if (tempDate > now) {
            years--;
            tempDate = new Date(WAIT_START_DATE);
            tempDate.setFullYear(WAIT_START_DATE.getFullYear() + years);
        }
        let remainingMs = now.getTime() - tempDate.getTime();
        const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
        remainingMs %= (1000 * 60 * 60 * 24);
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        remainingMs %= (1000 * 60 * 60);
        const minutes = Math.floor(remainingMs / (1000 * 60));
        remainingMs %= (1000 * 60);
        const seconds = Math.floor(remainingMs / 1000);

        count = { years, days, hours, minutes, seconds, isFinished: false };
    } else {
        count = calculateCountdown(COUNTDOWN_TARGET_DATE);
    }

    const spanElement = document.getElementById("span_dt_dt");
    const inlineBar = document.querySelector(".timer-inline-bar");

    if (count.isFinished) {
        if (spanElement) spanElement.innerHTML = "I kept my promise...❤️";
        if (inlineBar) inlineBar.innerHTML = "<span class='timer-num'>I kept my promise...❤️</span>";
        return;
    }

    if (!inlineBar) return;

    const prefix = currentTimerDirection === 'up' ? 'PASSED:' : 'FOR:';
    const totalMs = Math.abs(now.getTime() - targetDate.getTime());

    if (currentTimerMode === 'days') {
        const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        inlineBar.innerHTML = `${prefix} <span class="timer-num">${totalDays.toLocaleString()}</span> <span class="timer-label">Total Days</span>`;
    } else if (currentTimerMode === 'seconds') {
        const totalSecs = Math.floor(totalMs / 1000);
        inlineBar.innerHTML = `${prefix} <span class="timer-num">${totalSecs.toLocaleString()}</span> <span class="timer-label">Total Secs</span>`;
    } else if (currentTimerMode === 'weeks') {
        const totalWeeks = (totalMs / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
        inlineBar.innerHTML = `${prefix} <span class="timer-num">${totalWeeks}</span> <span class="timer-label">Total Weeks</span>`;
    } else if (currentTimerMode === 'hours') {
        const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
        inlineBar.innerHTML = `${prefix} <span class="timer-num">${totalHours.toLocaleString()}</span> <span class="timer-label">Total Hours</span>`;
    } else {
        const secPart = isSecondsVisible ? ` • <span id="timer-seconds" class="timer-num">${String(count.seconds).padStart(2, '0')}</span>s` : '';
        inlineBar.innerHTML = `${prefix} <span id="timer-years" class="timer-num">${count.years}</span>y • <span id="timer-days" class="timer-num">${count.days}</span>d • <span id="timer-hours" class="timer-num">${String(count.hours).padStart(2, '0')}</span>h • <span id="timer-minutes" class="timer-num">${String(count.minutes).padStart(2, '0')}</span>m${secPart}`;
    }

    // Update Percentage Badge
    const percentPill = document.getElementById("percent-badge-pill");
    if (percentPill) {
        const startMs = WAIT_START_DATE.getTime();
        const endMs = COUNTDOWN_TARGET_DATE.getTime();
        const totalDurationMs = endMs - startMs;
        const elapsedMs = now.getTime() - startMs;
        let pct = (elapsedMs / totalDurationMs) * 100;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;
        percentPill.innerText = `${pct.toFixed(4)}% Completed`;
        percentPill.style.display = isPercentBadgeVisible ? 'inline-block' : 'none';
    }

    if (spanElement) {
        spanElement.innerHTML = `${count.years} years ${count.days} days ${count.hours}hours ${count.minutes}minutes ${count.seconds}seconds`;
    }
}

updateCountdownDisplay();
setInterval(updateCountdownDisplay, 1000);

// Force update on tab visibility change to fix drift after backgrounding
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateCountdownDisplay();
        updateProgressBar();
    }
});

// --- Progress Bar Logic ---
function updateProgressBar() {
    const now = new Date();
    const totalDuration = COUNTDOWN_TARGET_DATE.getTime() - WAIT_START_DATE.getTime();
    const elapsed = now.getTime() - WAIT_START_DATE.getTime();

    let percentage = (elapsed / totalDuration) * 100;
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;

    document.getElementById("progress-bar").style.width = percentage + "%";
    document.getElementById("progress-text").innerText = percentage.toFixed(4) + "%";
}
setInterval(updateProgressBar, 1000);
updateProgressBar();

// --- Milestones ---
const milestonesData = [
    { label: '6 Months', date: new Date('2024-11-26T00:00:00+08:00') },
    { label: '1 Year', date: new Date('2025-05-26T00:00:00+08:00') },
    { label: '2 Years', date: new Date('2026-05-26T00:00:00+08:00') },
    { label: '3 Years', date: new Date('2027-05-26T00:00:00+08:00') },
    { label: 'Halfway There!', date: new Date('2027-11-26T00:00:00+08:00') }
];

function renderMilestones() {
    const container = document.querySelector('.progress-container');
    const totalDuration = COUNTDOWN_TARGET_DATE.getTime() - WAIT_START_DATE.getTime();

    milestonesData.forEach(ms => {
        if (ms.date < COUNTDOWN_TARGET_DATE && ms.date > WAIT_START_DATE) {
            const elapsed = ms.date.getTime() - WAIT_START_DATE.getTime();
            let percentage = (elapsed / totalDuration) * 100;

            const dot = document.createElement('div');
            dot.classList.add('milestone');
            dot.style.left = percentage + '%';
            dot.setAttribute('data-label', ms.label);
            container.appendChild(dot);
        }
    });
}
renderMilestones();

// --- Falling Overlay (Snowflakes) ---
let particleSpawnerInterval = null;

function spawnFallingItem() {
    const item = document.createElement("div");
    item.classList.add("falling-item");

    const snowflakes = ["❅", "❆", "❄", "❀", "*"];
    item.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];

    let baseDuration = 8;
    if (currentFallSpeed === 'gentle') baseDuration = 14;
    else if (currentFallSpeed === 'quick') baseDuration = 4;

    const animDuration = Math.random() * 3 + baseDuration;

    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = animDuration + "s";
    item.style.fontSize = Math.random() * 15 + 10 + "px";

    document.body.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, (animDuration + 1) * 1000);
}

function updateParticleSpawner() {
    if (particleSpawnerInterval) clearInterval(particleSpawnerInterval);
    let rate = 900;
    if (currentDensity === 'low') rate = 1800;
    else if (currentDensity === 'high') rate = 400;

    particleSpawnerInterval = setInterval(spawnFallingItem, rate);
}
updateParticleSpawner();

// --- Falling Envelope Modal ---
function spawnEnvelope() {
    const item = document.createElement("div");
    item.classList.add("falling-item");
    item.innerHTML = "💌";
    item.style.fontSize = "35px";
    item.style.left = Math.random() * 80 + 10 + "vw";
    item.style.animationDuration = "7s";
    item.style.cursor = "pointer";
    item.style.pointerEvents = "auto";
    item.style.zIndex = "105";
    item.style.filter = "drop-shadow(0 0 10px rgba(255, 128, 171, 0.8))";

    item.addEventListener("click", () => {
        item.remove();
        const modal = document.getElementById("envelope-modal");
        modal.classList.add("active");
        setTimeout(() => {
            modal.classList.remove("active");
        }, 8000);
    });

    document.body.appendChild(item);
    setTimeout(() => { if (item.parentNode) item.remove(); }, 8000);
}
setInterval(spawnEnvelope, 45000); // Every 45 seconds

// --- Interactive Fireflies ---
function spawnFirefly() {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    firefly.style.left = x + 'px';
    firefly.style.top = y + 'px';
    document.body.appendChild(firefly);

    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 0.5 + 0.2;
    let floatReq;

    function float() {
        x += Math.cos(angle) * speed;
        y += Math.sin(angle) * speed;
        angle += (Math.random() - 0.5) * 0.2;

        if (x < 0 || x > window.innerWidth) angle = Math.PI - angle;
        if (y < 0 || y > window.innerHeight) angle = -angle;

        firefly.style.left = x + 'px';
        firefly.style.top = y + 'px';

        floatReq = requestAnimationFrame(float);
    }
    floatReq = requestAnimationFrame(float);

    firefly.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        cancelAnimationFrame(floatReq);
        firefly.classList.add('burst');
        setTimeout(() => firefly.remove(), 500);
    });

    setTimeout(() => {
        if (firefly.parentNode) {
            cancelAnimationFrame(floatReq);
            firefly.style.opacity = '0';
            setTimeout(() => firefly.remove(), 1000);
        }
    }, 15000);
}
setInterval(spawnFirefly, 3000);

// --- Secret Codes Menu ---
const SECRETS = {
    "ayuni": triggerSecret,
    "imissyou": () => { document.body.classList.toggle('moody-mode'); }
};
let inputBuffer = "";
let maxSecretLen = Math.max(...Object.keys(SECRETS).map(s => s.length));

document.addEventListener("keydown", function (e) {
    if (e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
        inputBuffer += e.key.toLowerCase();
        if (inputBuffer.length > maxSecretLen) {
            inputBuffer = inputBuffer.substring(inputBuffer.length - maxSecretLen);
        }

        for (let secret in SECRETS) {
            if (inputBuffer.endsWith(secret)) {
                SECRETS[secret]();
                inputBuffer = "";
                break;
            }
        }
    }
});

function triggerSecret() {
    const modal = document.getElementById("secret-modal");
    modal.classList.add("active");

    // Spin avatar fast
    const logo = document.getElementById("logo");
    logo.style.transition = "all 0.1s linear";
    logo.style.transform = "rotate(3600deg) scale(1.2)";
    logo.style.boxShadow = "0 0 100px #ff80ab";

    // Heart explosion
    for (let i = 0; i < 60; i++) {
        setTimeout(spawnFallingItem, i * 30);
    }

    // Hide modal after 8 seconds
    setTimeout(() => {
        modal.classList.remove("active");
        logo.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        logo.style.transform = "none";
        logo.style.boxShadow = "0 0 35px rgba(129, 212, 250, 0.5)";
    }, 8000);
}

// --- Particle Animation Engine ---
var S = {
    init: function () {
        S.Drawing.init('#particle-canvas');
        document.body.classList.add('body--ready');
        S.UI.simulate("あゆに❤️|I will wait for you |untilyou say, |Are you still|waiting for me?|#countdown 3|#heart|I love you❤️|#livecountdown");
        S.Drawing.loop(function () {
            S.Shape.render();
        });
    }
};

S.Drawing = (function () {
    var canvas,
        context,
        renderFn,
        requestFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    return {
        mouse: null,
        init: function (el) {
            canvas = document.querySelector(el);
            context = canvas.getContext('2d');
            this.adjustCanvas();

            var timeout;
            window.addEventListener('resize', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    S.Drawing.adjustCanvas();
                }, 100);
            });

            window.addEventListener('mousemove', function (e) {
                S.Drawing.mouse = { x: e.clientX, y: e.clientY };
            });
            window.addEventListener('touchstart', function (e) {
                if (e.touches.length > 0) {
                    S.Drawing.mouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
            }, { passive: true });
            window.addEventListener('touchend', function () {
                S.Drawing.mouse = null;
            });
            canvas.addEventListener('mouseleave', function () {
                S.Drawing.mouse = null;
            });
        },
        loop: function (fn) {
            renderFn = !renderFn ? fn : renderFn;
            this.clearFrame();
            renderFn();
            requestFrame.call(window, this.loop.bind(this));
        },
        adjustCanvas: function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        },
        clearFrame: function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
        },
        getArea: function () {
            return { w: canvas.width, h: canvas.height };
        },
        drawCircle: function (p, c) {
            context.fillStyle = c.render();
            context.beginPath();
            context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
        }
    };
}());

S.UI = (function () {
    var interval,
        actionTimeout,
        time,
        maxShapeSize = 30,
        sequence = [],
        cmd = '#',
        isPlayingCustomNote = false;

    function clearTimers() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        if (actionTimeout) {
            clearTimeout(actionTimeout);
            actionTimeout = null;
        }
    }

    function formatTime(date) {
        var h = date.getHours(),
            m = date.getMinutes(),
            m = m < 10 ? '0' + m : m;
        return h + ':' + m;
    }

    function getValue(value) {
        return value && value.split(' ')[1];
    }

    function getAction(value) {
        value = value && value.split(' ')[0];
        return value && value[0] === cmd && value.substring(1);
    }

    function formatSimulate(count) {
        return `${count.years}years ${count.days}days\n${count.hours}hours ${count.minutes}minutes`;
    }

    function performAction() {
        if (isPlayingCustomNote) return;

        if (sequence.length === 0) {
            return;
        }

        var current = sequence.shift();
        var action = getAction(current);
        var value = getValue(current);

        switch (action) {
            case 'countdown':
                var count = parseInt(value) || 3;
                function doCountdown(index) {
                    if (isPlayingCustomNote) return;
                    if (index > 0) {
                        S.Shape.switchShape(S.ShapeBuilder.letter(index), true);
                        actionTimeout = setTimeout(function () { doCountdown(index - 1); }, 1000);
                    } else {
                        performAction();
                    }
                }
                doCountdown(count);
                break;

            case 'rectangle':
                value = value && value.split('x');
                value = (value && value.length === 2) ? value : [maxShapeSize, maxShapeSize / 2];
                S.Shape.switchShape(S.ShapeBuilder.rectangle(Math.min(maxShapeSize, parseInt(value[0])), Math.min(maxShapeSize, parseInt(value[1]))));
                actionTimeout = setTimeout(performAction, 2000);
                break;

            case 'circle':
                value = parseInt(value) || maxShapeSize;
                value = Math.min(value, maxShapeSize);
                S.Shape.switchShape(S.ShapeBuilder.circle(value));
                actionTimeout = setTimeout(performAction, 2000);
                break;

            case 'heart':
                S.Shape.switchShape(S.ShapeBuilder.heart());
                actionTimeout = setTimeout(performAction, 3000);
                break;

            case 'time':
                var t = formatTime(new Date());
                S.Shape.switchShape(S.ShapeBuilder.letter(t));
                if (sequence.length > 0) {
                    actionTimeout = setTimeout(performAction, 2000);
                } else {
                    time = t;
                    clearTimers();
                    interval = setInterval(function () {
                        if (isPlayingCustomNote) return;
                        t = formatTime(new Date());
                        if (t !== time) {
                            time = t;
                            S.Shape.switchShape(S.ShapeBuilder.letter(time));
                        }
                    }, 1000);
                }
                break;

            case 'livecountdown':
                clearTimers();
                const startDate = new Date("2025-02-29T15:34:00+08:00");
                let lastSimulateString = "";

                function getCountdownString() {
                    const now = new Date();
                    if (now < startDate) {
                        return "Waiting to start...";
                    }
                    const count = calculateCountdown(COUNTDOWN_TARGET_DATE);
                    if (count.isFinished) return "I kept my promise...❤️";
                    return formatSimulate(count);
                }

                function updateCountdown() {
                    if (isPlayingCustomNote) return;
                    const countdownStr = getCountdownString();
                    if (countdownStr !== lastSimulateString) {
                        S.Shape.switchShape(S.ShapeBuilder.letter(countdownStr));
                        lastSimulateString = countdownStr;
                    }
                    if (new Date() >= COUNTDOWN_TARGET_DATE) {
                        clearTimers();
                    }
                }

                updateCountdown();
                interval = setInterval(updateCountdown, 1000);
                break;

            default:
                S.Shape.switchShape(S.ShapeBuilder.letter(current));
                actionTimeout = setTimeout(performAction, 2000);
                break;
        }
    }

    return {
        simulate: function (action) {
            isPlayingCustomNote = false;
            clearTimers();
            sequence = action.split('|');
            performAction();
        },
        playNote: function (slides, onComplete) {
            isPlayingCustomNote = true;
            clearTimers();
            sequence = [];

            let index = 0;

            function runSlide() {
                if (!isPlayingCustomNote) return;

                if (index >= slides.length) {
                    isPlayingCustomNote = false;
                    if (typeof onComplete === 'function') {
                        onComplete();
                    }
                    // Smooth transition back to live countdown
                    S.UI.simulate("#livecountdown");
                    return;
                }

                const slide = slides[index];
                if (slide.type === 'heart') {
                    S.Shape.switchShape(S.ShapeBuilder.heart());
                } else {
                    S.Shape.switchShape(S.ShapeBuilder.letter(slide.text));
                }

                index++;
                actionTimeout = setTimeout(runSlide, slide.duration || 5000);
            }

            runSlide();
        },
        stopNote: function () {
            if (isPlayingCustomNote) {
                isPlayingCustomNote = false;
                clearTimers();
                S.UI.simulate("#livecountdown");
            }
        },
        isNotePlaying: function () {
            return isPlayingCustomNote;
        }
    };
}());

S.Point = function (args) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.a = args.a;
    this.h = args.h;
};

S.Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};
S.Color.prototype = {
    render: function () {
        return 'rgba(' + this.r + ',' + +this.g + ',' + this.b + ',' + this.a + ')';
    }
};

S.Dot = function (x, y) {
    this.p = new S.Point({ x: x, y: y, z: 3, a: 1, h: 0 });
    this.e = 0.07;
    this.s = true;
    this.c = new S.Color(236, 252, 255, 1, this.p.a);
    this.t = this.clone();
    this.q = [];
};
S.Dot.prototype = {
    clone: function () {
        return new S.Point({
            x: this.x, y: this.y, z: this.z, a: this.a, h: this.h
        });
    },
    _draw: function () {
        this.c.a = this.p.a;
        S.Drawing.drawCircle(this.p, this.c);
    },
    _moveTowards: function (n) {
        var details = this.distanceTo(n, true),
            dx = details[0], dy = details[1], d = details[2],
            e = this.e * d;
        if (this.p.h === -1) {
            this.p.x = n.x;
            this.p.y = n.y;
            return true;
        }
        if (d > 1) {
            this.p.x -= ((dx / d) * e);
            this.p.y -= ((dy / d) * e);
        } else {
            if (this.p.h > 0) {
                this.p.h--;
            } else {
                return true;
            }
        }
        return false;
    },
    _update: function () {

        if (this._moveTowards(this.t)) {
            var p = this.q.shift();
            if (p) {
                this.t.x = p.x || this.p.x;
                this.t.y = p.y || this.p.y;
                this.t.z = p.z || this.p.z;
                this.t.a = p.a || this.p.a;
                this.p.h = p.h || 0;
            } else {
                if (this.s) {
                    this.p.x -= Math.sin(Math.random() * 3.142);
                    this.p.y -= Math.sin(Math.random() * 3.142);
                } else {
                    this.move(new S.Point({
                        x: this.p.x + (Math.random() * 50) - 25,
                        y: this.p.y + (Math.random() * 50) - 25
                    }));
                }
            }
        }
        d = this.p.a - this.t.a;
        this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
        d = this.p.z - this.t.z;
        this.p.z = Math.max(1, this.p.z - (d * 0.05));
    },
    distanceTo: function (n, details) {
        var dx = this.p.x - n.x,
            dy = this.p.y - n.y,
            d = Math.sqrt(dx * dx + dy * dy);
        return details ? [dx, dy, d] : d;
    },
    move: function (p, avoidStatic) {
        if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
            this.q.push(p);
        }
    },
    render: function () {
        this._update();
        this._draw();
    }
};

S.ShapeBuilder = (function () {
    var gap = 11,
        shapeCanvas = document.createElement('canvas'),
        shapeContext = shapeCanvas.getContext('2d'),
        fontSize = 500,
        fontFamily = 'Quicksand, Helvetica Neue, Helvetica, Arial, sans-serif';
    function fit() {
        shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
        shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
        shapeContext.fillStyle = 'red';
        shapeContext.textBaseline = 'middle';
        shapeContext.textAlign = 'center';
    }
    function processCanvas() {
        var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data;
        var dots = [],
            x = 0, y = 0, fx = shapeCanvas.width, fy = shapeCanvas.height, w = 0, h = 0;
        for (var p = 0; p < pixels.length; p += (4 * gap)) {
            if (pixels[p + 3] > 0) {
                dots.push(new S.Point({ x: x, y: y }));
                w = x > w ? x : w;
                h = y > h ? y : h;
                fx = x < fx ? x : fx;
                fy = y < fy ? y : fy;
            }
            x += gap;
            if (x >= shapeCanvas.width) {
                x = 0;
                y += gap;
                p += gap * 4 * shapeCanvas.width;
            }
        }
        return { dots: dots, w: w + fx, h: h + fy };
    }
    function setFontSize(s) {
        shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
    }
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function init() {
        fit();
        window.addEventListener('resize', fit);
    }
    init();
    return {
        imageFile: function (url, callback) {
            var image = new Image(), a = S.Drawing.getArea();
            image.onload = function () {
                shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                shapeContext.drawImage(this, 0, 0, a.h * 0.6, a.h * 0.6);
                callback(processCanvas());
            };
            image.onerror = function () {
                callback(S.ShapeBuilder.letter('What?'));
            };
            image.src = url;
        },
        circle: function (d) {
            var r = Math.max(0, d) / 2;
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.beginPath();
            shapeContext.arc(r * gap, r * gap, r * gap, 0, 2 * Math.PI, false);
            shapeContext.fill();
            shapeContext.closePath();
            return processCanvas();
        },
        heart: function () {
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.beginPath();

            var centerX = shapeCanvas.width / 2;
            var centerY = shapeCanvas.height / 2;
            var scale = gap * 1.8;

            for (var i = 0; i < Math.PI * 2; i += 0.05) {
                var x = 16 * Math.pow(Math.sin(i), 3);
                var y = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i));

                if (i === 0) shapeContext.moveTo(centerX + x * scale, centerY + y * scale);
                else shapeContext.lineTo(centerX + x * scale, centerY + y * scale);
            }
            shapeContext.closePath();
            shapeContext.fill();

            return processCanvas();
        },
        letter: function (l) {
            var text = String(l);
            var lines = text.split('\n');
            setFontSize(fontSize);
            var longestLine = lines.reduce(function (a, b) {
                return shapeContext.measureText(a).width > shapeContext.measureText(b).width ? a : b;
            });
            var textWidth = shapeContext.measureText(longestLine).width;
            var s = Math.min(fontSize,
                (textWidth > 0 ? (shapeCanvas.width / textWidth) * 0.8 * fontSize : fontSize),
                (shapeCanvas.height / lines.length / fontSize) * (isNumber(text) ? 1 : 0.45) * fontSize);
            setFontSize(s);
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);

            for (var i = 0; i < lines.length; i++) {
                var lineY = (shapeCanvas.height / 2) + (s * (i - (lines.length - 1) / 2));
                shapeContext.fillText(lines[i], shapeCanvas.width / 2, lineY);
            }

            return processCanvas();
        },
        rectangle: function (w, h) {
            var dots = [], width = gap * w, height = gap * h;
            for (var y = 0; y < height; y += gap) {
                for (var x = 0; x < width; x += gap) {
                    dots.push(new S.Point({ x: x, y: y }));
                }
            }
            return { dots: dots, w: width, h: height };
        }
    };
}());

S.Shape = (function () {
    var dots = [], width = 0, height = 0, cx = 0, cy = 0;
    function compensate() {
        var a = S.Drawing.getArea();
        cx = a.w / 2 - width / 2;
        cy = a.h / 2 - height / 2;
    }
    return {
        shuffleIdle: function () {
            var a = S.Drawing.getArea();
            for (var d = 0; d < dots.length; d++) {
                if (!dots[d].s) {
                    dots[d].move({
                        x: Math.random() * a.w,
                        y: Math.random() * a.h
                    });
                }
            }
        },
        switchShape: function (n, fast) {
            var size, a = S.Drawing.getArea();
            width = n.w;
            height = n.h;
            compensate();
            if (n.dots.length > dots.length) {
                size = n.dots.length - dots.length;
                for (var d = 1; d <= size; d++) {
                    dots.push(new S.Dot(a.w / 2, a.h / 2));
                }
            }
            var d = 0, i = 0;
            while (n.dots.length > 0) {
                i = Math.floor(Math.random() * n.dots.length);
                dots[d].e = fast ? 0.25 : (dots[d].s ? 0.14 : 0.11);
                if (dots[d].s) {
                    dots[d].move(new S.Point({ z: Math.random() * 20 + 10, a: Math.random(), h: 18 }));
                } else {
                    dots[d].move(new S.Point({ z: Math.random() * 5 + 3, h: fast ? 18 : 30 }));
                }
                dots[d].s = true;
                dots[d].move(new S.Point({ x: n.dots[i].x + cx, y: n.dots[i].y + cy, a: 1, z: 3.5, h: 0 }));
                n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
                d++;
            }
            for (var i = d; i < dots.length; i++) {
                if (dots[i].s) {
                    dots[i].move(new S.Point({ z: Math.random() * 20 + 10, a: Math.random(), h: 20 }));
                    dots[i].s = false;
                    dots[i].e = 0.04;
                    dots[i].move(new S.Point({ x: Math.random() * a.w, y: Math.random() * a.h, a: 0.3, z: Math.random() * 4, h: 0 }));
                }
            }
        },
        render: function () {
            for (var d = 0; d < dots.length; d++) {
                dots[d].render();
            }
        }
    };
}());

S.init();

// --- Interactive Avatar Speech ---
const speechBubble = document.getElementById('avatar-speech');
const avatarMessages = [
    "I miss you! ♡",
    "Stay strong!",
    "Almost there...",
    "Thinking of you...",
    "I'll be waiting!",
    "You got this!"
];

const avatarBtn = document.getElementById('avatar-btn');
const handleAvatarInteraction = (e) => {
    e.stopPropagation();
    if (speechBubble.classList.contains('active')) return;

    const msg = avatarMessages[Math.floor(Math.random() * avatarMessages.length)];
    speechBubble.innerText = "";
    speechBubble.classList.add('active');

    let i = 0;
    const typeInterval = setInterval(() => {
        speechBubble.innerText += msg.charAt(i);
        i++;
        if (i >= msg.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
                speechBubble.classList.remove('active');
            }, 3000);
        }
    }, 80);
};

document.getElementById('logo').addEventListener('click', handleAvatarInteraction);
avatarBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAvatarInteraction(e);
    }
});

// --- Time Capsule ---
const timeCapsule = document.getElementById('time-capsule');
const capsuleTooltip = document.getElementById('time-capsule-tooltip');

timeCapsule.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = new Date();
    if (now < COUNTDOWN_TARGET_DATE) {
        timeCapsule.classList.remove('shake');
        void timeCapsule.offsetWidth; // trigger reflow
        timeCapsule.classList.add('shake');

        capsuleTooltip.classList.add('active');
        setTimeout(() => {
            capsuleTooltip.classList.remove('active');
        }, 2000);
    } else {
        capsuleTooltip.innerText = "Unlocked! ♡";
        capsuleTooltip.classList.add('active');
        setTimeout(() => {
            alert("The time has come! The distance is closed. I love you! ♡");
        }, 500);
    }
});



// --- Long Hold Secret (Ice Crystal Rain) ---
let holdInterval;
let holdProgress = 0;
const chargeRing = document.getElementById('charge-ring');
const logoImg = document.getElementById('logo');

function startHold(e) {
    if (e.type === 'mousedown') e.preventDefault();
    holdProgress = 0;
    chargeRing.style.background = `conic-gradient(rgba(255, 255, 255, 0.5) 0%, transparent 0)`;

    holdInterval = setInterval(() => {
        holdProgress += 2;
        chargeRing.style.background = `conic-gradient(rgba(255, 255, 255, 0.5) ${holdProgress}%, transparent 0)`;

        if (holdProgress >= 100) {
            clearInterval(holdInterval);
            rainIceCrystals();
            holdProgress = 0;
            chargeRing.style.background = `conic-gradient(rgba(255, 255, 255, 0.5) 0%, transparent 0)`;
        }
    }, 30); // ~3s hold
}

function stopHold() {
    clearInterval(holdInterval);
    holdProgress = 0;
    if (chargeRing) {
        chargeRing.style.background = `conic-gradient(rgba(255, 255, 255, 0.5) 0%, transparent 0)`;
    }
}

function rainIceCrystals() {
    // Create a burst of snowflakes
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const item = document.createElement("div");
            item.classList.add("falling-item");
            const crystals = ["❄", "❅", "❆", "✧", "✶"];
            item.innerHTML = crystals[Math.floor(Math.random() * crystals.length)];
            item.style.left = Math.random() * 100 + "vw";
            item.style.animationDuration = Math.random() * 3 + 2 + "s";
            item.style.fontSize = Math.random() * 20 + 15 + "px";
            item.style.color = "#ffffff";
            item.style.filter = "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))";
            item.style.zIndex = "100";
            document.body.appendChild(item);
            setTimeout(() => { if (item.parentNode) item.remove(); }, 5000);
        }, i * 20);
    }
}

logoImg.addEventListener('mousedown', startHold);
logoImg.addEventListener('mouseup', stopHold);
logoImg.addEventListener('mouseleave', stopHold);
logoImg.addEventListener('touchstart', startHold, { passive: true });
logoImg.addEventListener('touchend', stopHold);

// --- Centered Settings Modal Toggle & Controls ---
const settingsBtn = document.getElementById('settings-tab');
const settingsModal = document.getElementById('settings-modal') || document.getElementById('settings-drawer');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettingsBtn = document.getElementById('close-settings');
const toggleMusicCb = document.getElementById('toggle-music');
const toggleParticlesCb = document.getElementById('toggle-particles');
const toggleLightingCb = document.getElementById('toggle-lighting');

function toggleSettingsModal(open) {
    if (!settingsModal || !settingsBtn) return;
    const isCurrentlyOpen = settingsModal.classList.contains('open');
    const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

    if (shouldOpen) {
        settingsModal.classList.add('open');
        if (settingsOverlay) settingsOverlay.classList.add('open');
        settingsBtn.classList.add('hidden');
    } else {
        settingsModal.classList.remove('open');
        if (settingsOverlay) settingsOverlay.classList.remove('open');
        settingsBtn.classList.remove('hidden');
    }
}

if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettingsModal(true);
    });
}

if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettingsModal(false);
    });
}

if (settingsOverlay) {
    settingsOverlay.addEventListener('click', () => {
        toggleSettingsModal(false);
    });
}

// Close when clicking outside modal & arrow button
document.addEventListener('click', (e) => {
    if (settingsModal && settingsModal.classList.contains('open')) {
        if (!settingsModal.contains(e.target) && !settingsBtn.contains(e.target)) {
            toggleSettingsModal(false);
        }
    }
});

// --- Synchronized Audio & Settings Control ---
const audioElem = document.getElementById('background_music');
const audioBtn = document.getElementById('audio-btn');
const volumeSlider = document.getElementById('volume-slider');

const PLAYING_SVG = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const MUTED_SVG = `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

let isAudioPlaying = false;

function setAudioState(play) {
    isAudioPlaying = play;

    // 1. Play / Pause Audio Element
    if (audioElem) {
        if (play) {
            audioElem.play().catch(() => {
                isAudioPlaying = false;
                updateAudioUI(false);
            });
        } else {
            audioElem.pause();
        }
    }

    // 2. Sync Both UI Controls
    updateAudioUI(isAudioPlaying);
}

function updateAudioUI(playing) {
    // Sync Settings Checkbox Switch
    if (toggleMusicCb) {
        toggleMusicCb.checked = playing;
    }

    // Sync Outside Audio Button Icon & Title
    if (audioBtn) {
        audioBtn.innerHTML = playing ? PLAYING_SVG : MUTED_SVG;
        audioBtn.title = playing ? "Mute Music" : "Play Music";
    }
}

// Event Listener for Outside Audio Button
if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setAudioState(!isAudioPlaying);
    });
}

// --- First Click / Gesture Audio Unlock & Toast Prompt ---
let hasAudioUnlocked = false;
const audioPromptToast = document.getElementById('audio-prompt-toast');

function showAudioPromptToast() {
    if (audioPromptToast && !isAudioPlaying && !hasAudioUnlocked) {
        audioPromptToast.classList.add('show');
    }
}

function hideAudioPromptToast() {
    if (audioPromptToast) {
        audioPromptToast.classList.remove('show');
    }
}

function unlockAudioOnFirstClick(e) {
    if (hasAudioUnlocked) return;

    // Ignore if clicking on audio button or settings toggle directly
    if (audioBtn && audioBtn.contains(e.target)) return;
    if (toggleMusicCb && toggleMusicCb.contains(e.target)) return;

    if (audioElem && !isAudioPlaying) {
        if (typeof playAudioWithFadeIn === 'function') {
            playAudioWithFadeIn();
        } else {
            audioElem.play().catch(() => { });
        }
        hasAudioUnlocked = true;
        setAudioState(true);
        hideAudioPromptToast();
        removeFirstClickUnlock();
    }
}

function removeFirstClickUnlock() {
    document.removeEventListener('click', unlockAudioOnFirstClick, true);
    document.removeEventListener('touchstart', unlockAudioOnFirstClick, true);
    document.removeEventListener('pointerdown', unlockAudioOnFirstClick, true);
    hideAudioPromptToast();
}

// Attach first click/touch unlock listeners
document.addEventListener('click', unlockAudioOnFirstClick, true);
document.addEventListener('touchstart', unlockAudioOnFirstClick, true);
document.addEventListener('pointerdown', unlockAudioOnFirstClick, true);

// Try immediate play on page load if allowed by browser
if (audioElem) {
    audioElem.play().then(() => {
        hasAudioUnlocked = true;
        setAudioState(true);
        hideAudioPromptToast();
        removeFirstClickUnlock();
    }).catch(() => {
        // Autoplay blocked until first click: show reminder toast
        setTimeout(showAudioPromptToast, 600);
    });
}

// Event Listener for Inside Settings Toggle Switch
if (toggleMusicCb) {
    toggleMusicCb.addEventListener('change', (e) => {
        hideAudioPromptToast();
        setAudioState(e.target.checked);
    });
}

// Event Listener for Volume Slider
if (volumeSlider && audioElem) {
    audioElem.volume = parseFloat(volumeSlider.value);
    volumeSlider.addEventListener('input', (e) => {
        audioElem.volume = parseFloat(e.target.value);
    });
}

if (toggleParticlesCb) {
    toggleParticlesCb.addEventListener('change', (e) => {
        if (!e.target.checked) {
            document.querySelectorAll('.falling-item').forEach(el => el.remove());
        }
    });
}

if (toggleLightingCb) {
    toggleLightingCb.addEventListener('change', (e) => {
        if (e.target.checked) {
            updateDynamicLighting();
        } else {
            document.body.style.setProperty('--time-overlay', 'rgba(0, 0, 0, 0)');
        }
    });
}

// --- Quality of Life (QoL) Enhancements ---
const toggleZenCb = document.getElementById('toggle-zen');
let zenToastTimeout;

function setZenMode(enabled) {
    document.body.classList.toggle('zen-mode', enabled);
    if (toggleZenCb) toggleZenCb.checked = enabled;

    const zenToast = document.getElementById('zen-toast');

    if (enabled) {
        // Automatically close settings modal if open
        if (settingsModal && settingsModal.classList.contains('open')) {
            toggleSettingsModal(false);
        }

        // Show brief exit hint toast
        if (zenToast) {
            clearTimeout(zenToastTimeout);
            zenToast.classList.add('show');
            zenToastTimeout = setTimeout(() => {
                zenToast.classList.remove('show');
            }, 3000);
        }
    } else {
        if (zenToast) zenToast.classList.remove('show');
    }

    saveQoLPreferences();
}

if (toggleZenCb) {
    toggleZenCb.addEventListener('change', (e) => {
        setZenMode(e.target.checked);
    });
}

// Click anywhere while in Zen Mode to exit cleanly
document.addEventListener('click', (e) => {
    if (document.body.classList.contains('zen-mode')) {
        if (settingsModal && settingsModal.contains(e.target)) return;
        if (settingsBtn && settingsBtn.contains(e.target)) return;
        setZenMode(false);
    }
});

// 1. Keyboard Hotkeys (S = Settings, M = Mute/Audio, H = Zen View, F = Fullscreen, Esc = Close)
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (key === 's') {
        e.preventDefault();
        toggleSettingsModal();
    } else if (key === 'm') {
        e.preventDefault();
        setAudioState(!isAudioPlaying);
        saveQoLPreferences();
    } else if (key === 'h') {
        e.preventDefault();
        const isZen = !document.body.classList.contains('zen-mode');
        setZenMode(isZen);
    } else if (key === 'f') {
        e.preventDefault();
        toggleFullscreen();
    } else if (key === 'l') {
        e.preventDefault();
        if (S.UI.isNotePlaying && S.UI.isNotePlaying()) {
            stopLoveNotePlayback();
        } else {
            startLoveNotePlayback();
        }
    } else if (key === 'escape') {
        if (S.UI.isNotePlaying && S.UI.isNotePlaying()) {
            stopLoveNotePlayback();
        } else if (settingsModal && settingsModal.classList.contains('open')) {
            toggleSettingsModal(false);
        } else if (document.body.classList.contains('zen-mode')) {
            setZenMode(false);
        }
    }
});

// --- Settings Sidebar Tab Switching ---
function switchSettingsTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${tabName}`);
    });
}

document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
        switchSettingsTab(e.currentTarget.dataset.tab);
    });
});

// 2. Timer Format & Theme Accent Control
function setTimerMode(mode) {
    currentTimerMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    updateCountdownDisplay();
    saveQoLPreferences();
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.classList.remove('theme-rose', 'theme-purple', 'theme-emerald');
    if (theme !== 'cyan') {
        document.body.classList.add(`theme-${theme}`);
    }
    document.querySelectorAll('.theme-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.theme === theme);
    });
    saveQoLPreferences();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
    } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
    }
}

// Event Listeners for Theme Pills
document.querySelectorAll('.theme-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
        setTheme(e.currentTarget.dataset.theme);
    });
});

// Event Listeners for Timer Mode Buttons
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        setTimerMode(e.currentTarget.dataset.mode);
    });
});

// Event Listener for Fullscreen Switch
const toggleFullscreenCb = document.getElementById('toggle-fullscreen');
if (toggleFullscreenCb) {
    toggleFullscreenCb.addEventListener('change', () => {
        toggleFullscreen();
    });
}
document.addEventListener('fullscreenchange', () => {
    if (toggleFullscreenCb) toggleFullscreenCb.checked = !!document.fullscreenElement;
});



// UI Click Sound Effects Synthesizer
function playClickSound() {
    if (!isClickSoundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) { }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('button, input, select, a, [role="button"]')) {
        playClickSound();
    }
});



// Fade In Audio Toggle
const toggleFadeinCb = document.getElementById('toggle-fadein');
if (toggleFadeinCb) {
    toggleFadeinCb.addEventListener('change', () => {
        isFadeInEnabled = toggleFadeinCb.checked;
        saveQoLPreferences();
    });
}

function playAudioWithFadeIn() {
    if (!audioElem) return;
    if (isFadeInEnabled) {
        const targetVol = volumeSlider ? parseFloat(volumeSlider.value) : 0.5;
        audioElem.volume = 0;
        audioElem.play().then(() => {
            let vol = 0;
            const fade = setInterval(() => {
                vol += 0.05;
                if (vol >= targetVol) {
                    audioElem.volume = targetVol;
                    clearInterval(fade);
                } else {
                    audioElem.volume = vol;
                }
            }, 80);
        }).catch(() => { });
    } else {
        audioElem.play().catch(() => { });
    }
}

// Particle Density Buttons
document.querySelectorAll('[data-density]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentDensity = e.currentTarget.dataset.density;
        document.querySelectorAll('[data-density]').forEach(b => b.classList.toggle('active', b.dataset.density === currentDensity));
        updateParticleSpawner();
        saveQoLPreferences();
    });
});

// Particle Fall Speed Buttons
document.querySelectorAll('[data-speed]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFallSpeed = e.currentTarget.dataset.speed;
        document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('active', b.dataset.speed === currentFallSpeed));
        saveQoLPreferences();
    });
});

// Glow Pulse Aura Toggle
const toggleGlowCb = document.getElementById('toggle-glow');
if (toggleGlowCb) {
    toggleGlowCb.addEventListener('change', () => {
        isGlowEnabled = toggleGlowCb.checked;
        document.body.classList.toggle('no-glow', !isGlowEnabled);
        saveQoLPreferences();
    });
}

// Cinematic Edge Vignette Toggle
const toggleVignetteCb = document.getElementById('toggle-vignette');
if (toggleVignetteCb) {
    toggleVignetteCb.addEventListener('change', () => {
        isVignetteEnabled = toggleVignetteCb.checked;
        const vig = document.getElementById('vignette-overlay');
        if (vig) vig.classList.toggle('hidden', !isVignetteEnabled);
        saveQoLPreferences();
    });
}

// Inactivity Auto-Sleep Dimmer
const toggleAutosleepCb = document.getElementById('toggle-autosleep');
function resetAutoSleepTimer() {
    document.body.classList.remove('autosleep-dimmed');
    if (autoSleepTimer) clearTimeout(autoSleepTimer);
    if (isAutoSleepEnabled) {
        autoSleepTimer = setTimeout(() => {
            document.body.classList.add('autosleep-dimmed');
        }, 300000); // 5 minutes
    }
}

if (toggleAutosleepCb) {
    toggleAutosleepCb.addEventListener('change', () => {
        isAutoSleepEnabled = toggleAutosleepCb.checked;
        resetAutoSleepTimer();
        saveQoLPreferences();
    });
}
document.addEventListener('mousemove', resetAutoSleepTimer);
document.addEventListener('keypress', resetAutoSleepTimer);

// Compact Mini-Bar Mode Toggle
const toggleMinimodeCb = document.getElementById('toggle-minimode');
if (toggleMinimodeCb) {
    toggleMinimodeCb.addEventListener('change', () => {
        isMiniModeEnabled = toggleMinimodeCb.checked;
        document.body.classList.toggle('mini-mode', isMiniModeEnabled);
        saveQoLPreferences();
    });
}

// Glass Blur Strength Buttons
document.querySelectorAll('[data-blur]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentBlur = e.currentTarget.dataset.blur;
        document.querySelectorAll('[data-blur]').forEach(b => b.classList.toggle('active', b.dataset.blur === currentBlur));
        document.body.classList.remove('blur-subtle', 'blur-deep');
        if (currentBlur !== 'standard') document.body.classList.add(`blur-${currentBlur}`);
        saveQoLPreferences();
    });
});

// Timer Typography Font Buttons
document.querySelectorAll('[data-font]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFont = e.currentTarget.dataset.font;
        document.querySelectorAll('[data-font]').forEach(b => b.classList.toggle('active', b.dataset.font === currentFont));
        document.body.classList.remove('font-serif', 'font-mono');
        if (currentFont !== 'sans') document.body.classList.add(`font-${currentFont}`);
        saveQoLPreferences();
    });
});

// Seconds Visibility Toggle
const toggleSecondsCb = document.getElementById('toggle-seconds');
if (toggleSecondsCb) {
    toggleSecondsCb.addEventListener('change', () => {
        isSecondsVisible = toggleSecondsCb.checked;
        updateCountdownDisplay();
        saveQoLPreferences();
    });
}

// Milestones Bar Toggle
const toggleMilestonesCb = document.getElementById('toggle-milestones');
if (toggleMilestonesCb) {
    toggleMilestonesCb.addEventListener('change', () => {
        isMilestonesVisible = toggleMilestonesCb.checked;
        const w = document.querySelector('.progress-widget');
        if (w) w.style.display = isMilestonesVisible ? 'flex' : 'none';
        saveQoLPreferences();
    });
}

// Completion Percentage Badge Toggle
const togglePercentBadgeCb = document.getElementById('toggle-percent-badge');
if (togglePercentBadgeCb) {
    togglePercentBadgeCb.addEventListener('change', () => {
        isPercentBadgeVisible = togglePercentBadgeCb.checked;
        updateCountdownDisplay();
        saveQoLPreferences();
    });
}

// Auto-Rotate Quotes Toggle
const toggleAutoQuoteCb = document.getElementById('toggle-auto-quote');
if (toggleAutoQuoteCb) {
    toggleAutoQuoteCb.addEventListener('change', () => {
        isAutoQuoteEnabled = toggleAutoQuoteCb.checked;
        saveQoLPreferences();
    });
}


// UI Click Sound Toggle
const toggleClickSoundCb = document.getElementById('toggle-click-sound');
if (toggleClickSoundCb) {
    toggleClickSoundCb.addEventListener('change', () => {
        isClickSoundEnabled = toggleClickSoundCb.checked;
        saveQoLPreferences();
    });
}

// Export Memory Snapshot Modal
const exportSnapshotBtn = document.getElementById('export-snapshot-btn');
const snapshotModal = document.getElementById('snapshot-modal');
const closeSnapshotBtn = document.getElementById('close-snapshot');

if (exportSnapshotBtn && snapshotModal) {
    exportSnapshotBtn.addEventListener('click', () => {
        const inlineBar = document.querySelector('.timer-inline-bar');
        const snapTimer = document.getElementById('snapshot-timer-text');
        if (inlineBar && snapTimer) snapTimer.innerText = inlineBar.innerText;
        snapshotModal.classList.add('open');
    });
}

if (closeSnapshotBtn && snapshotModal) {
    closeSnapshotBtn.addEventListener('click', () => {
        snapshotModal.classList.remove('open');
    });
}

// Reset Settings Button
const resetPrefsBtn = document.getElementById('reset-prefs-btn');
if (resetPrefsBtn) {
    resetPrefsBtn.addEventListener('click', () => {
        if (confirm("Reset all settings and preferences back to default?")) {
            localStorage.removeItem('user_qol_prefs');
            location.reload();
        }
    });
}

// Event Listeners for Timer Direction (Countdown vs Count Up)
function setTimerDirection(dir) {
    currentTimerDirection = dir;
    document.querySelectorAll('.dir-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.dir === dir);
    });
    updateCountdownDisplay();
    saveQoLPreferences();
}

document.querySelectorAll('.dir-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        setTimerDirection(e.currentTarget.dataset.dir);
    });
});

// Daily Love Quotes & Floating Typewriter Switcher
const LOVE_QUOTES = [
    "Every second with you is a memory I'll treasure forever.",
    "Distance means nothing when someone means everything.",
    "I will wait for you, no matter how long it takes.",
    "You are my favorite thought every single day.",
    "Six years is just a chapter in our lifetime story.",
    "Holding you in my heart until I can hold you in my arms.",
    "Every day closer to May 26, 2031 ♡"
];
let currentQuoteIdx = 0;
let typewriterTimeout = null;

function typeWriterQuote() {
    const textElem = document.getElementById('typewriter-text');
    const qElem = document.getElementById('daily-quote-text');
    const fullText = LOVE_QUOTES[currentQuoteIdx];

    if (qElem) qElem.innerText = `"${fullText}"`;
    if (!textElem) return;

    if (typewriterTimeout) clearTimeout(typewriterTimeout);

    // Smooth fade out before typing new quote
    textElem.classList.add('fade-out');

    setTimeout(() => {
        textElem.innerHTML = '';
        textElem.classList.remove('fade-out');

        let charIdx = 0;
        const typeInterval = setInterval(() => {
            if (charIdx <= fullText.length) {
                const currentStr = fullText.substring(0, charIdx);
                textElem.innerHTML = `${currentStr}<span class="typewriter-cursor">|</span>`;
                charIdx++;
            } else {
                clearInterval(typeInterval);
                // Hold quote on screen for 60 seconds (1 minute), then type next quote!
                typewriterTimeout = setTimeout(() => {
                    if (isAutoQuoteEnabled) {
                        currentQuoteIdx = (currentQuoteIdx + 1) % LOVE_QUOTES.length;
                        typeWriterQuote();
                    }
                }, 60000);
            }
        }, 45); // 1 letter showing every 45ms
    }, 450);
}

function nextQuote() {
    currentQuoteIdx = (currentQuoteIdx + 1) % LOVE_QUOTES.length;
    typeWriterQuote();
}

const nextQuoteBtn = document.getElementById('next-quote-btn');
if (nextQuoteBtn) {
    nextQuoteBtn.addEventListener('click', nextQuote);
}

setTimeout(typeWriterQuote, 600);

// Zero-Lag Click Starburst Effect
document.addEventListener('click', (e) => {
    if (settingsModal && settingsModal.contains(e.target)) return;
    if (settingsBtn && settingsBtn.contains(e.target)) return;
    if (document.body.classList.contains('zen-mode')) return;

    const burstPool = ["✨", "💖", "✦", "🌸", "⭐"];
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.classList.add('click-starburst');
        star.innerText = burstPool[Math.floor(Math.random() * burstPool.length)];

        const dx = (Math.random() - 0.5) * 90 + 'px';
        const dy = (Math.random() - 0.5) * 90 + 'px';

        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        star.style.setProperty('--dx', dx);
        star.style.setProperty('--dy', dy);

        document.body.appendChild(star);
        setTimeout(() => star.remove(), 600);
    }
});

// LocalStorage Settings Persistence
function saveQoLPreferences() {
    try {
        const prefs = {
            music: isAudioPlaying,
            volume: volumeSlider ? volumeSlider.value : 0.5,
            fadeIn: isFadeInEnabled,
            particles: toggleParticlesCb ? toggleParticlesCb.checked : true,
            density: currentDensity,
            fallSpeed: currentFallSpeed,
            lighting: toggleLightingCb ? toggleLightingCb.checked : true,
            glow: isGlowEnabled,
            vignette: isVignetteEnabled,
            zen: document.body.classList.contains('zen-mode'),
            autosleep: isAutoSleepEnabled,
            minimode: isMiniModeEnabled,
            theme: currentTheme,
            blur: currentBlur,
            font: currentFont,
            timerMode: currentTimerMode,
            timerDirection: currentTimerDirection,
            secondsVis: isSecondsVisible,
            milestonesVis: isMilestonesVisible,
            percentBadgeVis: isPercentBadgeVisible,
            autoQuote: isAutoQuoteEnabled,
            clickSound: isClickSoundEnabled
        };
        localStorage.setItem('user_qol_prefs', JSON.stringify(prefs));
    } catch (e) { }
}

function loadQoLPreferences() {
    try {
        document.body.classList.toggle('mini-mode', isMiniModeEnabled);
        resetAutoSleepTimer();
        const saved = localStorage.getItem('user_qol_prefs');
        if (!saved) return;
        const prefs = JSON.parse(saved);

        if (volumeSlider && prefs.volume !== undefined) {
            volumeSlider.value = prefs.volume;
            if (audioElem) audioElem.volume = parseFloat(prefs.volume);
        }
        if (toggleFadeinCb && prefs.fadeIn !== undefined) {
            toggleFadeinCb.checked = prefs.fadeIn;
            isFadeInEnabled = prefs.fadeIn;
        }
        if (toggleParticlesCb && prefs.particles !== undefined) {
            toggleParticlesCb.checked = prefs.particles;
        }
        if (prefs.density) {
            currentDensity = prefs.density;
            document.querySelectorAll('[data-density]').forEach(b => b.classList.toggle('active', b.dataset.density === currentDensity));
            updateParticleSpawner();
        }
        if (prefs.fallSpeed) {
            currentFallSpeed = prefs.fallSpeed;
            document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('active', b.dataset.speed === currentFallSpeed));
        }
        if (toggleLightingCb && prefs.lighting !== undefined) {
            toggleLightingCb.checked = prefs.lighting;
            if (!prefs.lighting) document.body.style.setProperty('--time-overlay', 'rgba(0, 0, 0, 0)');
        }
        if (toggleGlowCb && prefs.glow !== undefined) {
            toggleGlowCb.checked = prefs.glow;
            isGlowEnabled = prefs.glow;
            document.body.classList.toggle('no-glow', !isGlowEnabled);
        }
        if (toggleVignetteCb && prefs.vignette !== undefined) {
            toggleVignetteCb.checked = prefs.vignette;
            isVignetteEnabled = prefs.vignette;
            const vig = document.getElementById('vignette-overlay');
            if (vig) vig.classList.toggle('hidden', !isVignetteEnabled);
        }
        if (toggleAutosleepCb && prefs.autosleep !== undefined) {
            toggleAutosleepCb.checked = prefs.autosleep;
            isAutoSleepEnabled = prefs.autosleep;
            resetAutoSleepTimer();
        }
        if (toggleMinimodeCb && prefs.minimode !== undefined) {
            toggleMinimodeCb.checked = prefs.minimode;
            isMiniModeEnabled = prefs.minimode;
            document.body.classList.toggle('mini-mode', isMiniModeEnabled);
        }
        if (prefs.theme) {
            setTheme(prefs.theme);
        }
        if (prefs.blur) {
            currentBlur = prefs.blur;
            document.querySelectorAll('[data-blur]').forEach(b => b.classList.toggle('active', b.dataset.blur === currentBlur));
            document.body.classList.remove('blur-subtle', 'blur-deep');
            if (currentBlur !== 'standard') document.body.classList.add(`blur-${currentBlur}`);
        }
        if (prefs.font) {
            currentFont = prefs.font;
            document.querySelectorAll('[data-font]').forEach(b => b.classList.toggle('active', b.dataset.font === currentFont));
            document.body.classList.remove('font-serif', 'font-mono');
            if (currentFont !== 'sans') document.body.classList.add(`font-${currentFont}`);
        }
        if (prefs.timerMode) {
            setTimerMode(prefs.timerMode);
        }
        if (prefs.timerDirection) {
            setTimerDirection(prefs.timerDirection);
        }
        if (toggleSecondsCb && prefs.secondsVis !== undefined) {
            toggleSecondsCb.checked = prefs.secondsVis;
            isSecondsVisible = prefs.secondsVis;
        }
        if (toggleMilestonesCb && prefs.milestonesVis !== undefined) {
            toggleMilestonesCb.checked = prefs.milestonesVis;
            isMilestonesVisible = prefs.milestonesVis;
            const w = document.querySelector('.progress-widget');
            if (w) w.style.display = isMilestonesVisible ? 'flex' : 'none';
        }
        if (togglePercentBadgeCb && prefs.percentBadgeVis !== undefined) {
            togglePercentBadgeCb.checked = prefs.percentBadgeVis;
            isPercentBadgeVisible = prefs.percentBadgeVis;
        }
        if (toggleAutoQuoteCb && prefs.autoQuote !== undefined) {
            toggleAutoQuoteCb.checked = prefs.autoQuote;
            isAutoQuoteEnabled = prefs.autoQuote;
        }
        if (toggleClickSoundCb && prefs.clickSound !== undefined) {
            toggleClickSoundCb.checked = prefs.clickSound;
            isClickSoundEnabled = prefs.clickSound;
        }
        if (prefs.zen) {
            setZenMode(true);
        }
        if (prefs.music) {
            setAudioState(true);
        }
    } catch (e) { }
}

if (volumeSlider) volumeSlider.addEventListener('change', saveQoLPreferences);
if (toggleParticlesCb) toggleParticlesCb.addEventListener('change', saveQoLPreferences);
if (toggleLightingCb) toggleLightingCb.addEventListener('change', saveQoLPreferences);

setTimeout(loadQoLPreferences, 100);

// ==========================================================================
// HEARTFELT LOVE NOTE PARTICLE PLAYBACK SYSTEM
// ==========================================================================
const LOVE_NOTE_SLIDES = [

    // INTRO — gentle, personal
    { text: "I love her", duration: 3000 },
    { text: "but", duration: 2200 },
    { text: "I know\nmy place.", duration: 4200 },

    // PART 2 — explaining the feeling
    { text: "I know that,\nsometimes,", duration: 3600 },
    { text: "loving\nsomeone", duration: 3000 },
    { text: "doesn't mean", duration: 2700 },
    { text: "reaching for\ntheir hand.", duration: 4200 },

    { text: "Sometimes\nit means", duration: 2800 },
    { text: "admiring them\nquietly,", duration: 4000 },
    { text: "from a\ndistance", duration: 3300 },
    { text: "that doesn't\nmake them", duration: 3400 },
    { text: "uncomfortable.", duration: 4600 },

    // PART 3 — more serious / restrained
    { text: "I know", duration: 2400 },
    { text: "I cannot\ndemand", duration: 3400 },
    { text: "her time,", duration: 2800 },
    { text: "her attention,", duration: 3000 },
    { text: "or a place", duration: 2800 },
    { text: "in her\nheart.", duration: 4000 },

    { text: "I cannot\nmake myself", duration: 3600 },
    { text: "important", duration: 2800 },
    { text: "in a story", duration: 3000 },
    { text: "where she\nnever asked me", duration: 4000 },
    { text: "to be a\ncharacter.", duration: 4200 },

    // PART 4 — emotional pause
    { text: "And still,", duration: 3200 },
    { text: "I care.", duration: 4200 },

    { text: "I care enough", duration: 3000 },
    { text: "to respect", duration: 2700 },
    { text: "her choices,", duration: 3200 },
    { text: "even when\nthey're not", duration: 3500 },
    { text: "the choices", duration: 2700 },
    { text: "I hoped for.", duration: 4200 },

    { text: "I care\nenough", duration: 3000 },
    { text: "to let\nher have", duration: 3300 },
    { text: "her own\nhappiness,", duration: 3600 },
    { text: "even when", duration: 2800 },
    { text: "I'm not\npart of it.", duration: 4300 },

    // PART 5 — slower, reflective
    { text: "Maybe that's", duration: 3000 },
    { text: "the hardest\npart", duration: 3500 },
    { text: "of loving\nsomeone:", duration: 4200 },

    { text: "accepting", duration: 3000 },
    { text: "that your\nfeelings", duration: 3500 },
    { text: "can be\nsincere", duration: 3400 },
    { text: "without\ngiving you", duration: 3600 },
    { text: "ownership", duration: 3000 },
    { text: "over their\nheart.", duration: 4400 },

    // PART 6 — calm acceptance
    { text: "So\nI'll stay", duration: 3000 },
    { text: "where I\nbelong", duration: 3500 },
    { text: "close\nenough", duration: 2800 },
    { text: "to wish\nher well,", duration: 3600 },
    { text: "far enough", duration: 3000 },
    { text: "to let her\nbreathe.", duration: 4400 },

    // PART 7 — hopeful
    { text: "And if\none day", duration: 3200 },
    { text: "she looks\nmy way,", duration: 3500 },
    { text: "I'll be\ngrateful.", duration: 4300 },

    { text: "If she\ndoesn't,", duration: 3300 },
    { text: "I'll still\nbe grateful", duration: 3700 },
    { text: "that I got\nto know", duration: 3500 },
    { text: "what it\nfeels like", duration: 3400 },
    { text: "to care for\nsomeone", duration: 3600 },
    { text: "this deeply.", duration: 4400 },

    // PART 8 — IMPORTANT MESSAGE
    { text: "Because", duration: 3000 },
    { text: "I don't need", duration: 3600 },
    { text: "to be chosen", duration: 3200 },
    { text: "to know", duration: 2800 },
    { text: "that my love\nwas real.", duration: 4800 },

    // PART 9 — final realization
    { text: "I just need", duration: 3000 },
    { text: "to make sure", duration: 3000 },
    { text: "that while\nloving her,", duration: 3700 },
    { text: "I never\nforget", duration: 3300 },
    { text: "to respect\nher.", duration: 4600 },

    // ENDING — slow it down
    { text: "I love her.", duration: 4000 },
    { text: "And that's\nenough.", duration: 5200 },

    // HEART — let it breathe
    { type: 'heart', duration: 5000 }

];

const playLoveNoteBtn = document.getElementById('play-love-note-btn');
const notePlaybackPill = document.getElementById('note-playback-pill');
const noteReturnBtn = document.getElementById('note-return-btn');

function startLoveNotePlayback() {
    playClickSound();
    toggleSettingsModal(false);

    document.body.classList.add('playing-love-note');
    if (notePlaybackPill) notePlaybackPill.classList.add('active');

    S.UI.playNote(LOVE_NOTE_SLIDES, () => {
        document.body.classList.remove('playing-love-note');
        if (notePlaybackPill) notePlaybackPill.classList.remove('active');
    });
}

function stopLoveNotePlayback() {
    playClickSound();
    document.body.classList.remove('playing-love-note');
    if (notePlaybackPill) notePlaybackPill.classList.remove('active');
    S.UI.stopNote();
}

if (playLoveNoteBtn) {
    playLoveNoteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startLoveNotePlayback();
    });
}

if (noteReturnBtn) {
    noteReturnBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopLoveNotePlayback();
    });
}
