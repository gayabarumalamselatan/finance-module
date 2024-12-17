import axios from 'axios';

export const generateUniqueSequence = async (url, token) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}` // Add authorization token here
            }
        });
        const sequenceFromApi = response.data;
        console.log('SEQ', sequenceFromApi); // Assuming the response is a plain text containing the number

        return sequenceFromApi.trim(); // Trim any whitespace characters
    } catch (error) {
        console.error('Error fetching unique sequence:', error);
        throw error;
    }
};

export const generateUniqueId = async (url, token) => {
    try {
        const uniqueSequence = await generateUniqueSequence(url, token);
        // You can customize the unique ID generation logic here if needed
        return `${uniqueSequence}`; // Example: prepend "TRADE-" to the sequence
    } catch (error) {
        console.error('Error generating unique ID:', error);
        throw error;
    }
};