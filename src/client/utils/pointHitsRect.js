const pointHitsRect = (x, y, rect) =>
    x >= rect.x
        && x <= rect.x + rect.width
        && y >= rect.y
        && y <= rect.y + rect.height;

export default pointHitsRect;