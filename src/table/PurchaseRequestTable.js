  import React, { useState, useEffect } from "react";
import FormPagination from "../utils/FormPagination";
import { NumericFormat } from "react-number-format";
import { FaAddressBook, FaFilter, FaSyncAlt } from "react-icons/fa";
import { FaEdit, FaTrash, FaFileExport } from "react-icons/fa"; // Import icons for Edit, Delete, and Export

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
    addingNewPurchaseRequest
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');
    const [showAdditionalContent, setShowAdditionalContent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Clear selected rows when data changes
        setSelectedRows([]);
    }, [dataTable]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(dataTable.map(item => item.PR_NUMBER)); // Assuming PR_NUMBER is unique
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (item) => {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(item.PR_NUMBER)) {
                return prevSelectedRows.filter(row => row !== item.PR_NUMBER);
            } else {
                return [...prevSelectedRows, item.PR_NUMBER];
            }
        });
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleNewBond = () => {
        addingNewPurchaseRequest(true);
    };

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

    const handleEdit = () => {
        // Add logic for editing selected rows
        console.log("Edit selected rows:", selectedRows);
    };

    const handleDelete = () => {
        // Add logic for deleting selected rows
        console.log("Delete selected rows:", selectedRows);
    };

    const handleExport = () => {
        // Add logic for exporting selected rows
        console.log("Export selected rows:", selectedRows);
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
                                <button type="button" className="btn btn-default" onClick={handleNewBond}>
                                    <FaAddressBook /> Add New
                                </button>
                                {selectedRows.length > 0 && (
                                    <>
                                        <button type="button" className="btn btn-default" onClick={handleEdit}>
                                            <FaEdit /> Edit
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
                                            checked={selectedRows.length === dataTable.length && dataTable.length > 0}
                                        />
                                    </th>
                                    <th>PR Number</th>
                                    <th>Title</th>
                                    <th>Request Date</th>
                                    <th>Schedule Date</th>
                                    <th>Document Number</th>
                                    <th>Requestor</th>
                                    <th>Department</th>
                                    <th>Company</th>
                                    <th>Project</th>
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
                                        <td colSpan="17" className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : dataTable.length === 0 ? (
                                    <tr>
                                        <td colSpan="17" className="text-center">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable.map((item) => (
                                        <tr key={item.PR_NUMBER}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(item.PR_NUMBER)}
                                                    onChange={() => handleRowSelect(item)}
                                                />
                                            </td>
                                            <td>{item.PR_NUMBER}</td>
                                            <td>{item.TITLE}</td>
                                            <td>{item.REQUEST_DATE}</td>
                                            <td>{item.SCHEDULE_DATE}</td>
                                            <td>{item.DOC_NO}</td>
                                            <td>{item.REQUESTOR}</td>
                                            <td>{item.DEPARTEMENT}</td>
                                            <td>{item.COMPANY}</td>
                                            <td>{item.PROJECT}</td>
                                            <td>
                                                <NumericFormat
                                                    value={item.TOTAL_AMOUNT}
                                                    displayType="text"
                                                    thousandSeparator=","
                                                    prefix="Rp "
                                                />
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
                        <FormPagination
                            pageSize={pageSize}
                            handlePageSizeChange={handlePageSizeChange}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            totalItems={totalItems}
                        />
                    </div>
                </div>
            </div>
            {showAdditionalContent && <div>Additional content here...</div>}
        </div>
    );
};

export default PurchaseRequestTable;