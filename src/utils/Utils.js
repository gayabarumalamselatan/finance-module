// utils.js

export const convertToFullNumber = (value) => {
    const multiplier = { 'K': 1e3, 'M': 1e6, 'B': 1e9, 'T': 1e12 };
    const regex = /^(\d+)([KMBT])$/i;
    const match = value.match(regex);
    if (match) {
        return parseInt(match[1], 10) * multiplier[match[2].toUpperCase()];
    }
    return parseInt(value, 10);
};

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
