// utils.js
export function DisplayFormat(amount) {
    if (amount === null || amount === undefined) {
        return '0';
    }
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 4 });
}
