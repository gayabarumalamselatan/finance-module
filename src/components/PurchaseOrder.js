import React, { Fragment, useEffect, useState } from "react";
import { getBranch, getToken, userLoggin } from "../config/Constant";
import LookupParamService from "../service/LookupParamService";
import axios from "axios";
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_FIELD, FORM_SERVICE_REPORT_DATA_EXCEL, MM_SERVICE_LIST_FILE_TRADE, MM_SERVICE_LIST_JOURNAL } from "../config/ConfigUrl";
import { HandleToUppercase } from "../utils/HandleToUpercase";
import FormService from "../service/FormService";
import PurchaseOrderTable from "../table/PurchaseOrderTable"
import AddPurchaseOrder from "../formComponents/AddPurchaseOrder";

const PurchaseOrder = () => {
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
    const [filterColumn, setfilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');

    const [isAddingNewPurchaseOrder, setIsAddingNewPurchaseOrder] = useState(false);
    const [isViewingPurchaseOrder, setIsViewingPurchaseOrder] = useState(false);
    const [isEditingPurchaseOrder, setIsEditingPurchaseOrder] = useState(false);
    const [selectedData, setSelectedData] = useState([]);


    const permissionsString = sessionStorage.getItem('permisions');

    // Parse the JSON string into a JavaScript object
    const permissions = JSON.parse(permissionsString);



    const handleAddNewPurchaseOrder = (value) => {
        setIsAddingNewPurchaseOrder(value);
    };

    const handleEditPurchaseOrder = (value) => {
        setIsEditingPurchaseOrder(value);
    };

    const handleViewPurchaseOrder = (value) => {
        setIsViewingPurchaseOrder(value);
    };

    const handleSelectData = (value) => {
        setSelectedData(value);
        console.log('selecteddata', selectedData);
    };

    const authToken = headers;
    const tokenAccess = { Authorization: `Bearer ${headers}` };
    const idForm = sessionStorage.getItem('idForm');

    const fetchFormCode = async () => {
        if (idForm) {
            try {
                const response = await axios.get(`${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}`, { headers: tokenAccess });

                if (response.data && response.data.coreFields) {
                    const codes = response.data.coreFields.map(field => field.formCode);
                    setFormCode(codes);
                    console.log('Get Form code', codes);
                } else {
                    console.error('Invalid response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching form fields:', error);
            }
        } else {
            console.error('idForm not found in sessionStorage');
        }
    };

    useEffect(() => {
        if (idForm) {
            fetchFormCode();
        }
    }, [idForm]);

    useEffect(() => {
        if (formCode.length > 0) {
            let     formMmtData = [];

            let filterColumnParam = filterColumn;
            let filterOperationParam = filterOperation;
            let filterValueParam = filterValue;

            // Check if URL parameter `status` is set
            const statusParam = new URLSearchParams(window.location.search).get('status');
            if (statusParam) {
                filterColumnParam = 'STATUS';
                filterOperationParam = 'EQUAL';
                filterValueParam = statusParam;
            }

            console.log("permissions", permissions.Purchase?.["List Purchase Order"].verify);
            const checker = permissions.Purchase?.["List Purchase Order"].verify;
            if (checker) {
                // Do not apply any filter if checker is true
                console.log("Checker is true, no filter will be applied.");
            } else if (userId) {
                // Apply filter if checker is false and userId is present
                filterColumnParam = 'CREATED_BY';
                filterOperationParam = 'EQUAL';
                filterValueParam = userId;
            }

            const fetchFormMmtData = FormService.fetchData(
                "",
                filterColumnParam,
                filterOperationParam,
                filterValueParam,
                currentPage,
                pageSize,
                `PURC_FORM${formCode[0]}`,
                branchId,
                authToken,
                true
            )
                .then((response) => {
                    console.log("Form Purchase Order lookup data:", response);
                    formMmtData = HandleToUppercase(response.data);
                    setTotalItems(response.totalAllData);
                })
                .catch((error) => {
                    console.error("Failed to fetch form Purchase Order lookup:", error);
                });

            fetchFormMmtData.then(() => {
                console.log('MMT DATA', formMmtData);
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
        console.log('filter Purchase Order list:', filterColumn, filterOperation, filterValue);
        setFilterOperation(filterOperation);
        setfilterColumn(filterColumn);
        setFilterValue(filterValue);
        setIsFilterSet(!isFilterSet);
        setIsLoadingTable(true);
    }

    const handleResetFilters = () => {
        setfilterColumn('');
        setFilterValue('');
        setFilterOperation('');
        setIsFilterSet(!isFilterSet);
        setIsLoadingTable(true);
    };



    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            {isEditingPurchaseOrder ?
                                <h1>Edit Purchase Order</h1>
                                :
                                <h1>Purchase Order</h1>
                            }
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a href="/">Home</a>
                                </li>
                                {isEditingPurchaseOrder ?
                                  <li className="breadcrumb-item active">
                                    Edit Purchase Order
                                 </li>
                                 :
                                 <li className="breadcrumb-item active">
                                    Purchase Order
                                </li>
                                }
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                {isAddingNewPurchaseOrder ? (                    
                    <AddPurchaseOrder
                        setIsAddingNewPurchaseOrder={setIsAddingNewPurchaseOrder}
                        isAddingNewPurchaseOrder={isAddingNewPurchaseOrder}
                        handleRefresh={handleRefresh}

                    />
                ) : isEditingPurchaseOrder ? (
                    <AddPurchaseOrder
                        setIsAddingNewPurchaseOrder={setIsEditingPurchaseOrder}
                        // setIsEditingPurchaseOrder={setIsEditingPurchaseOrder}
                        isEditingPurchaseOrder={isEditingPurchaseOrder}
                        handleRefresh={handleRefresh}
                        selectedData={selectedData}
                    />
                ) : (
                    <PurchaseOrderTable
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
                        addingNewPurchaseOrder={handleAddNewPurchaseOrder}
                        handleEditPurchaseOrder={handleEditPurchaseOrder}
                        selectedData={handleSelectData}
                        EditPurchaseOrder={handleEditPurchaseOrder}
                        checker={permissions.Purchase?.["List Purchase Order"].verify}
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

export default PurchaseOrder;