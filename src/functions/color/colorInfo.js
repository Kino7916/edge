const { NativeFunction, ArgType } = require("@tryforge/forgescript");
const colors = require("../../colors.json");

exports.default = new NativeFunction({
    name: "$colorInfo",
    version: "1.0.0",
    description: "Returns detailed color information for the specified hex color",
    output: ArgType.Json,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "color",
            description: "Hex color for information",
            type: ArgType.Color,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [color]) {
        let hex;
        if (typeof color === "number") {
            hex = color.toString(16).padStart(6, "0");
        } else {
            hex = color.toString().replace(/^#/, "");
        }
        if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
            return this.success("{}");
        }
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const decimal = parseInt(hex, 16);

        const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        const delta = max - min;
        let h = 0, s = 0, l = (max + min) / 2;

        if (delta !== 0) {
            s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            if (max === rNorm) h = ((gNorm - bNorm) / delta) + (gNorm < bNorm ? 6 : 0);
            else if (max === gNorm) h = ((bNorm - rNorm) / delta) + 2;
            else h = ((rNorm - gNorm) / delta) + 4;
            h *= 60;
        }

        const v = max;
        const saturation = max === 0 ? 0 : delta / max;
        const k = 1 - max;
        const c = k === 1 ? 0 : safeDiv(1 - rNorm - k, 1 - k);
        const m = k === 1 ? 0 : safeDiv(1 - gNorm - k, 1 - k);
        const y = k === 1 ? 0 : safeDiv(1 - bNorm - k, 1 - k);
        const luminance = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
        const isDark = luminance < 0.5;

        function findClosestColorName(targetDecimal) {
            const targetR = (targetDecimal >> 16) & 0xFF;
            const targetG = (targetDecimal >> 8) & 0xFF;
            const targetB = targetDecimal & 0xFF;
            let closestName = "custom";
            let minDistance = Infinity;
            for (const [name, hexString] of Object.entries(colors)) {
                const hex = hexString.slice(2)
                const value = parseInt(hex, 16);
                if (value === targetDecimal) return name;
                const r = (value >> 16) & 0xFF;
                const g = (value >> 8) & 0xFF;
                const b = value & 0xFF;
                const distance =
                    0.3 * Math.pow(targetR - r, 2) +
                    0.59 * Math.pow(targetG - g, 2) +
                    0.11 * Math.pow(targetB - b, 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestName = name;
                }
            }
            const colorfulness = Math.sqrt(
                Math.pow(targetR - 128, 2) +
                Math.pow(targetG - 128, 2) +
                Math.pow(targetB - 128, 2)
            ) / 221;
            const threshold = 45 + (colorfulness * 25);
            return Math.sqrt(minDistance) < threshold ? closestName : "custom";
        }
        const name = findClosestColorName(decimal);

        const shades = [20, 40, 60, 80].map(percent => {
            const factor = 1 - (percent / 100);
            return toHex(Math.round(r * factor), Math.round(g * factor), Math.round(b * factor));
        });
        const tints = [20, 40, 60, 80].map(percent => {
            const factor = percent / 100;
            return toHex(
                Math.round(r + (255 - r) * factor),
                Math.round(g + (255 - g) * factor),
                Math.round(b + (255 - b) * factor)
            );
        });

        const getHarmony = angles => angles.map(angle => {
            const newH = (h + angle + 360) % 360;
            const [nr, ng, nb] = hslToRgb(newH, s * 100, l * 100);
            return toHex(nr, ng, nb);
        });

        const complementary = getHarmony([180])[0];
        const analogous = getHarmony([30, -30]);
        const triadic = getHarmony([120, 240]);
        const tetradic = getHarmony([60, 180, 240]);
        const monochromatic = Array.from({ length: 5 }, (_, i) => {
            const newL = Math.max(0, Math.min(1, l - 0.3 + (i * 0.15)));
            const [nr, ng, nb] = hslToRgb(h, s * 100, newL * 100);
            return toHex(nr, ng, nb);
        });

        const calculateTemperature = () => {
            let temperature;
            if (bNorm > gNorm && bNorm > rNorm) {
                temperature = 6500 + (((0.254 * rNorm) + (0.297 * gNorm) - 0.551 * bNorm) / 0.00096);
            } else {
                temperature = 6500 - (((0.199 * rNorm) - (0.931 * gNorm) + (0.732 * bNorm)) / 0.0025);
            }
            return Math.round(Math.max(1000, Math.min(40000, temperature)));
        };

        return this.successJSON({
            hex: `#${hex}`,
            rgb: [r, g, b],
            hsl: [
                Math.round(h),
                Math.round(s * 100),
                Math.round(l * 100)
            ],
            hsv: [
                Math.round(h),
                Math.round(saturation * 100),
                Math.round(v * 100)
            ],
            cmyk: [
                Math.round(c * 100),
                Math.round(m * 100),
                Math.round(y * 100),
                Math.round(k * 100)
            ],
            decimal: decimal,
            name: name,
            components: {
                red: r,
                green: g,
                blue: b,
                hue: Math.round(h),
                saturation: Math.round(s * 100),
                lightness: Math.round(l * 100),
                value: Math.round(v * 100)
            },
            luminance: parseFloat(luminance.toFixed(3)),
            isDark: isDark,
            isLight: !isDark,
            temperature: calculateTemperature(),
            shades,
            tints,
            complementary,
            analogous,
            triadic,
            tetradic,
            monochromatic
        });
    }
});

function toHex(r, g, b) {
    return ("#" + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join(""));
}

function safeDiv(a, b) {
    return b === 0 ? 0 : a / b;
}

function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = s > 100 ? 1 : s < 0 ? 0 : s / 100;
    l = l > 100 ? 1 : l < 0 ? 0 : l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const m = l - c / 2;
    const h60 = h / 60;
    const x = c * (1 - Math.abs(h60 % 2 - 1));
    let r = 0, g = 0, b = 0;
    switch (Math.floor(h60)) {
        case 0: r = c; g = x; break;
        case 1: r = x; g = c; break;
        case 2: g = c; b = x; break;
        case 3: g = x; b = c; break;
        case 4: r = x; b = c; break;
        case 5: r = c; b = x; break;
    }
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}