import React from "react";
import axios from "axios";
import { FORM_SERVICE_LOAD_DATA } from "../config/ConfigUrl";


const FormService = {
    fetchData: async (
        formCode,
        filterColumn,
        filterOperation,
        filterValue,
        currentPage,
        pageSize,
        tableName,
        branchId,
        authToken,
        showAll
    ) => {
        const headers = { Authorization: `Bearer ${authToken}` };
        let urlParams;
        if (tableName !== "") {
            urlParams = `t=${tableName}`;
        } else {
            urlParams = `f=${formCode}`;
        }
        if (
            filterColumn !== "" &&
            filterOperation !== "" &&
            filterValue !== ""
        ) {
            urlParams += `&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}`;
        } else {
            urlParams += `&page=${currentPage}&size=${pageSize}`;
        }
        if (showAll) {
            urlParams += "&showAll=YES"
        }
        try {
            const response = await axios.get(
                `${FORM_SERVICE_LOAD_DATA}?${urlParams}&branchId=${branchId}`,
                {
                    headers,
                }
            );
            return response.data
        } catch (error) {
            throw error;
        }
    },
};

export default FormService;
