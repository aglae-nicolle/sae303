// Test point-dans-anneau (ray casting)
const inRing = (x, y, ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[i];
        const b = ring[j];
        if (
            a[1] > y !== b[1] > y &&
            x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
        ) {
            inside = !inside;
        }
    }
    return inside;
};

const polys = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);

const inFeature = (x, y, f) =>
    polys(f.geometry).some(
        (p) => inRing(x, y, p[0]) && !p.slice(1).some((hole) => inRing(x, y, hole))
    );

// Département le plus proche (fallback pour points en mer / sur la frontière)
const nearest = (x, y, features) => {
    let best = null;
    let bestDist = Infinity;
    for (const f of features) {
        for (const p of polys(f.geometry)) {
            for (const [px, py] of p[0]) {
                const d = (px - x) ** 2 + (py - y) ** 2;
                if (d < bestDist) {
                    bestDist = d;
                    best = f;
                }
            }
        }
    }
    return best;
};

/**
 * Regroupe les projets par département.
 * @returns {Map<string, {nom: string, items: string[]}>}
 */
export function groupByDepartment(metro, data) {
    const map = new Map(
        metro.features.map((f) => [
            f.properties.code,
            { nom: f.properties.nom, items: [] },
        ])
    );

    for (const d of data) {
        const feature =
            metro.features.find((f) => inFeature(d.Longitude, d.Latitude, f)) ??
            nearest(d.Longitude, d.Latitude, metro.features);

        map
            .get(feature.properties.code)
            .items.push(d.name.replace(/\s+/g, " ").trim());
    }
    return map;
}