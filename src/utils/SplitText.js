// textUtils.js

function splitText(text, maxLength) {
    const words = text.split(' ');
    let result = '';
    let lineLength = 0;

    words.forEach(word => {
        if (lineLength + word.length <= maxLength) {
            result += word + ' ';
            lineLength += word.length + 1; // +1 for the space
        } else {
            result += '\n' + word + ' ';
            lineLength = word.length + 1;
        }
    });

    return result.trim(); // Trim any leading or trailing whitespace
}

module.exports = { splitText };
