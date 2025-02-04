import axios from 'axios';
import { REPORT_SERVICE_DOWNLOAD_REPORT } from '../config/ConfigUrl';
import Swal from 'sweetalert2';
import { messageAlertSwal } from '../config/Swal';
import  { getDateTimeLocal } from '../utils/DateTime';

export const handleExportReport = async (exportType, reportName, params, authToken) => {
    try {
        // Menyusun query string dari parameter
        const queryString = new URLSearchParams({ ...params, format: exportType }).toString();
        const urlRequest = `${REPORT_SERVICE_DOWNLOAD_REPORT}?${queryString}&reportName=${reportName}`;

        // Menentukan headers dengan token otorisasi
        const headers = {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        };

        // Mengirim permintaan ke server dengan headers dan responseType 'blob'
        const response = await axios.get(urlRequest, { headers, responseType: 'blob' });

        // Menentukan tipe file berdasarkan format ekspor
        const mimeType =
            exportType === 'PDF'
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        // Membuat objek URL dari data blob
        const blob = new Blob([response.data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        // Membuat elemen link untuk mengunduh file
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download', 
            `${reportName}-${getDateTimeLocal().replace(/[:. ]/g, '_')}.${exportType.toLowerCase()}`
          );
        // Menjalankan unduhan
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Membersihkan URL setelah unduhan selesai
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error fetching or saving file:', error);
        messageAlertSwal('Error!', 'Error Fetching Data', 'error');
    }
};
