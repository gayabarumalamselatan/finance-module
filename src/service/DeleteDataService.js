// InsertDataService.js
import axios from 'axios';
import { FORM_SERVICE_DELETE_DATA } from '../config/ConfigUrl';

const DeleteDataService = {
  // Fungsi untuk menyimpan data ke server
  postData: async (ParamDel,formCode, authToken,branchId) => {
    try {
      const response = await axios.delete(`${FORM_SERVICE_DELETE_DATA}?f=${formCode}&branchId=${branchId}&${ParamDel}`, {
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

export default DeleteDataService;
