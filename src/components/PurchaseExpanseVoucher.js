import React, { Fragment, useEffect, useState } from "react";
import { getBranch, getToken, userLoggin } from "../config/Constant";
import LookupParamService from "../service/LookupParamService";
import axios from "axios";
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_FIELD, FORM_SERVICE_REPORT_DATA_EXCEL, MM_SERVICE_LIST_FILE_TRADE, MM_SERVICE_LIST_JOURNAL } from "../config/ConfigUrl";
import { HandleToUppercase } from "../utils/HandleToUpercase";
import FormService from "../service/FormService";
import EditPurchaseExpanseVoucher from "../formComponents/EditPurchaseExpanseVoucher";
import AddPurchaseExpanseVoucher from "../formComponents/AddPurchaseExpanseVoucher";
import PurchaseExpanseTable from "../table/PurchaseExpanseTable";

const PurchaseExpanseVoucher = () => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = userLoggin();
  const [formCode, setFormCode] = useState([]);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterSet, setIsFilterSet] = useState(false);

  // Inquiry table variable
  const [dataTable, setDataTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshTable, setRefreshTable] = useState(true);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [filterColumn, setfilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterOperation, setFilterOperation] = useState("");

  const [isAddingNewPurchaseExpanse, setIsAddingNewPurchaseExpanse] = useState(false);
  const [isViewingPurchaseExpanse, setIsViewingPurchaseExpanse] = useState(false);
  const [isEditingPurchaseExpanse, setIsEditingPurchaseExpanse] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const permissionsString = sessionStorage.getItem("permisions");

  // Parse the JSON string into a JavaScript object
  const permissions = JSON.parse(permissionsString);

  const handleEditPurchaseExpanse = (value) => {
    setIsEditingPurchaseExpanse(value);
  };
  const handleViewPurchaseExpanse = (value) => {
    setIsViewingPurchaseExpanse(value);
  };
  const handleAddNewPurchaseExpanse = (value) => {
    setIsAddingNewPurchaseExpanse(value);
  };
  const handleSelectData = (value) => {
    setSelectedData(value);
    console.log("Log", value);
  };

  const authToken = headers;
  const tokenAccess = { Authorization: `Bearer ${headers}` };
  const idForm = sessionStorage.getItem("idForm");

  const fetchFormCode = async () => {
    if (idForm) {
      try {
        const response = await axios.get(`${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}`, { headers: tokenAccess });

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
    if (idForm) {
      fetchFormCode();
    }
  }, [idForm]);

  useEffect(() => {
    if (formCode.length > 0) {
      let formMmtData = [];

      let filterColumnParam = filterColumn;
      let filterOperationParam = filterOperation;
      let filterValueParam = filterValue;

      // Check if URL parameter `status` is set
      const statusParam = new URLSearchParams(window.location.search).get("status");
      if (statusParam) {
        filterColumnParam = "STATUS";
        filterOperationParam = "EQUAL";
        filterValueParam = statusParam;
      }

      console.log("permissions", permissions.Purchase?.["Purchase Invoice"].verify);
      const checker = permissions.Purchase?.["Purchase Invoice"].verify;
      if (checker) {
        // Do not apply any filter if checker is true
        console.log("Checker is true, no filter will be applied.");
      } else if (userId) {
        // Apply filter if checker is false and userId is present
        filterColumnParam = "CREATED_BY";
        filterOperationParam = "EQUAL";
        filterValueParam = userId;
      }

      const fetchFormMmtData = FormService.fetchData("", filterColumnParam, filterOperationParam, filterValueParam, currentPage, pageSize, `VOUC_FORM${formCode[0]}`, branchId, authToken, true)
        .then((response) => {
          console.log("Form Purchase Request lookup data:", response);
          formMmtData = HandleToUppercase(response.data);
          setTotalItems(response.totalAllData);
        })
        .catch((error) => {
          console.error("Failed to fetch form Purchase Request lookup:", error);
        });

      fetchFormMmtData.then(() => {
        console.log("MMT DATA", formMmtData);
        setDataTable(formMmtData);
        setIsLoadingTable(false);
      });
    }
  }, [formCode, pageSize, currentPage, refreshTable, isFilterSet]);

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

  const handleFilterSearch = ({ filterColumn, filterOperation, filterValue }) => {
    console.log("filter Purchase Invoice list:", filterColumn, filterOperation, filterValue);
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
    setIsFilterSet(!isFilterSet);
    setIsLoadingTable(true);
  };

  return (
    <Fragment>
      {!isEditingPurchaseExpanse && (
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Purchase Expanse Voucher by Bank</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Purchas Expanse Voucher by Bank</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="content">
        {isAddingNewPurchaseExpanse ? (
          <div>
            <AddPurchaseExpanseVoucher setIsAddingNewPurchaseExpanse={setIsAddingNewPurchaseExpanse} handleRefresh={handleRefresh} />
          </div>
        ) : isEditingPurchaseExpanse ? (
          <AddPurchaseExpanseVoucher setIsEditingPurchaseExpanse={setIsEditingPurchaseExpanse} handleRefresh={handleRefresh} selectedData={selectedData} />
        ) : (
          <PurchaseExpanseTable
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
            handleEditPurchaseExpanse={handleEditPurchaseExpanse}
            isAddingNewPurchaseExpanse={handleAddNewPurchaseExpanse}
            isEditPurchaseExpanseVoucher={handleEditPurchaseExpanse}
            EditPurchaseExpanseVoucher={handleEditPurchaseExpanse}
            selectedData={handleSelectData}
            checker={permissions.Purchase?.["Purchase Invoice"].verify}
          />
        )}

        {isLoading && (
          <div className="full-screen-overlay">
            <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
          </div>
        )}
      </section>
    </Fragment>
  );
};

export default PurchaseExpanseVoucher;
