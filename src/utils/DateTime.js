const getDateTime = () => {
    // Mengambil waktu saat ini dalam format ISO
    return new Date().toISOString();
};

const getDateTimeLocal = () => {
    const currentTime = new Date();

    const padZero = (num, length = 2) => String(num).padStart(length, '0');

    const month = padZero(currentTime.getMonth() + 1);
    const day = padZero(currentTime.getDate());
    const year = currentTime.getFullYear();
    const hours = padZero(currentTime.getHours()); // Tidak ada penyesuaian zona waktu
    const minutes = padZero(currentTime.getMinutes());
    const seconds = padZero(currentTime.getSeconds());
    const milliseconds = padZero(currentTime.getMilliseconds(), 3);

    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    console.log(formattedDateTime);

    return formattedDateTime;
};

// Menggunakan named exports
export { getDateTime, getDateTimeLocal };
