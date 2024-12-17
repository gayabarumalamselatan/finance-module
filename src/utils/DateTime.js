const getDateTime = () => {
    // Mendapatkan tanggal dan waktu saat ini
    const currentTime = new Date();
    // Menyesuaikan dengan perbedaan waktu UTC+7 untuk zona waktu Jakarta
    const jakartaTime = new Date(currentTime.getTime() + (7 * 60 * 60 * 1000));
    // Format tanggal dan waktu menjadi string
    const formattedJakartaTime = jakartaTime.toISOString();
    
    return formattedJakartaTime;
};

export default getDateTime;


