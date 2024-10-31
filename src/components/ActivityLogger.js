import React from 'react';// Import service yang Anda gunakan
import InsertDataService from './InsertDataService';

const ActivityLogger = async ({
  userId,
  userName,
  action,
  description,
  entityName,
  entityId,
  status,
  authToken,
  branchId
}) => {
  try {
    const activity = {
      user_id: parseInt(userId), // Pastikan userId menjadi int
      user_name: userName,
      action: action,
      description: description,
      created_at: new Date().toISOString(),
      entity_name: entityName,
      Entity_id: entityId,
      status: status
    };

    const responseActivity = await InsertDataService.postData(activity, "ACTIVITY", authToken, branchId);
    console.log('Activity logged successfully:', responseActivity);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export default ActivityLogger;