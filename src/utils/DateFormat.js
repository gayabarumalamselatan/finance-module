import moment from 'moment';

// Fungsi untuk memformat tanggal
export const dateFormat = (date) => {
  // Pastikan input berupa tanggal dan format ke DD-MM-YYYY
  return moment(date).format('DD-MM-YYYY');
};
