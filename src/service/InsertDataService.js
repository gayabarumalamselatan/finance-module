// InsertDataService.js
import axios from 'axios';
import { FORM_SERVICE_INSERT_DATA } from '../config/ConfigUrl';

const InsertDataService = {
  // Fungsi untuk menyimpan data ke server
  postData: async (data,formCode, authToken,branchId) => {
    try {
      const response = await axios.post(`${FORM_SERVICE_INSERT_DATA}?f=${formCode}&branchId=${branchId}`, data , {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json' // Tentukan jenis konten sebagai JSON
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw new Error('Failed to post data');
    }
  }
};

export default InsertDataService;
