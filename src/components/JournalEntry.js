import React, { Fragment, useEffect, useState } from "react";
import { getBranch, getToken, userLoggin } from "../config/Constant";
import LookupParamService from "../service/LookupParamService";
import axios from "axios";
import { FORM_SERVICE_LOAD_FIELD } from "../config/ConfigUrl";
import { HandleToUppercase } from "../utils/HandleToUpercase";
import FormService from "../service/FormService";
import JournalEntryTable from "../table/JournalEntryTable";
import AddJournalEntry from "../formComponents/AddJournalEntry";

const JournalEntry = () => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = userLoggin();
  const [formCode, setFormCode] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [refreshTable, setRefreshTable] = useState(true);
  const [formData, setFormData] = useState([]);

  const [filterColumn, setfilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterOperation, setFilterOperation] = useState("");
  const [isFilterSet, setIsFilterSet] = useState(false);

  const [isAddingNewJournalEntry, setIsAddingNewJournalEntry] = useState(false);
  const [isEditingJournalEntry, setIsEditingJournalEntry] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const [permissions, setPermissions] = useState(() => {
    const permissionsString = sessionStorage.getItem("permisions");
    return JSON.parse(permissionsString);
  });

  const authToken = headers;
  const idForm = sessionStorage.getItem("idForm");

  const handleEditJournalEntry = (value) => {
    setIsEditingJournalEntry(value);
  };
  const handleViewJournalEntry = (value) => {
    setIsViewingJournalEntry(value);
  };
  const handleAddNewJournalEntry = (value) => {
    setIsAddingNewJournalEntry(value);
  };
  const handleSelectData = (value) => {
    setSelectedData(value);
    console.log("Log", value);
  };

  const fetchFormCode = async () => {
    if (idForm) {
      try {
        const response = await axios.get(
          `${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}`,
          { headers: { Authorization: `Bearer ${headers}` } }
        );
        if (response.data && response.data.coreFields) {
          const codes = response.data.coreFields.map((field) => field.formCode);
          setFormCode(codes);
          console.log("Get Form code", codes);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching form fields:", error);
      }
    } else {
      console.error("idForm not found in sessionStorage");
    }
  };

  useEffect(() => {
    fetchFormCode();
  }, [idForm]);

  useEffect(() => {
    const fetchJournalData = async () => {
      if (formCode.length > 0) {
        setIsLoadingTable(true);

        let filterColumnParam = filterColumn;
        let filterOperationParam = filterOperation;
        let filterValueParam = filterValue;

        // Check if URL parameter `status` is set
        const statusParam = new URLSearchParams(window.location.search).get(
          "status"
        );
        if (statusParam) {
          filterColumnParam = "STATUS";
          filterOperationParam = "EQUAL";
          filterValueParam = statusParam;
        } else if (!permissions.Journal?.["Journal Entry"].verify && userId) {
          // Apply filter if checker is false and userId is present
          filterColumnParam = "CREATED_BY";
          filterOperationParam = "EQUAL";
          filterValueParam = userId;
        }

        try {
          // Fetch journal data
          const journalResponse = await FormService.fetchData(
            "",
            filterColumnParam,
            filterOperationParam,
            filterValueParam,
            currentPage,
            pageSize,
            `JOUR_FORM${formCode[0]}`,
            branchId,
            authToken,
            true
          );

          console.log("Form Journal lookup data:", journalResponse);
          const journalData = HandleToUppercase(journalResponse.data);
          setTotalItems(journalResponse.totalAllData);
          setDataTable(journalData);

          // Fetch vendor lookup data
          const vendorResponse = await LookupParamService.fetchLookupData(
            "MSDT_FORMCUST",
            authToken,
            branchId
          );
          console.log("Vendor lookup data:", vendorResponse);
          const vendorData = vendorResponse.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );

          // Create a mapping from vendor ID to vendor name
          const vendorMap = vendorData.reduce((acc, item) => {
            acc[item.ID] = item.NAME; // Map vendor_id (ID) to vendor_name (NAME)
            return acc;
          }, {});

          // Fetch currency lookup data
          const currencyResponse = await LookupParamService.fetchLookupData(
            "MSDT_FORMCCY",
            authToken,
            branchId
          );
          console.log("Vendor lookup data:", vendorResponse);
          const currencyData = currencyResponse.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );

          // Create a mapping from currency ID to currency code
          const currencyMap = currencyData.reduce((acc, item) => {
            acc[item.ID] = item.CODE; // Map vendor_id (ID) to vendor_name (NAME)
            return acc;
          }, {});

          // Fetch department lookup data
          const departmentResponse = await LookupParamService.fetchLookupData(
            "MSDT_FORMDPRT",
            authToken,
            branchId
          );
          console.log("department lookup data:", departmentResponse);
          const departmentData = departmentResponse.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );

          // Create a mapping from department ID to department name
          const departmentMap = departmentData.reduce((acc, item) => {
            acc[item.ID] = item.NAME; // Map vendor_id (ID) to vendor_name (NAME)
            return acc;
          }, {});

          // Replace id with name in the journal data
          const updatedData = journalData.map((entry) => ({
            ...entry,
            VENDOR_NAME: vendorMap[entry.VENDOR_ID] || "Unknown", // Add vendor_name
            CURRENCY_CODE: currencyMap[entry.CURRENCY_ID] || "Unknown", // Add currency_name
            DEPARTMENT_NAME: departmentMap[entry.DEPARTMENT_ID] || "Unknown", // Add currency_name
          }));

          console.log("Updated data with vendor names:", updatedData);
          setDataTable(updatedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoadingTable(false);
        }
      }
    };

    fetchJournalData();
  }, [
    formCode,
    pageSize,
    currentPage,
    permissions,
    refreshTable,
    userId,
    filterColumn,
    filterOperation,
    filterValue,
  ]);

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    setRefreshTable(!refreshTable);
    setIsLoadingTable(true);
    setFormData([]);
  };

  const handleFilterSearch = ({
    filterColumn,
    filterOperation,
    filterValue,
  }) => {
    console.log(
      "filter Journal Entry list:",
      filterColumn,
      filterOperation,
      filterValue
    );
    setFilterOperation(filterOperation);
    setfilterColumn(filterColumn);
    setFilterValue(filterValue);
    setIsFilterSet(!isFilterSet);
    setIsLoadingTable(true);
  };

  const handleResetFilters = () => {
    setfilterColumn("");
    setFilterValue("");
    setFilterOperation("");
  };

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Journal Entry</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Journal Entry</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        {isAddingNewJournalEntry ? (
          <div>
            <AddJournalEntry
              setIsAddingNewJournalEntry={setIsAddingNewJournalEntry}
              handleRefresh={handleRefresh}
            />
          </div>
        ) : isEditingJournalEntry ? (
          <AddJournalEntry
            setIsEditingJournalEntry={setIsEditingJournalEntry}
            handleRefresh={handleRefresh}
            selectedData={selectedData}
          />
        ) : (
          <JournalEntryTable
            formCode={formCode}
            dataTable={dataTable}
            totalItems={totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            handlePageSizeChange={handlePageSizeChange}
            handlePageChange={handlePageChange}
            handleRefresh={handleRefresh}
            isLoadingTable={isLoadingTable}
            handleFilterSearch={handleFilterSearch}
            handleResetFilter={handleResetFilters}
            branchId={branchId}
            authToken={authToken}
            handleSelectData={handleSelectData}
            handleEditJournalEntry={handleEditJournalEntry}
            isAddingNewJournalEntry={handleAddNewJournalEntry}
            EditJournalEntry={handleEditJournalEntry}
            selectedData={handleSelectData}
            checker={permissions.Journal?.["Journal"].verify}
          />
        )}
        {isLoadingTable && (
          <div className="full-screen-overlay">
            <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
          </div>
        )}
      </section>
    </Fragment>
  );
};

export default JournalEntry;
