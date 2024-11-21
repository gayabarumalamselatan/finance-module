import React, { useState, useEffect } from "react";
import FormPagination from "../utils/FormPagination";
import { NumericFormat } from "react-number-format";
import { FaAddressBook, FaEye, FaFilter, FaSyncAlt } from "react-icons/fa";
import { FaEdit, FaTrash, FaFileExport } from "react-icons/fa"; // Import icons for Edit, Delete, and Export
import { Button, Modal, Table } from "react-bootstrap";
import { getBranch, getToken, userLoggin } from "../config/Constant";
import LookupService from "../service/LookupService";
import { DisplayFormat } from "../utils/DisplayFormat";
import Swal from "sweetalert2";
import DeleteDataService from "../service/DeleteDataService";

const PurchaseOrderTable = ({
    formCode,
    dataTable,
    handleSelect,
    pageSize,
    handlePageSizeChange,
    handleRefresh,
    totalItems,
    currentPage,
    handlePageChange,
    isLoadingTable,
    handleFilterSearch,
    handleResetFilter,
    addingNewPurchaseOrder,
    EditPurchaseOrder,
    selectedData,
    checker
}) => {
    const headers = getToken();
    const branchId = getBranch();
    const userId = userLoggin();
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');
    const [showAdditionalContent, setShowAdditionalContent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedRowDataItem, setSelectedRowDataItem] = useState([]); // For storing selected row data

    const authToken = headers;

    useEffect(() => {
        setSelectedRows(new Set());
    }, [dataTable]);

    // Handle checkbox click separately
    const handleCheckboxSelect = (e, itemId) => {
        e.stopPropagation(); // Prevent triggering row click when checkbox is clicked
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(itemId)) {
            newSelectedRows.delete(itemId);
        } else {
            newSelectedRows.add(itemId);
        }
        setSelectedRows(newSelectedRows);
    };

    // Handle row click for modal view
    const handleRowSelect = (itemId) => {
        const rowData = dataTable.find(item => item.ID === itemId); // Find the selected row data
        setSelectedRowData(rowData); // Set the row data

        const PO_NUMBER = rowData.PO_NUMBER;
        console.log('Fetching data for PO_NUMBER:', PO_NUMBER);

        LookupService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
            .then(response => {
                const fetchedItems = response.data || [];
                console.log('Items fetched from API:', fetchedItems);

                // Set fetched items to state
                setSelectedRowDataItem(fetchedItems);
            })
            .catch(error => {
                console.error('Failed to fetch product lookup:', error);
            });

        setIsModalOpen(true); // Open the modal
    };

    useEffect(() => {
        console.log('selectedRowDataItem:', selectedRowDataItem);
    }, [selectedRowDataItem]);

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(new Set(dataTable.map(item => item.ID)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleAddNewPurchaseOrder = () => {
        addingNewPurchaseOrder(true);
    };

    const handleEditPurchaseOrder = (value) => {
        const dataSelected = getSelectedRowsData();
        console.log('dataSelected Edit:', dataSelected);

        if (dataSelected.length > 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Multiple Rows Selected',
                text: 'Please select only one row to edit.',
                confirmButtonText: 'OK',
            });
            return; // Exit the function if multiple rows are selected
        }

        // Get the current user's userId
        const userId = sessionStorage.getItem('userId');

        // Check if status_request is 'IN_PROCESS' and userId matches created_by
        if (!checker && dataSelected[0].STATUS_PO === 'IN_PROCESS' && userId === dataSelected[0].CREATED_BY) {
            Swal.fire({
                icon: 'warning',
                title: 'Edit Restricted',
                text: 'You cannot edit this request while it is "IN_PROCESS".',
                confirmButtonText: 'OK',
            });
            return; // Exit the function if the condition is met
        }

        EditPurchaseOrder(true); // Open the edit form or process
        selectedData(dataSelected); // Pass the selected data for further processing
    };


    // const handleDelete = (value) => {
    //     const dataSelected = getSelectedRowsData();
    //     console.log('dataSelected Delete:', dataSelected);

    //     if (dataSelected.length > 1) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Multiple Rows Selected',
    //             text: 'Please select only one row to Delete.',
    //             confirmButtonText: 'OK',
    //         });
    //         return; // Exit the function if multiple rows are selected
    //     }

    //     // Get the current user's userId
    //     const userId = sessionStorage.getItem('userId');

    //     // Check if status_request is 'IN_PROCESS' and userId matches created_by
    //     if (!checker && dataSelected[0].STATUS_REQUEST === 'IN_PROCESS' && userId === dataSelected[0].REQUESTOR) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Delete Restricted',
    //             text: 'You cannot delete this request while it is "IN_PROCESS".',
    //             confirmButtonText: 'OK',
    //         });
    //         return; // Exit the function if the condition is met
    //     }
    //     console.log('dataSelected Delete:', dataSelected)  // Pass the selected data for further processing
    // };

    const handleDelete = async (value) => {
        const dataSelected = getSelectedRowsData(); // Ambil data yang dipilih
        console.log('dataSelected Delete:', dataSelected);

        // Cek jika lebih dari satu baris dipilih
        if (dataSelected.length !== 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Multiple Rows Selected',
                text: 'Please select exactly one row to delete.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const userId = sessionStorage.getItem('userId');

        // Cek apakah status IN_PROCESS dan userId cocok dengan REQUESTOR
        if (!checker && dataSelected[0].STATUS_REQUEST === 'IN_PROCESS' && userId === dataSelected[0].REQUESTOR) {
            Swal.fire({
                icon: 'warning',
                title: 'Delete Restricted',
                text: 'You cannot delete this request while it is "IN_PROCESS".',
                confirmButtonText: 'OK',
            });
            return;
        }

        const puorId = dataSelected[0].ID; // ID dari data utama
        const poNumber = dataSelected[0].PO_NUMBER;

        // Konfirmasi sebelum penghapusan
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this request and its details? This process cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Panggil API untuk menghapus data master (utama)
                    const response = await DeleteDataService.postData(`column=id&value=${puorId}`, "PUOR", authToken, branchId);

                    if (!response.message === 'Delete Data Successfully') {
                        throw new Error('Failed to delete main request');
                    }

                    // Jika berhasil hapus master, lanjutkan ke detail berdasarkan PR_NUMBER
                    const responseDetail = await LookupService.fetchLookupData(
                        `PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${poNumber}&operation=EQUAL`,
                        authToken,
                        branchId
                    );

                    const fetchedItems = responseDetail.data || [];
                    console.log('Items fetch:', fetchedItems);

                    if (fetchedItems.length > 0) {
                        // Hapus setiap detail yang ditemukan
                        for (const item of fetchedItems) {
                            if (item.ID) {
                                try {
                                    const itemResponseDelete = await DeleteDataService.postData(`column=id&value=${item.ID}`, "PUORD", authToken, branchId);
                                    console.log('Item deleted successfully:', itemResponseDelete);
                                } catch (error) {
                                    console.error('Error deleting item:', item, error);
                                    throw new Error('Failed to delete one or more detail items');
                                }
                            } else {
                                console.log('No ID found for this item, skipping delete:', item);
                            }
                        }
                    } else {
                        throw new Error('No details found for this PR_NUMBER');
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Request and Details Deleted',
                        text: 'Both the request and its details have been successfully deleted.',
                        confirmButtonText: 'OK',
                    });

                    handleRefresh();

                    // Lakukan refresh data atau aksi lain yang diperlukan setelah penghapusan berhasil

                } catch (error) {
                    console.error('Error during delete process:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Error',
                        text: 'Failed to delete the request or its details. Please try again later.',
                        confirmButtonText: 'OK',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Cancelled',
                    text: 'Your request deletion has been cancelled.',
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    const dateFormat = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth()+1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleResetFilters = () => {
        setFilterColumn('');
        setFilterValue('');
        setFilterOperation('');
        handleResetFilter();
    };

    const handleApplyFilters = () => {
        handleFilterSearch({ filterColumn, filterOperation, filterValue });
    };

    const handleLoadDataClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowAdditionalContent(true);
        }, 1000);
    };

    const getSelectedRowsData = () => {
        return dataTable.filter(item => selectedRows.has(item.ID));
    };



    const handleView = () => {
        // Add logic for viewing selected rows
        const selectedData = getSelectedRowsData();
        if (selectedData.length > 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Multiple Rows Selected',
                text: 'Please select only one row to view details.',
                confirmButtonText: 'OK',
            });
            return; // Exit the function if multiple rows are selected
        }

        setSelectedRowData(selectedData[0]);

        console.log("View selected rows data:", selectedData);
        const PO_NUMBER = selectedData[0].PO_NUMBER;
        console.log('Fetching data for PR_NUMBER:', PO_NUMBER);

        LookupService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
            .then(response => {
                const fetchedItems = response.data || [];
                console.log('Items fetched from API:', fetchedItems);

                // Set fetched items to state
                setSelectedRowDataItem(fetchedItems);
            })
            .catch(error => {
                console.error('Failed to fetch product lookup:', error);
            });

        setIsModalOpen(true); // Open the modal
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const handleExport = () => {
        // Add logic for exporting selected rows
        console.log("Export selected rows:", Array.from(selectedRows));
    };

    const tableHeaders = [
        { value: "PO_NUMBER", label: "PO Number" },
        { value: "CREATED_BY", label: "Created By" },
        { value: "ORDER_DATE", label: "Order Date" },
        { value: "REQUEST_DATE", label: "Request Date" },
        { value: "DESCRIPTION", label: "Notes" },
        { value: "TOTAL_AMOUNT", label: "Total Amount" },
        { value: "END_TO_END_ID", label: "End To End Id" },
        { value: "STATUS_PO", label: "Status PO" },
        { value: "STATUS_WORKFLOW", label: "Status Workflow" },

        // { value: "DOC_REFF", label: "Doc. Reference" },
        // { value: "FORM_TO", label: "To" },
        // { value: "TO_ADDRESS", label: "To Address" },
        // { value: "SHIP_TO", label: "Ship To" },
        // { value: "SHIP_TO_ADDRESS", label: "Ship To Address" },
        // { value: "BILL_TO", label: "Bill To" },
        // { value: "BILL_TO_ADDRESS", label: "Bill To Address" },
        // { value: "TERM_CONDITIONS", label: "Terms & Conditions" },
        // { value: "SUB_TOTAL", label: "Subtotal" },
        // { value: "DISCOUNT", label: "Discount" },
        // { value: "SUB_TOTAL_AFTER_DISCOUNT", label: "Subtotal After Discount" },
        // { value: "TOTAL_PPN", label: "Total PPN" },
        
    ];

    return (
        <div>
            <div className="card card-default">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="col-md-12 d-flex align-items-center">
                                <div className="row-per-page-label" style={{ whiteSpace: "nowrap" }}>
                                    Rows per page:
                                </div>
                                <select
                                    style={{ margin: "5px" }}
                                    id="pageSizeSelect"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="form-form-select form-select-sm"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-8 d-flex justify-content-end align-items-center">
                            <div className="btn-group ml-2">
                                <button type="button" className="btn btn-default" onClick={handleRefresh}>
                                    <FaSyncAlt />
                                </button>
                                {/* <button type="button" className="btn btn-default" onClick={handleAddNewPurchaseOrder}>
                                    <FaAddressBook /> Add New
                                </button> */}
                                {selectedRows.size > 0 && (
                                    <>
                                        <button type="button" className="btn btn-default" onClick={handleEditPurchaseOrder}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button type="button" className="btn btn-default" onClick={handleView}>
                                            <FaEye /> View
                                        </button>
                                        <button type="button" className="btn btn-default" onClick={handleDelete}>
                                            <FaTrash /> Delete
                                        </button>
                                        <button type="button" className="btn btn-default" onClick={handleExport}>
                                            <FaFileExport /> Export
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className={`btn ${isFilterOpen ? "btn-secondary" : "btn-default"}`}
                                    onClick={handleFilterToggle}
                                >
                                    {isFilterOpen ? (
                                        <>
                                            <span className="ml-1">
                                                <i className="fa fa-times" />
                                                Close
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <FaFilter /> <span className="ml-1">Filter</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isFilterOpen && (
                    <div className="card-body">
                        <form className="row">
                            <div className="col-md-4 mb-3">
                                <select
                                    className="form-control"
                                    value={filterColumn}
                                    onChange={(e) => setFilterColumn(e.target.value)}
                                >
                                    <option value="">Select a column</option>
                                    {tableHeaders.map(header => (
                                        <option key={header.value} value={header.value}>
                                            {header.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <select
                                    className="form-control"
                                    value={filterOperation}
                                    onChange={(e) => setFilterOperation(e.target.value)}
                                >
                                    <option value="">Select filter</option>
                                    <option value="EQUAL">Equal</option>
                                    <option value="NOTEQUAL">Not Equal</option>
                                    <option value="LIKE">Contains</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter value"
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                />
                            </div>
                        </form>
                        <div className="d-flex justify-content-end align-items-center mt-3">
                            <button className="btn btn-secondary mr-2" onClick={handleResetFilters}>
                                Reset
                            </button>
                            <button className="btn btn-primary" onClick={handleApplyFilters}>
                                Search
                            </button>
                        </div>
                    </div>
                )}
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedRows.size === dataTable.length && dataTable.length > 0}
                                        />
                                    </th>
                                   {tableHeaders.map(header => (
                                    <th>{header.label}</th>
                                   ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingTable ? (
                                    <tr>
                                        <td colSpan={27}>
                                            <div className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : dataTable.length === 0 ? (
                                    <tr>
                                        <td colSpan={27}>
                                            <div className="text-center">No data available</div>
                                        </td>
                                    </tr>
                                ) : (

                                    dataTable.map((item) => (
                                        <tr key={item.ID} onClick={() => handleRowSelect(item.ID)} style={{ cursor: "pointer" }}>
                                            <td onClick={(e) => handleCheckboxSelect(e, item.ID)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.has(item.ID)}
                                                    onChange={(e) => handleCheckboxSelect(e, item.ID)}
                                                />
                                            </td>
                                            <td>{item.PO_NUMBER}</td>               
                                            <td>{item.CREATED_BY}</td>              
                                            <td>{dateFormat(item.ORDER_DATE)}</td> 
                                            <td>{dateFormat(item.REQUEST_DATE)}</td> 
                                            <td>{item.DESCRIPTION}</td>             
                                            <td>
                                                <NumericFormat
                                                    value={item.TOTAL_AMOUNT}
                                                    displayType="text"
                                                    thousandSeparator=","
                                                    prefix="Rp "
                                                />
                                            </td>                                 
                                            <td>{item.ENDTOENDID}</td>
                                            <td>{item.STATUS_PO}</td>                
                                            <td>{item.STATUS}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <FormPagination
                            totalItems={totalItems}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                        <div>
                            {startIndex + 1} - {endIndex} of {totalItems}
                        </div>
                    </div>
                </div>
                <Modal show={isModalOpen} onHide={handleModalClose} size="lg" scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title>View Purchase Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRowData ? (
                            <div>
                                <div className="container">
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">End To End Id:</div>
                                        <div className="col-md-8">{selectedRowData.ENDTOENDID}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">PO Number:</div>
                                        <div className="col-md-8">{selectedRowData.PO_NUMBER}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Status PO:</div>
                                        <div className="col-md-8">{selectedRowData.STATUS_PO}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Status Workflow:</div>
                                        <div className="col-md-8">{selectedRowData.STATUS}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Doc. Reference:</div>
                                        <div className="col-md-8">{selectedRowData.DOC_REFF}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Request Date:</div>
                                        <div className="col-md-8">{dateFormat(selectedRowData.REQUEST_DATE)}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Order Date:</div>
                                        <div className="col-md-8">{dateFormat(selectedRowData.ORDER_DATE)}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Created By:</div>
                                        <div className="col-md-8">{selectedRowData.CREATED_BY}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">To:</div>
                                        <div className="col-md-8">{selectedRowData.FORM_TO}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">To Address:</div>
                                        <div className="col-md-8">{selectedRowData.TO_ADDRESS}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Ship To:</div>
                                        <div className="col-md-8">{selectedRowData.SHIP_TO}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Ship To Address:</div>
                                        <div className="col-md-8">{selectedRowData.SHIP_TO_ADDRESS}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Bill To:</div>
                                        <div className="col-md-8">{selectedRowData.BILL_TO}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Bill To Address:</div>
                                        <div className="col-md-8">{selectedRowData.BILL_TO_ADDRESS}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Terms and Conditions:</div>
                                        <div className="col-md-8">{selectedRowData.TERM_CONDITIONS}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Notes:</div>
                                        <div className="col-md-8">{selectedRowData.DESCRIPTION}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Subtotal:</div>
                                        <div className="col-md-8">
                                            <NumericFormat
                                                value={selectedRowData.TOTAL_BEFORE_DISCOUNT}
                                                displayType="text"
                                                thousandSeparator=","
                                                prefix="Rp "
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Discount:</div>
                                        <div className="col-md-8">
                                            <NumericFormat
                                                value={selectedRowData.DISCOUNT}
                                                displayType="text"
                                                thousandSeparator=","
                                                prefix="Rp "
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Subtotal After Discount:</div>
                                        <div className="col-md-8">
                                            <NumericFormat
                                                value={selectedRowData.TOTAL_AFTER_DISCOUNT}
                                                displayType="text"
                                                thousandSeparator=","
                                                prefix="Rp "
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Total PPN:</div>
                                        <div className="col-md-8">
                                            <NumericFormat
                                                value={selectedRowData.TOTAL_AMOUNT_PPN}
                                                displayType="text"
                                                thousandSeparator=","
                                                prefix="Rp "
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Total Amount:</div>
                                        <div className="col-md-8">
                                            <NumericFormat
                                                value={selectedRowData.TOTAL_AMOUNT}
                                                displayType="text"
                                                thousandSeparator=","
                                                prefix="Rp "
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Add more fields as needed */}
                                <div style={{overflowX: 'auto'}}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                               <th>Doc Reff Number</th>
                                               <th>Doc Source</th>
                                               <th>Vendor</th>
                                               <th>Company</th>
                                               <th>Project</th>
                                               <th>Project Contract Number</th>
                                               <th>Requestor</th>
                                               <th>Customer</th>
                                               <th>Department</th>
                                               <th>Product</th>
                                               <th>Product Description</th>
                                               <th>Quantity</th>
                                               <th>Currency</th>
                                               <th>Unit Price</th>
                                               <th>Total Price</th>
                                               <th>Type of VAT</th>
                                               <th>Tax PPN Type</th>
                                               <th>Tax PPN Rate</th>
                                               <th>Tax PPN Amount</th>
                                               <th>Tax Base</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRowDataItem
                                                .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                                                .map((detail) => (
                                                    <tr key={detail.ID}>
                                                        <td>{detail.doc_reff_no}</td>
                                                        <td>{detail.doc_source}</td>
                                                        <td>{detail.vendor}</td>
                                                        <td>{detail.company}</td>
                                                        <td>{detail.project}</td>
                                                        <td>{detail.project_contract_number}</td>
                                                        <td>{detail.requestor}</td>
                                                        <td>{detail.customer}</td>
                                                        <td>{detail.departement}</td>
                                                        <td>{detail.product}</td>
                                                        <td>{detail.product_note}</td>
                                                        <td>{detail.quantity}</td>
                                                        <td>{detail.currency}</td>
                                                        <td style={{ textAlign: "right" }}>{DisplayFormat(detail.unit_price)}</td>
                                                        <td style={{ textAlign: "right" }}>{DisplayFormat(detail.total_price)}</td>
                                                        <td>{detail.type_of_vat}</td>
                                                        <td>{detail.tax_ppn}</td>
                                                        <td>{detail.tax_ppn_rate}</td>
                                                        <td>{DisplayFormat(detail.tax_ppn_amount)}</td>
                                                        <td>{DisplayFormat(detail.tax_base)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <p>No data selected.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default PurchaseOrderTable;