// CheckHolidayService.js
import axios from 'axios';
import {  TREASURY_SERVICE_CHECK_HOLIDAY } from '../config/ConfigUrl'; // Make sure to define this in your config

const CheckHolidayService = {
  checkIfDateIsHoliday: async (date,authToken) => {
    try {
      const response = await axios.post(`${TREASURY_SERVICE_CHECK_HOLIDAY}`, { date }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json' // Set the content type as JSON
        }
      });

      console.log('holiday ',response.data.isHoliday);
      return response.data.isHoliday; // Assuming the response has an `isHoliday` field
    } catch (error) {
      console.error('Error checking holiday:', error);
      throw new Error('Failed to check holiday');
    }
  }
};

export default CheckHolidayService;
