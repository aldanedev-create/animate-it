export const easing = {
    linear: (t) => t,
    inQuad: (t) => t * t,
    outQuad: (t) => t * (2 - t),
    inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
    inCubic: (t) => t * t * t,
    outCubic: (t) => 1 - (1 - t) ** 3,
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
    inQuart: (t) => t * t * t * t,
    outQuart: (t) => 1 - (1 - t) ** 4,
    inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - (-2 * t + 2) ** 4 / 2),
    inQuint: (t) => t * t * t * t * t,
    outQuint: (t) => 1 - (1 - t) ** 5,
    inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - (-2 * t + 2) ** 5 / 2),
    inSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    outSine: (t) => Math.sin((t * Math.PI) / 2),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    inExpo: (t) => (t === 0 ? 0 : 2 ** (10 * t - 10)),
    outExpo: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
    inOutExpo: (t) => t === 0
        ? 0
        : t === 1
            ? 1
            : t < 0.5
                ? 2 ** (20 * t - 10) / 2
                : (2 - 2 ** (-20 * t + 10)) / 2,
    inCirc: (t) => 1 - Math.sqrt(1 - t * t),
    outCirc: (t) => Math.sqrt(1 - (t - 1) ** 2),
    inOutCirc: (t) => t < 0.5
        ? (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2
        : (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2,
    inBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    },
    outBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
    },
    inOutBack: (t) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2
            : ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    inElastic: (t) => {
        if (t === 0 || t === 1)
            return t;
        const c4 = (2 * Math.PI) / 3;
        return -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
    },
    outElastic: (t) => {
        if (t === 0 || t === 1)
            return t;
        const c4 = (2 * Math.PI) / 3;
        return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    inOutElastic: (t) => {
        if (t === 0 || t === 1)
            return t;
        const c5 = (2 * Math.PI) / 4.5;
        return t < 0.5
            ? -(2 ** (20 * t - 10)) * Math.sin((20 * t - 11.125) * c5) / 2
            : (2 ** (-20 * t + 10)) * Math.sin((20 * t - 11.125) * c5) / 2 + 1;
    },
    inBounce: (t) => 1 - easing.outBounce(1 - t),
    // FIX: Removed parameter mutation `t -= x` which causes evaluation order bugs
    // and strict linter failures. Extracted logic into cleanly scoped variables.
    outBounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        }
        else if (t < 2 / d1) {
            const t2 = t - 1.5 / d1;
            return n1 * t2 * t2 + 0.75;
        }
        else if (t < 2.5 / d1) {
            const t3 = t - 2.25 / d1;
            return n1 * t3 * t3 + 0.9375;
        }
        else {
            const t4 = t - 2.625 / d1;
            return n1 * t4 * t4 + 0.984375;
        }
    },
    inOutBounce: (t) => t < 0.5
        ? (1 - easing.outBounce(1 - 2 * t)) / 2
        : (1 + easing.outBounce(2 * t - 1)) / 2,
};
