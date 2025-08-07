export function FloorToMultiple(vec2: { x: number, y: number }, multipleX = 16, multipleY = 16) {
    return {
        x: Math.floor(vec2.x / multipleX) * multipleX,
        y: Math.floor(vec2.y / multipleY) * multipleY
    };
}