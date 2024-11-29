// LookupService.js

import axios from 'axios';
import { FORM_SERVICE_LOAD_DATA } from '../config/ConfigUrl';
import { getToken } from '../config/Constant';

const LookupService = {
    
  // Fungsi untuk mengambil data lookup dari server
  fetchLookupData: async (lookupTable, headers,branchId) => {
    try {
      const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?t=${lookupTable}&branchId=${branchId}&page=1&size=500&showAll=YES`, {
        headers: {
          Authorization: `Bearer ${headers}` // Tambahkan token otorisasi di sini
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lookup data:', error);
      throw new Error('Failed to fetch lookup data');
    }
  }
};

export default LookupService;
