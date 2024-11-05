import React, { Fragment, useEffect, useState } from "react";
import { getBranch, getToken } from "../config/Constant";
import LookupParamService from "../service/LookupParamService";
import axios from "axios";
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_FIELD, FORM_SERVICE_REPORT_DATA_EXCEL, MM_SERVICE_LIST_FILE_TRADE, MM_SERVICE_LIST_JOURNAL } from "../config/ConfigUrl";
import { HandleToUppercase } from "../utils/HandleToUpercase";
import FormService from "../service/FormService";
import CoaTable from "../table/CoaTable";
import AddCoaModal from "../modal/AddCoaModal";


const Coa = () => {
    const headers = getToken();
    const branchId = getBranch();
    const [formCode, setFormCode] = useState([]);
    const [formData, setFormData] = useState([]);
    const [counterPartyName, setCounterPartyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterSet, setIsFilterSet] = useState(false); // State untuk mengontrol tab yang aktif

    // Inquiry table variable
    const [dataTable, setDataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4000);
    const [totalItems, setTotalItems] = useState(0);
    const [refreshTable, setRefreshTable] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [filterColumn, setfilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');

    const [isAddingNewBond, setIsAddingNewBond] = useState(false);
   

    const handleAddNewBond = (value) => {
        setIsAddingNewBond(value);
    };

    
    const authToken = headers;
    const tokenAccess = { Authorization: `Bearer ${headers}` };
    //console.log(tokenAccess);
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
            let formMmtData = [];
    
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
    
            const fetchFormMmtData = FormService.fetchData(
                "",
                filterColumnParam,
                filterOperationParam,
                filterValueParam,
                currentPage,
                pageSize,
                `MSDT_FORM${formCode[0]}`, // Assuming formCode[0] is the required code
                branchId,
                authToken,
                true
            )
            .then((response) => {
                console.log("Form COA lookup data:", response);
                formMmtData = HandleToUppercase(response.data);
                setTotalItems(response.totalAllData);
            })
            .catch((error) => {
                console.error("Failed to fetch form COA lookup:", error);
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
        setCurrentPage(1); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
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
        console.log('filter bond list:', filterColumn, filterOperation, filterValue);
        setFilterOperation(filterOperation);
        setfilterColumn(filterColumn);
        setFilterValue(filterValue);
        console.log('!!filter bond list:', !isFilterSet);
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
                            <h1>Chart Of Account</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a href="/">Home</a>
                                </li>
                                <li className="breadcrumb-item active">
                                    Chart Of Account
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                {isAddingNewBond ? (
                    <div>
                        

                        {/* <button onClick={() => handleAddNewBond(false)}>Cancel</button> */}
                    </div>
                ) : (
                    <CoaTable
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
                        addingNewBond={handleAddNewBond}
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

export default Coa;
