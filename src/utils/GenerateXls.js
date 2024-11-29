import * as XLSX from 'xlsx';

// Helper function to get the current date and time in a specific format
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

// Function to export data to Excel
export const exportToExcel = (data, filename) => {
    if (!data.length) {
        console.error("No data provided");
        return;
    }

    // Extract headers and accessors from the first item in data
    const firstItem = data[0];
    const headers = Object.keys(firstItem);
    const accessors = headers.map(header => header.toUpperCase());

    // Transform data based on accessors
    const transformedData = data.map(item =>
        accessors.map(accessor => item[accessor] !== undefined ? item[accessor] : '')
    );

    // Combine headers with data
    const dataWithHeader = [headers, ...transformedData];

    // Create a new worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeader);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Define the file name with current datetime if filename is not provided
    const fileName = filename || `Data-${getCurrentDateTime()}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, fileName);
};