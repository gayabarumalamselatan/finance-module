import axios from "axios";
import {
  AUTH_SERVICE_LIST_USER,
  AUTH_SERVICE_LIST_USER_DETAIL,
} from "../config/ConfigUrl";

const UserService = {
  fetchUserData: async (idUser, headers) => {
    try {
      const response = await axios.get(
        `${AUTH_SERVICE_LIST_USER_DETAIL}?id=${idUser}`,
        {
          headers: {
            Authorization: `Bearer ${headers}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lookup data:", error);
      throw new Error("Failed to fetch lookup data");
    }
  },
  fetchAllUser: async (headers) => {
    try {
      const response = await axios.get(`${AUTH_SERVICE_LIST_USER}?size=500`, {
        headers: {
          Authorization: `Bearer ${headers}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching lookup data:", error);
      throw new Error("Failed to fetch lookup data");
    }
  },
};

export default UserService;
