const padBefore = (str, length, padding) =>
    `${new Array(length).fill(padding).join('')}${str}`
        .slice(-length);

export default padBefore;