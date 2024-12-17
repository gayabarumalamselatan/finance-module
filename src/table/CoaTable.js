import React, { useState } from "react";
import { FaAddressBook, FaFilter, FaSyncAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";
import FormPagination from "../utils/FormPagination";
import AddCoaModal from "../modal/AddCoaModal";
import axios from "axios";
import { FORM_SERVICE_INSERT_DATA } from "../config/ConfigUrl";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";

const CoaTable = ({
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
    addingNewBond,
    branchId,
    authToken
}) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showModal, setShowModal] = useState(false);

    // Toggle row expansion
    const toggleRowExpansion = (itemCode) => {
        setExpandedRows(prevExpandedRows => {
            const newExpandedRows = new Set(prevExpandedRows);
            if (newExpandedRows.has(itemCode)) {
                newExpandedRows.delete(itemCode);
            } else {
                newExpandedRows.add(itemCode);
            }
            return newExpandedRows;
        });
    };

    // Handle checkbox selection
    const handleRowSelect = (itemId) => {
        setSelectedRows(prevSelectedRows => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(itemId)) {
                newSelectedRows.delete(itemId);
            } else {
                newSelectedRows.add(itemId);
            }
            return newSelectedRows;
        });
    };

    // Render tree row
    const renderTreeRow = (item, level = 0, isLast = false) => {
        const children = dataTable.filter(child => child.PARENT_CODE_ID === item.CODE);
        const isLastChild = isLast;

        return (
            <React.Fragment key={item.ID}>
                <tr
                    onClick={() => handleSelect(item)}
                    className={selectedRow === item ? "table-success" : ""}
                >
                    <td>
                        <input
                            type="checkbox"
                            checked={selectedRows.has(item.ID)}
                            onChange={() => handleRowSelect(item.ID)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </td>
                    <td style={{ paddingLeft: `${level * 20}px`, paddingBottom: isLastChild ? '20px' : '5px' }}>
                        {children.length > 0 && (
                            <button
                                className="btn btn-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRowExpansion(item.CODE);
                                }}
                            >
                                {expandedRows.has(item.CODE) ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                        )}
                        {item.CODE}
                    </td>
                    <td style={{ paddingLeft: `${level * 20}px`, paddingBottom: isLastChild ? '20px' : '0' }}>{item.NAME}</td>
                    <td style={{ paddingBottom: isLastChild ? '20px' : '0' }}>{item.TYPE}</td>
                    <td style={{ paddingBottom: isLastChild ? '20px' : '0' }}>{item.CURRENCY}</td>
                    <td style={{ paddingBottom: isLastChild ? '20px' : '0' }}>{item.DESCRIPTION}</td>
                </tr>
                {expandedRows.has(item.CODE) && children.map((child, index) => 
                    renderTreeRow(child, level + 1, index === children.length - 1)
                )}
            </React.Fragment>
        );
    };

    // Render tree table
    const renderTreeTable = () => {
        return dataTable
            .filter(item => !dataTable.some(parent => parent.CODE === item.PARENT_CODE_ID))
            .map((item, index, array) => renderTreeRow(item, 0, index === array.length - 1));
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleNewBond = () => {
        addingNewBond(true);
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

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const handleCloseModal = () => {
        setShowModal(false);
      };
      const handleSaveCoa = async (newCoa) => {
            // Replace with the actual token, or fetch it dynamically
          try {
              const response = await axios.post(`${FORM_SERVICE_INSERT_DATA}?f=${formCode[0]}&branchId=${branchId}`, newCoa, {
                  headers: {
                      Authorization: `Bearer ${authToken}`,
                  }
              });
              console.log('Event saved successfully:', response.data);
              messageAlertSwal('Success!', 'Event saved successfully', 'success');
              handleRefresh();
          } catch (error) {
              console.error('Error saving event:', error);
              // Handle error (e.g., show a notification)
          }
      };




    return (
        <div>
            <div className="card card-default">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            {/* <div className="col-md-12 d-flex align-items-center">
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
                            </div> */}
                        </div>
                        <div className="col-md-8 d-flex justify-content-end align-items-center">
                            <div className="btn-group ml-2">
                                <button type="button" className="btn btn-default" onClick={handleRefresh}>
                                    <FaSyncAlt />
                                </button>
                                <button type="button" className="btn btn-default" onClick={() => setShowModal(true)}>
                                    <FaAddressBook /> Add New
                                </button>
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
                                    <option value="CODE">Code</option>
                                    <option value="NAME">Name</option>
                                    <option value="TYPE">Type</option>
                                    <option value="CURRENCY">Currency</option>
                                    <option value="DESCRIPTION">Description</option>
                                    <option value="IS_PARENT">Is Parent</option>
                                    <option value="PARENT_CODE_ID">Parent Code ID</option>
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
                                            checked={selectedRows.size === dataTable.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRows(new Set(dataTable.map(item => item.ID)));
                                                } else {
                                                    setSelectedRows(new Set());
                                                }
                                            }}
                                        />
                                    </th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Currency</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTreeTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
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
            <AddCoaModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleSave={handleSaveCoa} 
            />
        </div>
    );
};

export default CoaTable;
