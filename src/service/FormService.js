// import React from "react";
// import axios from "axios";
// import { FORM_SERVICE_LOAD_DATA } from "../config/ConfigUrl";


// const FormService = {
//     fetchData: async (
//         formCode,
//         filterColumn,
//         filterOperation,
//         filterValue,
//         currentPage,
//         pageSize,
//         tableName,
//         branchId,
//         authToken,
//         showAll
//     ) => {
//         const headers = { Authorization: `Bearer ${authToken}` };
//         let urlParams;
//         if (tableName !== "") {
//             urlParams = `t=${tableName}`;
//         } else {
//             urlParams = `f=${formCode}`;
//         }
//         if (
//             filterColumn !== "" &&
//             filterOperation !== "" &&
//             filterValue !== ""
//         ) {
//             urlParams += `&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}`;
//         } else {
//             urlParams += `&page=${currentPage}&size=${pageSize}`;
//         }
//         if (showAll) {
//             urlParams += "&showAll=YES"
//         }
//         try {
//             const response = await axios.get(
//                 `${FORM_SERVICE_LOAD_DATA}?${urlParams}&branchId=${branchId}`,
//                 {
//                     headers,
//                 }
//             );
//             return response.data
//         } catch (error) {
//             throw error;
//         }
//     },
// };

// export default FormService;

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
        showAll,
        filters // Tambahkan parameter untuk multiple filters
    ) => {
        const headers = { Authorization: `Bearer ${authToken}` };
        let urlParams;

        // Gunakan `tableName` jika tersedia, jika tidak gunakan `formCode`
        if (tableName !== "") {
            urlParams = `t=${tableName}`;
        } else {
            urlParams = `f=${formCode}`;
        }

        // Multiple filters jika tersedia
        if (filters && filters.length > 0) {
            filters.forEach((filter) => {
                urlParams += `&filterBy=${filter.column}&filterValue=${filter.value}&operation=${filter.operation}`;
            });
        }
        // Fallback ke filter default (single filter) jika multiple filters tidak ada
        else if (filterColumn !== "" && filterOperation !== "" && filterValue !== "") {
            urlParams += `&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}`;
        }

        // Tambahkan pagination, branchId, dan showAll
        urlParams += `&page=${currentPage}&size=${pageSize}&branchId=${branchId}`;
        if (showAll) {
            urlParams += "&showAll=YES";
        }

        try {
            const response = await axios.get(
                `${FORM_SERVICE_LOAD_DATA}?${urlParams}`,
                { headers }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default FormService;

