/**
 * ==========================================================================
 * DEEP NOTES LIBRARY (Static Love Memo / Deep Note Library)
 * ==========================================================================
 * 
 * To add a new note, simply append another note object to DEEP_NOTES below:
 * {
 *     id: "note-002",
 *     title: "Your Note Title",
 *     category: "comfort", // or "romance", "reflection", etc.
 *     enabled: true,       // set to false to temporarily disable without deleting
 *     slides: [
 *         { text: "Your text here", duration: 3000 },
 *         { text: "Multi-line\ntext here", duration: 4000 },
 *         { type: "heart", duration: 5000 } // special heart particle slide
 *     ]
 * }
 */

const DEEP_NOTES = [
    {
        id: "note-001",
        title: "I'll Be Here",
        category: "comfort",
        enabled: true,
        slides: [
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
        ]
    }
];

// Ensure window/global scope accessibility for static & testing environments
if (typeof window !== 'undefined') {
    window.DEEP_NOTES = DEEP_NOTES;
} else if (typeof global !== 'undefined') {
    global.DEEP_NOTES = DEEP_NOTES;
}
