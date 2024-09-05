import React, { useState, useEffect } from "react";
import FormPagination from "../utils/FormPagination";
import { NumericFormat } from "react-number-format";
import { FaAddressBook, FaEye, FaFilter, FaSyncAlt } from "react-icons/fa";
import { FaEdit, FaTrash, FaFileExport } from "react-icons/fa"; // Import icons for Edit, Delete, and Export
import { Button, Modal, Table } from "react-bootstrap";
import { getBranch, getToken } from "../config/Constant";
import LookupService from "../service/LookupService";
import { DisplayFormat } from "../utils/DisplayFormat";
import Swal from "sweetalert2";

const PurchaseRequestTable = ({
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
    addingNewPurchaseRequest,
    EditPurchaseRequest,
    selectedData
}) => {
    const headers = getToken();
    const branchId = getBranch();
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

        const PR_NUMBER = rowData.PR_NUMBER;
        console.log('Fetching data for PR_NUMBER:', PR_NUMBER);

        LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
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

    const handleAddNewPurchaseRequest = () => {
        addingNewPurchaseRequest(true);
    };

    const handleEditPurchaseRequest = (value) => {
        const dataSelected = getSelectedRowsData();
        if (dataSelected.length > 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Multiple Rows Selected',
                text: 'Please select only one row to edit.',
                confirmButtonText: 'OK',
            });
            return; // Exit the function if multiple rows are selected
        }
        EditPurchaseRequest(true);
        selectedData(dataSelected);
    }
    const handleViewPurchaseRequest = (value) => {
        ViewPurchaseRequest(true);
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


    const handleEdit = () => {
        const selectedData = getSelectedRowsData();
        if (selectedData.length > 0) {
            // For simplicity, we'll log the data here
            console.log("Edit selected rows data:", selectedData);

            // Open a modal or navigate to an edit page with the selected data
            // Example: openEditModal(selectedData); // Implement this function based on your modal logic
        } else {
            alert("No rows selected for editing.");
        }
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
        const PR_NUMBER = selectedData[0].PR_NUMBER;
        console.log('Fetching data for PR_NUMBER:', PR_NUMBER);

        LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
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

    const handleExport = () => {
        // Add logic for exporting selected rows
        console.log("Export selected rows:", Array.from(selectedRows));
    };

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
                                <button type="button" className="btn btn-default" onClick={handleAddNewPurchaseRequest}>
                                    <FaAddressBook /> Add New
                                </button>
                                {selectedRows.size > 0 && (
                                    <>
                                        <button type="button" className="btn btn-default" onClick={handleEditPurchaseRequest}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button type="button" className="btn btn-default" onClick={handleView}>
                                            <FaEye /> View
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
                                    <option value="PR_NUMBER">PR Number</option>
                                    <option value="TITLE">Title</option>
                                    <option value="REQUEST_DATE">Request Date</option>
                                    <option value="SCHEDULE_DATE">Schedule Date</option>
                                    <option value="DOC_NO">Document Number</option>
                                    <option value="REQUESTOR">Requestor</option>
                                    <option value="DEPARTEMENT">Department</option>
                                    <option value="COMPANY">Company</option>
                                    <option value="PROJECT">Project</option>
                                    <option value="TOTAL_AMOUNT">Total Amount</option>
                                    <option value="DESCRIPTION">Description</option>
                                    <option value="CREATED_BY">Created By</option>
                                    <option value="CHECKED_BY_1">Checked By 1</option>
                                    <option value="CHECKED_BY_2">Checked By 2</option>
                                    <option value="APPROVED_BY">Approved By</option>
                                    <option value="STATUS_REQUEST">Status Request</option>
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
                                    <th>PR Number</th>
                                    <th>Request Date</th>
                                    <th>Schedule Date</th>
                                    <th>Document Number</th>
                                    <th>Document Reference</th>
                                    <th>Requestor</th>
                                    <th>Department</th>
                                    <th>Company</th>
                                    <th>Project</th>
                                    <th>Customer</th>
                                    <th>Total Amount</th>
                                    <th>Description</th>
                                    <th>Created By</th>
                                    <th>Checked By 1</th>
                                    <th>Checked By 2</th>
                                    <th>Approved By</th>
                                    <th>Status Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingTable ? (
                                    <tr>
                                        <td colSpan={19}>
                                            <div className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : dataTable.length === 0 ? (
                                    <tr>
                                        <td colSpan={19}>
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
                                            <td>{item.PR_NUMBER}</td>
                                            <td>{item.REQUEST_DATE}</td>
                                            <td>{item.SCHEDULE_DATE}</td>
                                            <td>{item.DOC_NO}</td>
                                            <td>{item.DOC_REFF}</td>
                                            <td>{item.REQUESTOR}</td>
                                            <td>{item.DEPARTEMENT}</td>
                                            <td>{item.COMPANY}</td>
                                            <td>{item.PROJECT}</td>
                                            <td>{item.CUSTOMER}</td>
                                            <td style={{ textAlign: "right" }}>{DisplayFormat(item.TOTAL_AMOUNT)}
                                            </td>
                                            <td>{item.DESCRIPTION}</td>
                                            <td>{item.CREATED_BY}</td>
                                            <td>{item.CHECKED_BY_1}</td>
                                            <td>{item.CHECKED_BY_2}</td>
                                            <td>{item.APPROVED_BY}</td>
                                            <td>{item.STATUS_REQUEST}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination-container">
                        <FormPagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
                <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>View Purchase Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRowData ? (
                            <div>
                                <div className="container">
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">PR Number:</div>
                                        <div className="col-md-8">{selectedRowData.PR_NUMBER}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Requestor:</div>
                                        <div className="col-md-8">{selectedRowData.REQUESTOR}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Departement:</div>
                                        <div className="col-md-8">{selectedRowData.DEPARTEMENT}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Company:</div>
                                        <div className="col-md-8">{selectedRowData.COMPANY}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Project:</div>
                                        <div className="col-md-8">{selectedRowData.PROJECT}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Customer:</div>
                                        <div className="col-md-8">{selectedRowData.CUSTOMER}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Request Date:</div>
                                        <div className="col-md-8">{selectedRowData.REQUEST_DATE}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Schedule Date:</div>
                                        <div className="col-md-8">{selectedRowData.SCHEDULE_DATE}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Document Number:</div>
                                        <div className="col-md-8">{selectedRowData.DOC_NO}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Document Reference:</div>
                                        <div className="col-md-8">{selectedRowData.DOC_REFF}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Description:</div>
                                        <div className="col-md-8">{selectedRowData.DESCRIPTION}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Created By:</div>
                                        <div className="col-md-8">{selectedRowData.CREATED_BY}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Checked By 1:</div>
                                        <div className="col-md-8">{selectedRowData.CHECKED_BY_1}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Checked By 2:</div>
                                        <div className="col-md-8">{selectedRowData.CHECKED_BY_2}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Approved By:</div>
                                        <div className="col-md-8">{selectedRowData.APPROVED_BY}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Total Amount:</div>
                                        <div className="col-md-8">{DisplayFormat(selectedRowData.TOTAL_AMOUNT)}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 font-weight-bold">Status Request:</div>
                                        <div className="col-md-8">{selectedRowData.STATUS_REQUEST}</div>
                                    </div>
                                </div>
                                {/* Add more fields as needed */}

                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Product Note</th>
                                            <th>Currency</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Total Price</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedRowDataItem.map((detail) => (
                                            <tr key={detail.ID}>
                                                <td>{detail.product}</td>
                                                <td>{detail.product_note}</td>
                                                <td>{detail.currency}</td>
                                                <td>{detail.quantity}</td>
                                                <td textAlign="right">{DisplayFormat(detail.unit_price)}</td>
                                                <td textAlign="right">{DisplayFormat(detail.total_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
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

export default PurchaseRequestTable;
