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

// --- Custom Cursor & Ripple ---
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

window.isMouseDown = false;

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Parallax background
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    document.body.style.setProperty('--bg-x', `calc(50% + ${-x}px)`);
    document.body.style.setProperty('--bg-y', `calc(50% + ${-y}px)`);

    // Create trail
    if (Math.random() > 0.6) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 500);
    }
});

document.addEventListener('mousedown', (e) => {
    window.isMouseDown = true;
    cursor.classList.add('clicking');

    // Create ripple
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
});

document.addEventListener('mouseup', () => {
    window.isMouseDown = false;
    cursor.classList.remove('clicking');
});

// --- Countdown Logic ---
function calculateCountdown(targetDate) {
    const now = new Date();

    if (now >= targetDate) {
        return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    let years = targetDate.getFullYear() - now.getFullYear();
    let anniversary = new Date(now);
    anniversary.setFullYear(now.getFullYear() + years);

    if (anniversary > targetDate) {
        years--;
        anniversary.setFullYear(now.getFullYear() + years);
    }

    let remainingMs = targetDate - anniversary;
    const msPerDay = 1000 * 60 * 60 * 24;
    const msPerHour = 1000 * 60 * 60;
    const msPerMinute = 1000 * 60;
    const msPerSecond = 1000;

    const days = Math.floor(remainingMs / msPerDay);
    remainingMs -= days * msPerDay;
    const hours = Math.floor(remainingMs / msPerHour);
    remainingMs -= hours * msPerHour;
    const minutes = Math.floor(remainingMs / msPerMinute);
    remainingMs -= minutes * msPerMinute;
    const seconds = Math.floor(remainingMs / msPerSecond);

    return { years, days, hours, minutes, seconds, isFinished: false };
}

function updateCountdownDisplay() {
    const spanElement = document.getElementById("span_dt_dt");
    const count = calculateCountdown(COUNTDOWN_TARGET_DATE);

    if (count.isFinished) {
        spanElement.innerHTML = "I kept my promise...❤️";
        return;
    }

    spanElement.innerHTML = `${count.years} years ${count.days} days ${count.hours}hours ${count.minutes}minutes ${count.seconds}seconds`;
}

updateCountdownDisplay();
setInterval(updateCountdownDisplay, 1000);

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
function spawnFallingItem() {
    const item = document.createElement("div");
    item.classList.add("falling-item");

    const snowflakes = ["❅", "❆", "❄", "❀", "*"];
    item.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];

    // Randomize position and size
    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = Math.random() * 5 + 6 + "s"; // 6 to 11 seconds
    item.style.fontSize = Math.random() * 15 + 10 + "px"; // 10px to 25px

    document.body.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, 11000);
}
setInterval(spawnFallingItem, 600); // Spawn a new one every 600ms

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

    const floatInterval = setInterval(() => {
        x += Math.cos(angle) * speed;
        y += Math.sin(angle) * speed;
        angle += (Math.random() - 0.5) * 0.2;

        if (x < 0 || x > window.innerWidth) angle = Math.PI - angle;
        if (y < 0 || y > window.innerHeight) angle = -angle;

        firefly.style.left = x + 'px';
        firefly.style.top = y + 'px';
    }, 50);

    firefly.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        clearInterval(floatInterval);
        firefly.classList.add('burst');
        setTimeout(() => firefly.remove(), 500);
    });

    setTimeout(() => {
        if (firefly.parentNode) {
            clearInterval(floatInterval);
            firefly.style.opacity = '0';
            setTimeout(() => firefly.remove(), 1000);
        }
    }, 15000);
}
setInterval(spawnFirefly, 3000);

// --- Secret Codes Menu ---
const SECRETS = {
    "ayuni": triggerSecret,
    "missyou": () => { document.body.classList.toggle('moody-mode'); }
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
        S.Drawing.init('.canvas');
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

            canvas.addEventListener('mousemove', function (e) {
                S.Drawing.mouse = { x: e.clientX, y: e.clientY };
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
        time,
        maxShapeSize = 30,
        sequence = [],
        cmd = '#';

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
                    if (index > 0) {
                        S.Shape.switchShape(S.ShapeBuilder.letter(index), true);
                        setTimeout(function () { doCountdown(index - 1); }, 1000);
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
                setTimeout(performAction, 2000);
                break;

            case 'circle':
                value = parseInt(value) || maxShapeSize;
                value = Math.min(value, maxShapeSize);
                S.Shape.switchShape(S.ShapeBuilder.circle(value));
                setTimeout(performAction, 2000);
                break;

            case 'heart':
                S.Shape.switchShape(S.ShapeBuilder.heart());
                setTimeout(performAction, 3000);
                break;

            case 'time':
                var t = formatTime(new Date());
                S.Shape.switchShape(S.ShapeBuilder.letter(t));
                if (sequence.length > 0) {
                    setTimeout(performAction, 2000);
                } else {
                    time = t;
                    clearInterval(interval);
                    interval = setInterval(function () {
                        t = formatTime(new Date());
                        if (t !== time) {
                            time = t;
                            S.Shape.switchShape(S.ShapeBuilder.letter(time));
                        }
                    }, 1000);
                }
                break;

            case 'livecountdown':
                clearInterval(interval);
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
                    const countdownStr = getCountdownString();
                    if (countdownStr !== lastSimulateString) {
                        S.Shape.switchShape(S.ShapeBuilder.letter(countdownStr));
                        lastSimulateString = countdownStr;
                    }
                    if (new Date() >= COUNTDOWN_TARGET_DATE) {
                        clearInterval(interval);
                    }
                }

                updateCountdown();
                interval = setInterval(updateCountdown, 1000);
                break;

            default:
                S.Shape.switchShape(S.ShapeBuilder.letter(current));
                setTimeout(performAction, 2000);
                break;
        }
    }

    return {
        simulate: function (action) {
            sequence = action.split('|');
            performAction();
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
        if (S.Drawing.mouse) {
            var distToMouse = this.distanceTo(S.Drawing.mouse, true);
            var dist = distToMouse[2];
            var interactionRadius = 120;

            if (dist < interactionRadius && dist > 0) {
                var force = (interactionRadius - dist) / interactionRadius;
                var dx = distToMouse[0] / dist;
                var dy = distToMouse[1] / dist;
                if (window.isMouseDown) {
                    // Pull particles towards the mouse
                    this.p.x -= dx * force * 15;
                    this.p.y -= dy * force * 15;
                } else {
                    // Push particles away
                    this.p.x += dx * force * 15;
                    this.p.y += dy * force * 15;
                }
            }
        }

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
    var gap = 9,
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

// --- Audio Interaction UI ---
const audio = document.getElementById('background_music');
const audioBtn = document.getElementById('audio-btn');

const iconMuted = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
const iconPlaying = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';

let isPlaying = false;

const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });
}

function playAudio() {
    audio.play().then(() => {
        isPlaying = true;
        audioBtn.innerHTML = `<svg viewBox="0 0 24 24">${iconPlaying}</svg>`;
    }).catch(error => {
        console.error("Audio playback failed:", error);
    });
}

document.body.addEventListener('click', function () {
    if (!isPlaying) {
        playAudio();
    }
}, { once: true });

audioBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        audioBtn.innerHTML = `<svg viewBox="0 0 24 24">${iconMuted}</svg>`;
    } else {
        playAudio();
    }
});

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

document.getElementById('logo').addEventListener('click', (e) => {
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

// --- Hold to Send Love ---
let chargeInterval;
let chargeProgress = 0;
const chargeRing = document.getElementById('charge-ring');

function startCharging(e) {
    if (e.type === 'mousedown') e.preventDefault(); // prevent image drag
    chargeProgress = 0;
    chargeRing.style.background = `conic-gradient(#ff80ab 0%, transparent 0)`;
    chargeInterval = setInterval(() => {
        chargeProgress += 2;
        chargeRing.style.background = `conic-gradient(#ff80ab ${chargeProgress}%, transparent 0)`;
        if (chargeProgress >= 100) {
            clearInterval(chargeInterval);
            releaseLove();
        }
    }, 50); // 2.5s charge
}

function stopCharging() {
    clearInterval(chargeInterval);
    chargeProgress = 0;
    chargeRing.style.background = `conic-gradient(#ff80ab 0%, transparent 0)`;
}

function releaseLove() {
    const logoEl = document.getElementById("logo");
    logoEl.style.boxShadow = "0 0 80px #ff80ab";
    setTimeout(() => {
        if (logoEl.style.transform !== "rotate(3600deg) scale(1.2)") {
            logoEl.style.boxShadow = "0 0 35px rgba(129, 212, 250, 0.5)";
        }
    }, 1000);

    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const item = document.createElement("div");
            item.classList.add("falling-item");
            item.innerHTML = "💖";
            item.style.left = Math.random() * 100 + "vw";
            item.style.animationDuration = Math.random() * 2 + 1 + "s";
            item.style.fontSize = Math.random() * 30 + 20 + "px";
            item.style.zIndex = "100";
            item.style.filter = "drop-shadow(0 0 10px rgba(255, 128, 171, 0.8))";
            document.body.appendChild(item);
            setTimeout(() => { if (item.parentNode) item.remove(); }, 3000);
        }, i * 15);
    }
    stopCharging();
}

const logoElement = document.getElementById('logo');
logoElement.addEventListener('mousedown', startCharging);
logoElement.addEventListener('mouseup', stopCharging);
logoElement.addEventListener('mouseleave', stopCharging);
logoElement.addEventListener('touchstart', startCharging, { passive: true });
logoElement.addEventListener('touchend', stopCharging);
